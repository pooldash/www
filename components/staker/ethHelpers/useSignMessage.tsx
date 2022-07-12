import { useWeb3 } from '@3rdweb/hooks';
import { generateDepositMessage, generateWithdrawMessage } from '~/lib/messages';

interface SignedMessageHookResult {
    generateDepositAddress: (ethAddress: string) => Promise<string>;
    generateWithdrawRequest: (ethAddress: string, poktAddress: string, poktAmount: number) => Promise<string>;
}

/// This must be used from within a web3 provider
export const useSignedRequest = (): SignedMessageHookResult => {
    const w3 = useWeb3();

    const generateDepositAddress = async (ethAddress: string): Promise<string> => {
        const message = generateDepositMessage(ethAddress);
        const signature = await w3.provider?.getSigner().signMessage(message);
        if (!signature) {
            return Promise.reject('Unable to generate signature!');
        }
        return signature;
    };

    const generateWithdrawRequest = async (ethAddress: string, poktAddress: string, poktAmount: number): Promise<string> => {
        const message = generateWithdrawMessage(ethAddress, poktAddress, poktAmount);
        const signature = await w3.provider?.getSigner().signMessage(message);
        if (!signature) {
            return Promise.reject('Unable to generate signature!');
        }
        return signature;
    };

    return {
        generateDepositAddress,
        generateWithdrawRequest,
    };
};
