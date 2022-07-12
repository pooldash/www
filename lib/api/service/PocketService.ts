import { Account, CoinDenom, Configuration, HttpRpcProvider, Pocket, RawTxResponse, RpcError, Transaction, TransactionSender } from '@pokt-network/pocket-js';
import { Util } from '~/lib/util';
import { POCKET_SECRET_PASSPHRASE } from '../env';

interface PocketAccountInfo {
    address: string;
    privateKey: string;
    publicKey: string;
}

interface ValidatorReward {
    addr: string;
    blockHeight: bigint;
    amount: bigint;
}

export namespace PocketService {

    export const txFeeUpokt = Util.poktToMicroPokt(0.01);

    const getPocketInstance = (address?: string): Pocket => {
        const url = address ?? 'https://rash-report-329.stakeriver.com';
        const maxDispatchers = 5;
        const maxSessions = 2000;
        const requestTimeOut = 100000;
        const configuration = new Configuration(
            maxDispatchers,
            maxSessions,
            undefined,
            requestTimeOut,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            false
        );
        const dispatchURLs = [new URL(url)];
        const rpcProvider = new HttpRpcProvider(dispatchURLs[0]);

        return new Pocket(dispatchURLs, rpcProvider, configuration);
    };

    export const generateNewAddress = async (): Promise<PocketAccountInfo> => {
        const pocket = getPocketInstance();
        const account = await pocket.keybase.createAccount(POCKET_SECRET_PASSPHRASE);
        if (account instanceof Error) {
            console.error('Somehow failed to create pocket account');
            console.dir(account);
            return null;
        }
        const exportedPrivateKeyBuffer = await pocket.keybase.exportAccount(account.addressHex, POCKET_SECRET_PASSPHRASE);
        const exportedPrivateKeyHex = exportedPrivateKeyBuffer.toString('hex');

        return {
            address: account.addressHex,
            privateKey: exportedPrivateKeyHex,
            publicKey: account.publicKey.toString('base64'),
        };
    };

    export const getBalance = async (address: string, blockHeight?: bigint): Promise<bigint> => {
        const pocket = getPocketInstance();
        const result = await pocket.rpc().query.getBalance(address, blockHeight);
        if (result instanceof RpcError) {
            console.error('Error fetching account balance:');
            console.error(address);
            const summary = `${ result.name } ${ result.code }: ${ result.message }`;
            console.error(summary);
            return Promise.reject(summary);
        }
        return result.balance.valueOf();
    };

    export const getRewardMultiplierForHeight = async (height: bigint): Promise<bigint> => {
        const pocket = getPocketInstance();
        const result = await pocket.rpc().query.getAllParams(height);
        if (result instanceof RpcError) {
            console.error('Error fetching params for height:');
            console.error(height);
            const summary = `${ result.name } ${ result.code }: ${ result.message }`;
            console.error(summary);
            return Promise.reject(summary);
        }

        const p = Util.firstOrNull(
            result.nodeParams
                .filter(p => p.paramKey === 'pos/RelaysToTokensMultiplier')
                .map(p => BigInt(p.paramValue))
        );

        return p;
    };

    export const getDaoAllocationForHeight = async (height: bigint): Promise<bigint> => {
        const pocket = getPocketInstance();
        const result = await pocket.rpc().query.getAllParams(height);
        if (result instanceof RpcError) {
            console.error('Error fetching params for height:');
            console.error(height);
            const summary = `${ result.name } ${ result.code }: ${ result.message }`;
            console.error(summary);
            return Promise.reject(summary);
        }

        const p = Util.firstOrNull(
            result.nodeParams
                .filter(p => p.paramKey === 'pos/DAOAllocation')
                .map(p => BigInt(p.paramValue))
        );

        return p;
    };

    export const getPoktTransactions = async (address: string): Promise<Transaction[]> => {
        const pocket = getPocketInstance();

        /// Get inbound & outbound:
        const fetchReceived = pocket.rpc().query.getAccountTxs(address, true, false, undefined, 100);
        const fetchSent = pocket.rpc().query.getAccountTxs(address, false, false, undefined, 100);
        const [resultReceived, resultSent] = await Promise.all([fetchReceived, fetchSent]);

        if (resultReceived instanceof RpcError) {
            console.error('Error fetching account transactions:');
            console.error(address);
            const summary = `${ resultReceived.name } ${ resultReceived.code }: ${ resultReceived.message }`;
            console.error(summary);
            return Promise.reject(summary);
        }

        if (resultSent instanceof RpcError) {
            console.error('Error fetching account transactions:');
            console.error(address);
            const summary = `${ resultSent.name } ${ resultSent.code }: ${ resultSent.message }`;
            console.error(summary);
            return Promise.reject(summary);
        }

        /// Merge them
        const result = resultReceived.transactions.concat(resultSent.transactions)
            .filter(tx => tx.txResult.code === 0);      /// Only include the successful transactions!

        /// Sort by block, then by index
        result.sort((a, b) => {
            if (a.height.valueOf() === b.height.valueOf()) {
                return Number(a.index.valueOf() - b.index.valueOf());
            }
            return Number(a.height.valueOf() - b.height.valueOf());
        });
        return result;
    };

    export const getTransactions = async (address: string): Promise<string[]> => {
        const result = await PocketService.getPoktTransactions(address);
        return result.map(x => JSON.stringify(x.toJSON()));
    };

    export const getCurrentBlockHeight = async (): Promise<bigint> => {
        const pocket = getPocketInstance();
        const resultReceived = await pocket.rpc().query.getHeight();

        if (resultReceived instanceof RpcError) {
            console.error('Error fetching POKT block height');
            const summary = `${ resultReceived.name } ${ resultReceived.code }: ${ resultReceived.message }`;
            console.error(summary);
            return Promise.reject(summary);
        }

        return resultReceived.height.valueOf();
    };

