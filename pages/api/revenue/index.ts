import { NextApiHandler } from 'next';
import { BalanceRepo } from '~/lib/api/repo/BalanceRepo';
import { RevenueRepo } from '~/lib/api/repo/RevenueRepo';
import { ValidatorRepo } from '~/lib/api/repo/ValidatorRepo';
import { PriceService } from '~/lib/api/service/PriceService';
import { Util } from '~/lib/util';


const handler: NextApiHandler = async (req, res) => {
    const nowTimestamp = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    const dayAgoTimestamp = nowTimestamp - dayInMs;
    const dayAgo = new Date(dayAgoTimestamp);
    const weekAgoTimestamp = nowTimestamp - (dayInMs * 7);
    const weekAgo = new Date(weekAgoTimestamp); 
    const foreverAgo = new Date(0);     // Technically, "forever" means 1970

    const [
        balanceUpokt,
        dailyRewardsUpokt,
        weeklyRewardsUpokt,
        allTimeRewardsUpokt,
        num_stakers,
        num_nodes,
        price_usd
    ] = await Promise.all([
        RevenueRepo.getUnrealizedRevenue(),
        RevenueRepo.getRevenueAfterDate(dayAgo),
        RevenueRepo.getRevenueAfterDate(weekAgo),
        RevenueRepo.getRevenueAfterDate(foreverAgo),
        BalanceRepo.getNumOfAddressesWithBalance(),
        ValidatorRepo.getValidatorCount(),
        PriceService.getPoktPriceDollars()
    ]);

    const unrealized_rev = Util.microPoktToPokt(balanceUpokt);
    const day_pokt = Util.microPoktToPokt(dailyRewardsUpokt);
    const week_pokt = Util.microPoktToPokt(weeklyRewardsUpokt);
    const all_time_rev = Util.microPoktToPokt(allTimeRewardsUpokt);
    const unrealized_usd = price_usd * unrealized_rev;

    return res.send({
        unrealized_rev,
        all_time_rev,
        day_pokt,
        week_pokt,
        unrealized_usd,
        num_nodes,
        num_stakers,
        price_usd
    });
};

export default handler;
