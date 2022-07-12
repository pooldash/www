import { BalanceRepo, PercentageShareTemp } from '../repo/BalanceRepo';
import { RebaseRepo } from '../repo/RebaseRepo';
import { ValidatorRepo } from '../repo/ValidatorRepo';
import { PocketService } from './PocketService';
import _ from 'lodash';
import { LedgerRepo } from '../repo/LedgerRepo';
import { pc } from '../repo/Prisma';
import { PocketAddress } from '@prisma/client';
import { Transaction } from '@pokt-network/pocket-js';
import { EmailService } from './Email/EmailService';
import { Util } from '~/lib/util';
import { ValidatorReward } from '~/lib/api/models/ValidatorReward';
import { RevenueRepo } from '../repo/RevenueRepo';
import { BANKING_ADDRESS } from '../env';
import { BlockDateService } from './BlockDateService';

const bankingAddress = BANKING_ADDRESS;
const rewardsMultiplier = 0.75;

export namespace RebaseService {

    export const rebase = async () => {
        console.log('rebasing');

        const blockToRebase = await RebaseRepo.getNextRebaseBlockHeight();
        console.log(`Trying block: ${blockToRebase}`);

        // Get a lock to make sure this is idempotent:
        const currentBlockHeight = await PocketService.getCurrentBlockHeight();

        if (currentBlockHeight <= blockToRebase) {
            console.log(`We\'re all caught up, skipping rebase. Block height ${currentBlockHeight}`);
            return;
        }
        const rebaseBlockDate = await BlockDateService.getDateForBlock(blockToRebase);

        const currentTime = new Date();
        const lockInfo = await RebaseRepo.ensureRebaseLockOrFail(blockToRebase, currentTime);

        // Calculate & save the rewards based on previous balances
        const lastBlock = blockToRebase - BigInt(1);
        const allPercentages = await BalanceRepo.getAllPercentagesForBlock(lastBlock);
        console.log(`Number of percentages: ${allPercentages.length}`);

        // Get (and save) all the rewards for this block:
        const validators = await ValidatorRepo.getAllValidators();
        const allRewards: ValidatorReward[] = (await Promise.all(
            validators.map(v => PocketService.fetchRewardsForAddress(v.poktAddr, blockToRebase))
        ))
            .map(vr => ({ ...vr, date: rebaseBlockDate }))
            .filter(vr => vr.amount > BigInt(0));
        
        await ValidatorRepo.saveRewards(allRewards);
        const totalEarningsThisBlock = allRewards
            .map(r => r.amount)
            .reduce((a, b) => a + b, BigInt(0));     // This is just a sum

        if (totalEarningsThisBlock > 0) {   
            // Calculate each user's earnings:
            const earnings = allPercentages.map(p => ({
                ethAddr: p.ethAddr,
                amount: BigInt(Math.floor(Number(totalEarningsThisBlock) * p.percent * rewardsMultiplier))
            }));
            console.log('All earnings:');
            console.log(JSON.stringify(earnings.map(e => ({ ethAddr: e.ethAddr, amount: Number(e.amount) }))));

            // Record the earnings (update our virtual ledger):
            for (const e of earnings) {
                try {
                    await LedgerRepo.saveEarnings(e, blockToRebase, rebaseBlockDate);
                } catch (err) {
                    console.error('Warning: failed to save ' + e.ethAddr);
                    console.error(`amount: ${Util.microPoktToPokt(e.amount)} POKT`);
                    // console.error(JSON.stringify(e));
                    throw 'cannot save earnings';
                }
            }

            // House book-keeping
            const revenue = Number(totalEarningsThisBlock) * (1.0 - rewardsMultiplier);
            await RevenueRepo.saveEarnings(BigInt(Math.floor(revenue)), blockToRebase, rebaseBlockDate);
        }

        // Do the block balances.
        const prevBlockBalances = allPercentages;
        const balanceDiffs = await LedgerRepo.getBalanceDiffsForBlock(blockToRebase);
        let newBlockBalances: PercentageShareTemp[] = [];
        prevBlockBalances.forEach(pbb => {
            const i = balanceDiffs.findIndex(bd => bd.ethAddr === pbb.ethAddr);
            if (i >= 0) {
                newBlockBalances.push({
                    ethAddr: pbb.ethAddr,
                    balance: pbb.balance + balanceDiffs[i].amount
                });

            } else {
                newBlockBalances.push(pbb);
            }
        });

        // Don't forget about the new addresses:
        balanceDiffs.forEach(bd => {
            const i = prevBlockBalances.findIndex(pbb => pbb.ethAddr === bd.ethAddr);
            if (i < 0) {
                newBlockBalances.push({
                    ethAddr: bd.ethAddr,
                    balance: bd.amount
                });
            }
        });

        const totalNewBalance = newBlockBalances
            .map(bb => bb.balance)
            .reduce((a,b) => a + b, BigInt(0));

        // get all block-balances for last block.
        const finalBlockBalances = newBlockBalances.map(bb => ({
            ethAddr: bb.ethAddr,
            balance: bb.balance,
            percent: Number(bb.balance) / Number(totalNewBalance)       // TODO: make sure this division is ~safe
        }));

        await BalanceRepo.savePercentagesForBlock(finalBlockBalances, blockToRebase, rebaseBlockDate);

        await RebaseRepo.resolveRebaseAttempt(lockInfo);
        console.log('Done!');
    };

