import { pc } from '../repo/Prisma';
import { SlowCache } from './CacheService';
import { PocketService } from './PocketService';


export namespace BlockDateService {

    export const getDateForBlock = async (blockHeight: bigint): Promise<Date> => {
        const cached = await SlowCache.get('block_date', `${blockHeight}`);
        if (cached) { return new Date(cached); }
        const timestamp = await PocketService.getTimestampForBlock(blockHeight);
        await SlowCache.set('block_date', timestamp, `${blockHeight}`);
        return new Date(timestamp);
    };

    export const backfillDates = async () => {
        // Look for ValidatorRewards:
        const datelessRewardResultsByHeight = await pc.validatorReward.groupBy({
            by: ['blockHeight'],
            where: { date: null },
            orderBy: [{ blockHeight: 'asc' }],
            take: 500,
        });
        const datelessRewardHeights = datelessRewardResultsByHeight.map(res => res.blockHeight);

        for (const height of datelessRewardHeights) {
            const date = await BlockDateService.getDateForBlock(height);
            await pc.validatorReward.updateMany({
                where: { blockHeight: height },
                data: { date }
            });
        }

        // Look for BlockBalances:
        const datelessBlockBalancesByHeight = await pc.blockBalances.groupBy({
            by: ['blockHeight'],
            where: { date: null },
            orderBy: [{ blockHeight: 'asc' }],
            take: 500,
        });
        const datelessBBHeights = datelessBlockBalancesByHeight.map(res => res.blockHeight);

        for (const height of datelessBBHeights) {
            const date = await BlockDateService.getDateForBlock(height);
            await pc.blockBalances.updateMany({
                where: { blockHeight: height },
                data: { date }
            });
        }

        // Look for Ledger rows:
        const datelessLedgerRowsByHeight = await pc.ledger.groupBy({
            by: ['blockHeight'],
            where: { date: null },
            orderBy: [{ blockHeight: 'asc' }],
            take: 500,
        });
        const datelessLedgerHeights = datelessLedgerRowsByHeight.map(res => res.blockHeight);

        for (const height of datelessLedgerHeights) {
            const date = await BlockDateService.getDateForBlock(height);
            await pc.ledger.updateMany({
                where: { blockHeight: height },
                data: { date }
            });
        }

        // Look for revenue ledger rows:
        const datelessRevRowsByHeight = await pc.revenueLedger.groupBy({
            by: ['blockHeight'],
            where: { date: null },
            orderBy: [{ blockHeight: 'asc' }],
            take: 500,
        });
        const datelessRevHeights = datelessRevRowsByHeight.map(res => res.blockHeight);

        for (const height of datelessRevHeights) {
            const date = await BlockDateService.getDateForBlock(height);
            await pc.revenueLedger.updateMany({
                where: { blockHeight: height },
                data: { date }
            });
        }
    };
}