    export const getRewardsForAddress = async (rawAddress: string, blockHeight: bigint): Promise<bigint> => {
        const addr = rawAddress.toLowerCase();

        // Check the balance before & after:
        const prevBlockHeight = blockHeight - BigInt(1);
        const fetchPrevBalance = PocketService.getBalance(addr, prevBlockHeight);
        const fetchCurrentBalance = PocketService.getBalance(addr, blockHeight);


        // Also get a look at the transactions:
        const fetchRecentTransactions = PocketService.getPoktTransactions(addr);

        // Fetch everything at once:
        const [prevBalance, currentBalance, recentTX] = await Promise.all([fetchPrevBalance, fetchCurrentBalance, fetchRecentTransactions]);

        // Calculate the diff in balance due to sends / receives / stakes:
        const txThisBlock = recentTX.filter(t => t.height === blockHeight);
        const sendsAndStakesAmount = txThisBlock
            .filter(t => ['pos/Send', 'pos/MsgStake'].indexOf(t.stdTx.msg.type) > -1)
            .filter(t => t.stdTx.msg.value.from_address === addr)
            .map(t => BigInt(t.stdTx.msg.value.amount) + BigInt(t.stdTx.fee.amount))
            .reduce((a, b) => a + b, BigInt(0));     // This is just a sum

        const receivedAmount = txThisBlock
            .filter(t => t.stdTx.msg.type === 'pos/Send')
            .filter(t => t.stdTx.msg.value.to_address === addr)
            .map(t => BigInt(t.stdTx.msg.value.amount))
            .reduce((a, b) => a + b, BigInt(0));     // This is just a sum

        // We assume the denom is upokt, throw otherwise
        txThisBlock.forEach(t => {
            if (t.stdTx.fee.denom.toLowerCase() !== CoinDenom.Upokt.toLowerCase()) {
                throw 'Unexpected denomination!!';
            }
        });

        const expectedDiff = receivedAmount - sendsAndStakesAmount;
        const actualDiff = currentBalance - prevBalance;
        return actualDiff - expectedDiff;
    };

    export const fetchRewardsForAddress = async (addr: string, blockHeight: bigint): Promise<ValidatorReward> => {
        const amount = await PocketService.getRewardsForAddress(addr, blockHeight);
        return {
            addr,
            blockHeight,
            amount,
        };
    };

    /// Returns tx hash of POKT tx
    export const sendPokt = async (from: { pk: string }, to: string, amountUPokt: bigint): Promise<RawTxResponse> => {
        const pocket = getPocketInstance();

        console.log('Sending pokt 1');
        // https://github.com/pokt-network/pocket-js/blob/74612052892b86065d255ff4b20f01faff626ccd/doc/quickstart.md
        const fromAccountPK = Buffer.from(from.pk, 'hex');

        // TODO: better error handling here.
        let account = await pocket.keybase.importAccount(fromAccountPK, POCKET_SECRET_PASSPHRASE) as Account;
        console.log('Account from: ' + account.addressHex);

        console.log('Sending pokt 2');

        const transactionSender = await pocket.withImportedAccount(account.addressHex, POCKET_SECRET_PASSPHRASE) as TransactionSender;
        if (transactionSender instanceof Error) {
            console.error('YIKES!!!!');
        }

        console.log('Sending pokt 3');

        const toAddress = to;
        const chainID = 'mainnet';
        const fee = `${ PocketService.txFeeUpokt }`;
        const balanceToSend = `${ amountUPokt }`;

        console.log('toAddress: ' + to);
        console.log('chainID: ' + chainID);
        console.log('fee: ' + fee);
        console.log('balanceToSend: ' + balanceToSend);

        const rawTx = transactionSender.send(account.addressHex, toAddress, balanceToSend);
        const rawTxResponse = await rawTx.submit(chainID, fee, CoinDenom.Upokt, 'stakeriverxfer', 20000);
        console.log(rawTxResponse);

        if (rawTxResponse instanceof RpcError) {
            console.error(rawTxResponse.name);
            console.error(rawTxResponse.message);
            console.error(rawTxResponse.code);
            throw 'bye';
        }

        console.log('Sending pokt 4');

        // Print your transaction hash
        console.log(rawTxResponse.hash);
        return rawTxResponse;
    };

    export const getTimestampForBlock = async (blockHeight: bigint): Promise<string> => {
        const pocket = getPocketInstance();
        const resultReceived = await pocket.rpc().query.getBlock(blockHeight);
        if (resultReceived instanceof RpcError) {
            console.error('Error fetching block height:');
            console.error(blockHeight);
            const summary = `${ resultReceived.name } ${ resultReceived.code }: ${ resultReceived.message }`;
            console.error(summary);
            return Promise.reject(summary);
        }

        return resultReceived.block.header.time;
    };

    export const getHeightForValidator = async (pocketAddress: string): Promise<{ addr: string, height: bigint }> => {
        const pocket = getPocketInstance(pocketAddress);
        const resultReceived = await pocket.rpc().query.getHeight();
        if (resultReceived instanceof RpcError) {
            console.error('Error fetching block height for validator:');
            console.error(pocketAddress);
            const summary = `${ resultReceived.name } ${ resultReceived.code }: ${ resultReceived.message }`;
            console.error(summary);
            return Promise.reject(summary);
        }

        return {
            addr: pocketAddress,
            height: resultReceived.height.valueOf()
        };
    };
}
