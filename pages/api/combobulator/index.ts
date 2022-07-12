import { NextApiHandler } from 'next';
import { SlowCache } from '~/lib/api/service/CacheService';
import { EmailService } from '~/lib/api/service/Email/EmailService';
import { HealthService } from '~/lib/api/service/HealthService';
import { RebaseService } from '~/lib/api/service/RebaseService';
import { DailyStatsService } from '~/lib/api/service/stats/DailyStatsService';
import { GlobalStatsService } from '~/lib/api/service/stats/GlobalStatsService';
import { ValidatorService } from '~/lib/api/service/ValidatorService';


const handler: NextApiHandler = async (req, res) => {
    await RebaseService.processDeposits();
    // Try rebasing 2 times (lazy, stupid way thats only helpful when catching up)
    // Could do this smarter (only loop / repeat if we're catching up).
    // Oh well.
    try {
        for (let i = 0; i < 2; i++) {
            console.log(`Rebasing ${ i + 1 }/2`);
            await RebaseService.rebase();
        }
    } catch (e) {
        await EmailService.rebaseCrash();
        return res.send('This did not work!');
    }

    // Cache these values for real page-loads in the future:
    // await GlobalStatsService.global(true);
    // await DailyStatsService.getDailyRewards(true);
    // await StatsService.getBlockDetails({ blockHeight: null });

    // Keep the cache from growing too large
    await SlowCache.purge();

    // Backfill some dates today:
    // await BlockDateService.backfillDates();

    // Do some book-keeping:
    // await ValidatorService.ensureStakeDateSet();

    // Check the node height:
    // await HealthService.healthCheck();

    return res.send('This is not the combobulator.');
};

export default handler;
