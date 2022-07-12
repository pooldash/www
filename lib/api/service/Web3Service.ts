import { fromRpcSig, ecrecover, pubToAddress, hashPersonalMessage } from 'ethereumjs-util';
import { util } from '../apiUtil';

export namespace Web3Service {
    export const validateMessageSignedByAddress = (message: string, signature: string, address: string): boolean => {
        // Extract signature properties
        const { v, r, s } = fromRpcSig(signature);
        
        // Get the message bytes juuuust right for ecrecover:
        const messageBuffer = Buffer.from(message);
        const hashedMessageBuffer = hashPersonalMessage(messageBuffer);

        // The only interesting thing in this whole function:
        const recoveredPublicKey = ecrecover(hashedMessageBuffer, v, r, s);

        // Calculate the address associated with the signing key here:
        const recoveredAddressBuffer = pubToAddress(recoveredPublicKey);
        const recoveredAddress = recoveredAddressBuffer.toString('hex');
        
        // See if it's equal to the caller:
        return compareEthAddresses(recoveredAddress, address);
    };

    const compareEthAddresses = (a: string, b: string): boolean => {
        const cleanA = util.removePrefix(a.toUpperCase(), '0X');
        const cleanB = util.removePrefix(b.toUpperCase(), '0X');
        return cleanA === cleanB;
    };
}