    const processRecentDepositsForAddress = async (da: PocketAddress) => {

        console.log('Checking balance of: ' + da.address);
        // If there is less than 1 tx fee of balance, there's nothing to do:
        const balance = await PocketService.getBalance(da.address);
        if (balance <= PocketService.txFeeUpokt) {
            return;
        }

        console.log('Found deposit for ' + da.address);

        // Look for all the recent received transactions
        const transactions = await PocketService.getPoktTransactions(da.address);
        const received = transactions.filter(tx => tx.stdTx?.msg?.value?.to_address === da.address);

        // find ones without an associated DepositTransfer thing.
        let unProcessedTxs: Transaction[] = [];
        for (const tx of received) {
            const existing = await pc.depositAssoc.findFirst({
                where: {
                    depositTxHash: tx.hash
                }
            });
            if (!existing) {
                unProcessedTxs.push(tx);
            }
        }

        if (unProcessedTxs.length === 0) {
            console.log('==========================');
            console.log('balance is non-zero, but all tx are accounted for.');
            console.log(`Balance: ${balance}\nAddress: ${da.address}`);
            console.log('This probably means that we already processed this deposit, but the transfer tx hasn\'t propagated across the blockchain yet.');
            console.log('==========================');
            return;
        }

        // Get the total amount of the deposits to transfer
        const totalToTransfer = unProcessedTxs
            .map(tx => BigInt(tx.stdTx.msg.value.amount))
            .reduce((a,b) => a+b, BigInt(0));

        const blockHeight = Util.firstOrNull(unProcessedTxs)?.height;

        await EmailService.depositReceived(da.ethAddr, `${Util.microPoktToPokt(totalToTransfer)}`, da.address, `${blockHeight}`);

        // create an DepositTransfer entry in the database
        const depositTransfer = await pc.depositTransfer.create({
            data: {
                amount: totalToTransfer,
                ethAddr: da.ethAddr,
                fee: PocketService.txFeeUpokt,
                deposits: {
                    create: unProcessedTxs.map(tx => ({ depositTxHash: tx.hash }))
                }
            }
        });

        // broadcast the transfer (move it to our banking account, minus 0.01 pokt for fees)
        const transferTx = await PocketService.sendPokt({ pk: da.privateKey }, bankingAddress, totalToTransfer - PocketService.txFeeUpokt);

        console.dir(transferTx);

        // save the hash of this deposit
        await pc.depositTransfer.update({
            where: {
                id: depositTransfer.id,
            },
            data: {
                transferTxHash: transferTx.hash
            }
        });

        try {
            // create a single ledger entry for the total deposit each block for this user:
            interface BlockTxMap {
                [key: string] : bigint;
            } 
            const depositAmountGroupedByBlock: BlockTxMap = unProcessedTxs.reduce((r, a) => {
                const heightString = `${a.height}`;
                const prevAmount = r[heightString] || BigInt(0);
                r[heightString] = prevAmount + a.stdTx.msg.value.amount;
                return r;
            }, {});

            for await (const [heightString, amount] of Object.entries(depositAmountGroupedByBlock)) {
                const blockHeight = BigInt(heightString);
                const date = await BlockDateService.getDateForBlock(blockHeight);

                await LedgerRepo.saveDeposit(
                    {
                        amount,
                        ethAddr: da.ethAddr
                    },
                    blockHeight,
                    date);
            }
        } catch (e) {
            await EmailService.depositCrash();
            throw e;
        }

        // TODO: If an entry already exists for a block... delete it?
    };

    /// Scans all deposit addresses for new transactions:
    export const processDeposits = async () => {
        // get all deposit addresses
        console.log('checking deposits');
        const allDepositAddresses = await pc.pocketAddress.findMany({ take: 1000 });

        console.log('total addresses: ' + allDepositAddresses.length);

        // TODO: batch these up.
        // for (const depositAddress of allDepositAddresses) {
        //     await processRecentDepositsForAddress(depositAddress);
        // }
        await Promise.all(
            allDepositAddresses.map(processRecentDepositsForAddress)
        );

        // TODO: email banking account balance or something.
    };    
}
