import crypto from 'crypto';
import { PocketService } from './PocketService';
import { pc } from '../repo/Prisma';
import { generateDepositMessage, generateWithdrawMessage } from '~/lib/messages';
import { Web3Service } from './Web3Service';
import { EmailService } from './Email/EmailService';
import { BalanceRepo } from '../repo/BalanceRepo';
import { Activity, PersonalBalance } from '~/gql/generated/types';
import { PriceService } from './PriceService';
import { Util } from '~/lib/util';
import { LedgerRepo } from '../repo/LedgerRepo';

export namespace AddressService {

    const validateSignatureForDepositAddressRequest = async (ethAddress: string, signature: string): Promise<boolean> => {
        const message = generateDepositMessage(ethAddress);
        return Web3Service.validateMessageSignedByAddress(message, signature, ethAddress);
    };

    const validateSignatureForWithdrawRequest = async (ethAddress: string, poktAddress: string, poktAmount: number, signature: string): Promise<boolean> => {
        const message = generateWithdrawMessage(ethAddress, poktAddress, poktAmount);
        return Web3Service.validateMessageSignedByAddress(message, signature, ethAddress);
    };

    export const getDepositAddress = async (info: { ethAddr: string }): Promise<string | null> => {
        const pocketAddr = await pc.pocketAddress.findFirst({
            where: {
                ethAddr: {
                    equals: info.ethAddr
                }
            }
        });
        return pocketAddr?.address ?? null;
    };

    export const generateDepositAddress = async (info: { ethAddr: string, signature: string }): Promise<string | null> => {
        const { ethAddr, signature } = info;

        if (!validateSignatureForDepositAddressRequest(ethAddr, signature)) {
            console.error(`Message from ethAddr(${ethAddr}) failed signature validation.`);
            console.dir(signature);
            return null;
        }

        const existingAddress = await AddressService.getDepositAddress({ ethAddr });
        if (existingAddress) {
            console.log(`Address already exists for: ${ethAddr}`);
            return existingAddress;
        }

        const account = await PocketService.generateNewAddress();
        const dbEntry = await pc.pocketAddress.create({
            data: {
                id: crypto.randomUUID(),
                privateKey: account.privateKey,
                publicKey: account.publicKey,
                address: account.address,
                ethAddr: ethAddr
            }
        });

        await EmailService.depositAddressGenerated(account.address, ethAddr);

        return dbEntry.address;
    };

    export const getLatestPoktBalanceForEthAddr = async (info: { ethAddr: string }): Promise<PersonalBalance | null> => {
        const { ethAddr } = info;

        const upokt = await BalanceRepo.getLatestBalanceForEthAddr(ethAddr);
        const pokt = Util.microPoktToPokt(upokt);
        return {
            pokt,
        };
    };

    export const handleWithdrawRequest = async (info: {
        ethAddr: string,
        poktAddr: string,
        poktAmount: number,
        signature: string,
    }): Promise<boolean> => {
        const { ethAddr, signature, poktAddr, poktAmount } = info;

        if (!validateSignatureForWithdrawRequest(ethAddr, poktAddr, poktAmount, signature)) {
            console.error(`Withdraw message from ethAddr(${ethAddr}) failed signature validation.`);
            console.dir(signature);
            return false;
        }

        const blockHeight = await PocketService.getCurrentBlockHeight();
        const date = new Date();

        await EmailService.withdrawRequested(ethAddr, poktAmount);

        LedgerRepo.saveWithdraw({ ethAddr, amount: Util.poktToMicroPokt(poktAmount) }, blockHeight, date);

        return true;
    };

    export const getActivity = async (info: { ethAddr: string }): Promise<Activity[]> => {
        const { ethAddr } = info;
        const transactions = await LedgerRepo.getEntriesForAddress(ethAddr);
        return transactions.map(t => ({
            blockHeight: `${t.blockHeight}`,
            pokt: Util.microPoktToPokt(t.amount),
            type: t.type,
            poktBalanceAfter: Util.microPoktToPokt(t.balanceAfter),
        }));
        // return [
        //     {
        //         'type': 'rewards',
        //         'blockHeight': '54365',
        //         'pokt': 0.424926,
        //         'poktBalanceAfter': 5000,
        //     },
        //     {
        //         'type': 'rewards',
        //         'blockHeight': '54337',
        //         'pokt': 18.369574,
        //         'poktBalanceAfter': 4000,
        //     },
        //     {
        //         'type': 'rewards',
        //         'blockHeight': '54333',
        //         'pokt': 0.485492,
        //         'poktBalanceAfter': 3500,
        //     },
        //     {
        //         'type': 'rewards',
        //         'blockHeight': '54332',
        //         'pokt': 15.890721,
        //         'poktBalanceAfter': 5000,
        //     },
        //     {
        //         'type': 'rewards',
        //         'blockHeight': '54309',
        //         'pokt': 7.620666,
        //         'poktBalanceAfter': 2000,
        //     },
        //     {
        //         'type': 'rewards',
        //         'blockHeight': '54300',
        //         'pokt': 0.463861,
        //         'poktBalanceAfter': 2500,
        //     },
        //     {
        //         'type': 'rewards',
        //         'blockHeight': '54293',
        //         'pokt': 0.51289,
        //         'poktBalanceAfter': 1000,
        //     },
        // ];
    };
}
