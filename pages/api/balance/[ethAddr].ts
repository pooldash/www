import { NextApiHandler } from 'next';
import { LedgerRepo } from '~/lib/api/repo/LedgerRepo';
import { PriceService } from '~/lib/api/service/PriceService';
import { Util } from '~/lib/util';


const handler: NextApiHandler = async (req, res) => {
    // Force the eth addr to a certain shape:
    let ethAddr: string = req.query.ethAddr as string;

    const nowTimestamp = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    const dayAgoTimestamp = nowTimestamp - dayInMs;
    const dayAgo = new Date(dayAgoTimestamp);
    const weekAgoTimestamp = nowTimestamp - (dayInMs * 7);
    const weekAgo = new Date(weekAgoTimestamp);

    if (ethAddr.toLowerCase().substring(0, 2) != '0x') {
        ethAddr = '0x' + ethAddr;
    }

    const [
        balanceUpokt,
        dailyRewardsUpokt,
        weeklyRewardsUpokt,
        price_usd
    ] = await Promise.all([
        LedgerRepo.getUserBalanceCaseInsensitve(ethAddr),
        LedgerRepo.getUserRewardsCaseInsensitveAfterDate(ethAddr, dayAgo),
        LedgerRepo.getUserRewardsCaseInsensitveAfterDate(ethAddr, weekAgo),
        PriceService.getPoktPriceDollars()
    ]);

    const balance_pokt = Util.microPoktToPokt(balanceUpokt);
    const day_pokt = Util.microPoktToPokt(dailyRewardsUpokt);
    const week_pokt = Util.microPoktToPokt(weeklyRewardsUpokt);
    const balance_usd = price_usd * balance_pokt;

    return res.send({
        balance_pokt,
        day_pokt,
        week_pokt,
        balance_usd,
        price_usd
    });
};

export default handler;
