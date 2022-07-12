import { BlockReward, BlockRewardDetails, BlockShare } from '~/gql/generated/types';
import { Util } from '~/lib/util';
import { BalanceRepo, PercentageShare } from '../../repo/BalanceRepo';
import { LedgerRepo, VirtualTxType } from '../../repo/LedgerRepo';
import { ValidatorRepo } from '../../repo/ValidatorRepo';
import { SlowCache } from '../CacheService';

export namespace BlockStatsService {
    export const getBlockDetails = async(info: { blockHeight: string | null }): Promise<BlockRewardDetails> => {

        const blockHeight = info.blockHeight ? BigInt(info.blockHeight) : null;
        // It is the previous balance-percentages that affect the distribution of this block's rewards:
        const previousBlockHeight = blockHeight - BigInt(1);

        if (blockHeight) {
            const cached = await SlowCache.get('block_details', blockHeight.toString());
            if (cached) {
                return JSON.parse(cached);
            }
        }

        const [shares, rewards, activity, allValidators, validatorRewards] = await Promise.all([
            BalanceRepo.getAllPercentagesForBlock(previousBlockHeight),
            ValidatorRepo.getRewardsForBlock(blockHeight),
            LedgerRepo.getActivityForBlock(blockHeight),
            ValidatorRepo.getAllValidators(),
            ValidatorRepo.getRewardsForBlock(blockHeight),
        ]);

        //*************************************** */
        // TOTALS
        //*************************************** */
        const totalRewardsMicro = rewards
            .map(r => r.amount)
            .reduce((a,b) => a + b, BigInt(0));
        const totalRewards = Util.microPoktToPokt(totalRewardsMicro);

        const totalWithdrawnMicro = activity
            .filter(a => a.type === VirtualTxType.WITHDRAW_REQUEST)
            .map(a => a.amount)
            .reduce((a,b)=>a+b, BigInt(0));
        const totalWithdrawn = Util.microPoktToPokt(totalWithdrawnMicro);

        const totalDepositedMicro = activity
            .filter(a => a.type === VirtualTxType.DEPOSIT)
            .map(a => a.amount)
            .reduce((a,b)=>a+b, BigInt(0));
        const totalDeposited = Util.microPoktToPokt(totalDepositedMicro);

        //*************************************** */
        // INDIVIDUAL
        //*************************************** */
        const getSplitForShare = (s: PercentageShare): BlockShare => {
            const userRewards = rewards
                .map(r => Util.microPoktToPokt(r.amount) * s.percent)
                .reduce((a,b) => a + b, 0);

            const userWithdrawnMicro = activity
                .filter(a => a.ethAddr === s.ethAddr)
                .filter(a => a.type === VirtualTxType.WITHDRAW_REQUEST)
                .map(a => a.amount)
                .reduce((a,b)=>a+b, BigInt(0));
            const userWithdrawn = Util.microPoktToPokt(userWithdrawnMicro);

            const userDepositedMicro = activity
                .filter(a => a.ethAddr === s.ethAddr)
                .filter(a => a.type === VirtualTxType.DEPOSIT)
                .map(a => a.amount)
                .reduce((a,b)=>a+b, BigInt(0));
            const userDeposited = Util.microPoktToPokt(userDepositedMicro);

            // TODO: verify this math
            const balanceBefore = Util.microPoktToPokt(s.balance);
            const balanceAfter = balanceBefore + userDeposited + userRewards - userWithdrawn;

            return {
                ethAddr: s.ethAddr,
                percent: s.percent,

                balanceAfter,
                balanceBefore,
                deposited: userDeposited,
                rewards: userRewards,
                withdrawn: userWithdrawn,
            };
        };

        // TODO: Include brand new users
        // const newUserActivityAsShares = activity
        //     .filter(a => shares.findIndex((x) => x.ethAddr === a.ethAddr) === -1)
        //     .map(a => ({ percent: 0, ethAddr: a.ethAddr, balance: BigInt(0) }));

        // const netShares = [...shares];
        // newUserActivityAsShares.forEach(nas => {
        //     if (netShares.findIndex(ns => ns.ethAddr === nas.ethAddr) === -1) {
        //         netShares.push(nas);
        //     }
        // });

        const validators = allValidators.map(v => {
            const rewards = validatorRewards
                .filter(vr => vr.addr === v.poktAddr)
                .map(vr => vr.amount)
                .reduce((a,b) => a + b, BigInt(0));
            return {
                addr: v.poktAddr,
                name: v.name,
                pokt: Util.microPoktToPokt(rewards)
            };
        });
        
        const result: BlockRewardDetails = {
            totalRewards,
            totalWithdrawn,
            totalDeposited,
            blockHeight: info.blockHeight,
            splits: shares
                .map(s => ({ ...s, percent: s.percent * 0.75 }))
                .map(getSplitForShare),
            validators,
        };

        await SlowCache.set('block_details', JSON.stringify(result), blockHeight.toString());

        return result;
    };

    export const recentBlockRewards = async (cacheBust?: boolean): Promise<BlockReward[]> => {
        if (!cacheBust) {
            const cached = await SlowCache.get('recent_rewards');
            if (cached) {
                return JSON.parse(cached);
            } 
        }
        const rewards = await ValidatorRepo.getLastTenRewardBlocks();
        const results = rewards.map(r => ({
            pokt: Util.microPoktToPokt(r.upokt),
            blockHeight: `${r.blockHeight}`,
        }));

        await SlowCache.set('recent_rewards', JSON.stringify(results));
        return results;
    };

    export const recentBlockRewardsForDay = async (info: {day: string}): Promise<BlockReward[]> => {
        // Ensure date string is well-formatted (todo: do this better)
        // YYYY-MM-DD
        const { day } = info;
        if (day.length !== 10) {
            return Promise.reject('Improperly formatted day');
        }
        
        const cached = await SlowCache.get('daily_blocks', day);
        if (cached) {
            return JSON.parse(cached);
        }

        const startDate = new Date(day);
        // gross.
        const endDate = new Date(day);
        endDate.setDate(startDate.getDate() + 1);

        const rewards = await ValidatorRepo.getBlockRewardsBetweenDates(startDate, endDate);
        const results = rewards.map(r => ({
            pokt: Util.microPoktToPokt(r.upokt),
            blockHeight: `${r.blockHeight}`,
        }));

        await SlowCache.set('daily_blocks', JSON.stringify(results));
        return results;
    };
}
