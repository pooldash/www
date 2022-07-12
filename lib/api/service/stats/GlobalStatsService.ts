import { GlobalStats } from '~/gql/generated/types';
import { Util } from '~/lib/util';
import { BalanceRepo } from '../../repo/BalanceRepo';
import { ValidatorRepo } from '../../repo/ValidatorRepo';
import { SlowCache } from '../CacheService';

export const poktToStakeNewNode = 15100;

export namespace GlobalStatsService {
    export const global = async (cacheBust: boolean): Promise<GlobalStats> => {

        if (!cacheBust) {
            const cached = await SlowCache.get('stats');
            if (cached) {
                return JSON.parse(cached);
            } 
        }

        const [upoktStaked, numDepositors, numNodes] = await Promise.all([
            BalanceRepo.getLatestTotalBalanceUPokt(),
            BalanceRepo.getNumOfAddressesWithBalance(),
            ValidatorRepo.getValidatorCount(),
        ]);

        const pokt = Util.microPoktToPokt(upoktStaked);

        const results = {
            pokt,
            numDepositors,
            numNodes
        };

        await SlowCache.set('stats', JSON.stringify(results));

        return results;
    };
}