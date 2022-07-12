
import { Resolvers } from './generated/resolvers-types';
import { GQLContext } from './gqlContext';
import { AddressService } from '../service/AddressService';
import { PocketService } from '../service/PocketService';
import _ from 'lodash';
import { GlobalStatsService } from '../service/stats/GlobalStatsService';
import { BlockStatsService } from '../service/stats/BlockStatsService';
import { AdminStatsService } from '../service/stats/AdminStatsService';
import { DailyStatsService } from '../service/stats/DailyStatsService';
import { HealthService } from '../service/HealthService';

type MainResolvers = Pick<Resolvers<GQLContext>, 'Query' | 'Mutation'>

/// These map queries & mutations to handler functions.
export const resolvers: MainResolvers = {
    Query: {
        getDepositAddress: async (_, { ethAddr }) => await AddressService.getDepositAddress({ ethAddr }),
        getBalance: async (_, { poktAddr, blockHeight }) => (await PocketService.getBalance(poktAddr, BigInt(blockHeight))).toString(),
        getTransactions: async (_, { poktAddr }) => await PocketService.getTransactions(poktAddr),
        getRewards: async (_, { poktAddr, blockHeight }) => (await PocketService.getRewardsForAddress(poktAddr, BigInt(blockHeight))).toString(),
        getStats: async () => await GlobalStatsService.global(false),
        getLatestPoktBalanceForEthAddr: async (_, { ethAddr }) => await AddressService.getLatestPoktBalanceForEthAddr({ ethAddr }),
        getActivity: async (_, { ethAddr }) => await AddressService.getActivity({ ethAddr }),
        getBlockDetails: async (_, { blockHeight }) => await BlockStatsService.getBlockDetails({ blockHeight }),
        getRecentBlockRewards: async () => await BlockStatsService.recentBlockRewards(false),
        getAdminStats: async () => await AdminStatsService.adminStats(),
        getBlocksForDay: async (_, { day }) => await BlockStatsService.recentBlockRewardsForDay({ day }),
        getDailyRewards: async () => await DailyStatsService.getDailyRewards(false),
        heightCheck: async () => await HealthService.checkHeight()
    },
    Mutation: {
        generateDepositAddress: async (_, { ethAddr, signature }) => await AddressService.generateDepositAddress({ ethAddr, signature }),
        withdraw: async (_, { ethAddr, poktAddr, poktAmount, signature }) => await AddressService.handleWithdrawRequest({ ethAddr, poktAddr, poktAmount, signature })
    },
};
