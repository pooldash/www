import { Ledger } from '@prisma/client';
import { Util } from '~/lib/util';
import { Deposit, Withdraw } from '../models/Deposit';
import { Earnings } from '../models/Earnings';
import { EmailService } from '../service/Email/EmailService';
import { pc } from './Prisma';

export enum VirtualTxType {
    REWARDS = 'rewards',
    DEPOSIT = 'deposit',
    WITHDRAW_REQUEST = 'withdraw_request',
}

interface BalanceDiff {
    ethAddr: string;
    amount: bigint;
}

export namespace LedgerRepo {

    // export const 
    // TODO: get latest entry for user, blockHeight & then virtualTxNumber.

    export const getUserLedgerEntry = async (ethAddr: string, maxBlockHeight: bigint): Promise<Ledger> => {
        return await pc.ledger.findFirst({
            where: {
                ethAddr,
                blockHeight: { lte: maxBlockHeight }
            },
            orderBy: [
                { blockHeight: 'desc' },
                { virtualTxNum: 'desc' },
            ]
        });
    };

    export const getUserBalanceCaseInsensitve = async (ethAddr: string): Promise<bigint> => {
        const result = await pc.ledger.findFirst({
            where: {
                ethAddr: {
                    equals: ethAddr,
                    mode: 'insensitive',
                }
            },
            orderBy: [{
                virtualTxNum: 'desc'
            }]
        });

        return result.balanceAfter;
    };

    export const getUserRewardsCaseInsensitveAfterDate = async (ethAddr: string, earliest: Date): Promise<bigint> => {
        const result = await pc.ledger.aggregate({
            where: {
                ethAddr: {
                    equals: ethAddr,
                    mode: 'insensitive',
                },
                type: { equals: VirtualTxType.REWARDS },
                date: { gte: earliest }
            },
            _sum: { amount: true }
        });

        return result._sum.amount;
    };

    const saveTx = async (type: VirtualTxType, ethAddr: string, uPokt: bigint, blockHeight: bigint, date: Date) => {
        
        // Just in-case there are future entries, cascade them forward by 1:
        const futureEntries = await pc.ledger.findMany({
            where: {
                ethAddr, 
                blockHeight: {
                    gt: blockHeight
                } 
            },
            orderBy: [{ virtualTxNum: 'desc' }]     // This lets the cascade happen without stomping on the unique constraint
        });
        if (futureEntries.length > 0) {
            // Keep an eye out for super-spam here, consider sending fewer emails.
            await EmailService.oldTransactionFound(ethAddr, `${Util.microPoktToPokt(uPokt)}`);

            // TODO: batch this at some point.
            console.log(`Cascading change to ${futureEntries.length} transactions`);
            for (const tx of futureEntries) {
                await pc.ledger.update({
                    where: {
                        id: tx.id
                    },
                    data: {
                        balanceBefore: tx.balanceBefore + uPokt,
                        balanceAfter: tx.balanceAfter + uPokt,
                        virtualTxNum: tx.virtualTxNum + BigInt(1)
                    }
                });
            }
        }

        // Now save the new entry:
        let txNumber = BigInt(0);
        let balanceBefore = BigInt(0);

        try {
            const last = await LedgerRepo.getUserLedgerEntry(ethAddr, blockHeight);
            txNumber = last.virtualTxNum + BigInt(1);
            balanceBefore = last.balanceAfter;
        } catch (e) {
            console.log('This is the first ledger entry for user ' + ethAddr);
        }
        
        await pc.ledger.create({
            data: {
                amount: uPokt,
                balanceBefore,
                balanceAfter: balanceBefore + uPokt,
                blockHeight,
                virtualTxNum: txNumber,
                ethAddr: ethAddr,
                type,
                date,
            }
        });
    };

    export const saveEarnings = async (earnings: Earnings, blockHeight: bigint, date: Date) => {
        await saveTx(VirtualTxType.REWARDS, earnings.ethAddr, earnings.amount, blockHeight, date);
    };

    export const saveDeposit = async (deposit: Deposit, blockHeight: bigint, date: Date) => {
        await saveTx(VirtualTxType.DEPOSIT, deposit.ethAddr, deposit.amount, blockHeight, date);
    };

    export const saveWithdraw = async (withdraw: Withdraw, blockHeight: bigint, date: Date) => {
        await saveTx(VirtualTxType.WITHDRAW_REQUEST, withdraw.ethAddr, -withdraw.amount, blockHeight, date);
    };

    export const getBalanceDiffsForBlock = async (blockHeight: bigint): Promise<BalanceDiff[]> => {
        const entries = await pc.ledger.groupBy({
            by: ['blockHeight', 'ethAddr'],
            where: { blockHeight },
            _sum: { amount: true },
            having: {
                amount: {
                    _sum: {
                        not: 0
                    }
                }
            }
        });

        return entries.map(e => ({
            ethAddr: e.ethAddr,
            amount: e._sum.amount
        }));
    };

    // TODO: be more selective about which data gets returned.
    export const getEntriesForAddress = async (ethAddr: string): Promise<Ledger[]> => {
        return await pc.ledger.findMany({
            where: { ethAddr },
            orderBy: { blockHeight: 'desc' }
        });
    };

    export const getActivityForBlock = async (blockHeight: bigint): Promise<Ledger[]> => {
        return await pc.ledger.findMany({
            where: { blockHeight },
        });
    };
}


/**
  id            BigInt  @id @default(autoincrement())
  ethAddr       String
  virtualTxNum  BigInt
  blockHeight   BigInt  @db.BigInt
  type          String
  amount        BigInt
  balanceBefore BigInt
  balanceAfter  BigInt
  txHash        String?
 */