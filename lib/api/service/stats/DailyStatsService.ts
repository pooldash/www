import moment from 'moment';
import { DailyReward } from '~/gql/generated/types';
import { batchEmUp } from '~/lib/batch';
import { Util } from '~/lib/util';
import { ValidatorRepo } from '../../repo/ValidatorRepo';
import { SlowCache } from '../CacheService';


export namespace DailyStatsService {

    const getRewardsForDay = async (day: string): Promise<DailyReward> => {
        const startDate = new Date(day);
        
        // gross.
        const endDate = new Date(day);
        endDate.setDate(startDate.getDate() + 1);

        const [numNodes, upokt] = await Promise.all([
            ValidatorRepo.getValidatorCountOnDate(startDate, endDate),
            ValidatorRepo.getRewardSumBetweenDates(startDate, endDate),
        ]);

        return {
            pokt: Util.microPoktToPokt(upokt),
            day,
            numNodes
        };
    };

    export const getDailyRewards = async(cacheBust: boolean): Promise<DailyReward[]> => {

        if (!cacheBust) {
            const cached = await SlowCache.get('daily_rewards');
            if (cached) {
                return JSON.parse(cached);
            }
        }
        
        const days: string[] = [];
        const date = new Date();
        for (let i = 0; i < 10; i++) {
            const dateString = moment(date).format('YYYY-MM-DD');
            days.push(dateString);
            date.setDate(date.getDate() - 1);
        }

        // The DB connection pool maxes out early, so only do like 2 at once:
        const results = await batchEmUp(
            days.map(getRewardsForDay),
            2
        );

        await SlowCache.set('daily_rewards', JSON.stringify(results));
        
        return results;
    };
}
