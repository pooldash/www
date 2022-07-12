import { NextApiHandler } from 'next';
import { ADMIN_SECRET } from '~/lib/api/env';
import { RevenueRepo } from '~/lib/api/repo/RevenueRepo';
import { PocketService } from '~/lib/api/service/PocketService';
import { Util } from '~/lib/util';


interface DevpayRequestBody {
    admin_secret: string;
}

// see graphql/index.ts for a better example.
const handler: NextApiHandler = async (req, res) => {
    const data: DevpayRequestBody = req.body;
    const date = new Date();
    const blockHeight = await PocketService.getCurrentBlockHeight();

    if (ADMIN_SECRET !== data.admin_secret) {
        throw 'Unauthorized!';
    }

    // Check the total unrealized revenue:
    const unrealized_rev_upokt = await RevenueRepo.getUnrealizedRevenue();
    // Make sure it's remotely worth sending (more than 1 POKT)
    const txFeeUpokt = Util.poktToMicroPokt(0.01);
    const amountToSendEachDev = (unrealized_rev_upokt / BigInt(2)) - txFeeUpokt;

    if (Util.microPoktToPokt(amountToSendEachDev) < 1) {
        throw 'Not enough revenue to send!';
    }

    // Log the withdrawal in the ledger:
    await RevenueRepo.savePayout(unrealized_rev_upokt, blockHeight, date);

    // Return the amount to send each dev, after account for the tx fees:
    return res.json({
        send_each_upokt: `${amountToSendEachDev}`
    });
};

export default handler;
