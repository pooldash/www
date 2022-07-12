import { NextApiHandler } from 'next';
import { ADMIN_SECRET } from '~/lib/api/env';
import { LedgerRepo } from '~/lib/api/repo/LedgerRepo';
import { pc } from '~/lib/api/repo/Prisma';
import { AddressService } from '~/lib/api/service/AddressService';
import { PocketService } from '~/lib/api/service/PocketService';


interface TransferRequestBody {
    admin_secret: string;
    from_eth_addr: string;
    to_eth_addr: string;
    amount_upokt: string;
}

// see graphql/index.ts for a better example.
const handler: NextApiHandler = async (req, res) => {
    const data: TransferRequestBody = req.body;
    const date = new Date();

    if (ADMIN_SECRET !== data.admin_secret) {
        throw 'Unauthorized!';
    }
    
    // Make sure the sender has the funds:
    const balance = await LedgerRepo.getUserBalanceCaseInsensitve(data.from_eth_addr);
    const amount_upokt = BigInt(data.amount_upokt);
    if (balance < amount_upokt) {
        throw 'Not enough funds!';
    }
    
    // We're just making sure the receiver exists:
    const receiverDepositAddress = await AddressService.getDepositAddress({ ethAddr: data.to_eth_addr });
    if (!receiverDepositAddress) {
        throw 'Invalid recipient';
    }

    // Make the transfer:
    const blockHeight = await PocketService.getCurrentBlockHeight();
    await pc.internalTransfer.create({
        data: {
            blockHeight,
            fromEthAddr: data.from_eth_addr,
            toEthAddr: data.to_eth_addr,
            amount: amount_upokt
        }
    });

    // Withdraw from sender:
    await LedgerRepo.saveWithdraw({
        amount: amount_upokt,
        ethAddr: data.from_eth_addr,
    }, blockHeight, date);

    // Deposit in another:
    await LedgerRepo.saveDeposit({
        amount: amount_upokt,
        ethAddr: data.to_eth_addr
    }, blockHeight, date);

    res.send('Success!');
};

export default handler;
