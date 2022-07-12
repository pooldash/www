import { ValidatorReward } from '../models/ValidatorReward';
import { pc } from './Prisma';

interface Validator {
    name: string;
    poktAddr: string;
}

export namespace ValidatorRepo {

    export const getAllValidators = async (): Promise<Validator[]> => {
        return await pc.validator.findMany();
    };

    const saveReward = async (reward: ValidatorReward) => {
        const { blockHeight, amount, date } = reward;
        try {
            await pc.validatorReward.create({
                data: {
                    blockHeight,
                    amount,
                    date,
                    validator: {
                        connect: {
                            poktAddr: reward.addr
                        }
                    }
                }
            });
        } catch (e) {
            console.error(e);
        }
    };

    export const saveRewards = async (recentRewards: ValidatorReward[]) => {
        const savePromises = recentRewards.map(saveReward);
        await Promise.all(savePromises);
    };

    export const getRewardsForBlock = async (blockHeight: bigint): Promise<ValidatorReward[]> => {
        return await pc.validatorReward.findMany({
            where: { blockHeight },
            orderBy: { amount: 'desc' }
        });
    };

    export const getValidatorCount = async (): Promise<number> => {
        return await pc.validator.count();
    };

    // Overly complicated way to get validator count, including partial-counts for validators staked on that day.
    export const getValidatorCountOnDate = async (beginningOfDay: Date, endOfDay: Date): Promise<number> => {

        const fetchTotalValidatorCount = await pc.validator.count({
            where: {
                stakeDate: {
                    lte: beginningOfDay
                }
            }
        });

        const fetchPartialValidators = await pc.validator.findMany({
            where: {
                AND: [
                    {
                        stakeDate: {
                            gte: beginningOfDay
                        }
                    },
                    {
                        stakeDate: {
                            lt: endOfDay
                        }
                    }
                ]
            }
        });

        // Batch the async stuff...
        const [totalValidatorCount, partialValidators] = await Promise.all([fetchTotalValidatorCount, fetchPartialValidators]);

        // daylight savings etc...
        const millisecondsInDay = endOfDay.getTime() - beginningOfDay.getTime();
        
        const partialValidatorCount = partialValidators
            .map(pv => pv.stakeDate)
            .map(stakeDate => endOfDay.getTime() - stakeDate.getTime())
            .map(millisecondsStakedThatDay => millisecondsStakedThatDay / millisecondsInDay)
            .reduce((a,b) => a + b, 0);

        return totalValidatorCount + partialValidatorCount;
    };

    export const getLastTenRewardBlocks = async(): Promise<{blockHeight: bigint, upokt: bigint}[]> => {
        const results = await pc.validatorReward.groupBy({
            by: ['blockHeight'],
            where: {
                amount: { gt: 0 },
            },
            _sum: { amount: true },
            orderBy: [{ blockHeight: 'desc' }],
            take: 10,
        });

        return results.map(r => ({
            blockHeight: r.blockHeight,
            upokt: r._sum.amount,
        }));
    };

    export const getBlockRewardsBetweenDates = async(start: Date, end: Date): Promise<{blockHeight: bigint, upokt: bigint}[]> => {
        const results = await pc.validatorReward.groupBy({
            by: ['blockHeight'],
            where: {
                amount: { gt: 0 },
                date: {
                    gte: start,
                    lte: end,
                },
            },
            _sum: { amount: true },
            orderBy: [{ blockHeight: 'desc' }],
        });

        return results.map(r => ({
            blockHeight: r.blockHeight,
            upokt: r._sum.amount,
        }));
    };

    export const getRewardSumBetweenDates = async(start: Date, end: Date): Promise<bigint> => {
        const result = await pc.validatorReward.aggregate({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
            },
            _sum: { amount: true },
        });

        return result._sum.amount;
    };

    export const getDatelessValidators = async (): Promise<Validator[]> => {
        return await pc.validator.findMany({
            where: {
                OR: [
                    { stakeDate: null },
                    { stakeHeight: null },
                ],
            }
        });
    };

    export const setDateForValidator = async (poktAddr: string, stakeHeight: bigint, stakeDate: Date) => {
        await pc.validator.update({
            where: { poktAddr },
            data: {
                stakeHeight,
                stakeDate,
            }
        });
    };
}
