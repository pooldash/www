export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Activity = {
  blockHeight: Scalars['String'];
  pokt: Scalars['Float'];
  type: Scalars['String'];
  poktBalanceAfter: Scalars['Float'];
};

export type AdminStats = {
  nodeBalance: Scalars['Float'];
  bankBalance: Scalars['Float'];
  revenue: Scalars['Float'];
};

export type BlockReward = {
  pokt: Scalars['Float'];
  blockHeight: Scalars['String'];
};

export type BlockRewardDetails = {
  blockHeight: Scalars['String'];
  totalRewards: Scalars['Float'];
  totalWithdrawn: Scalars['Float'];
  totalDeposited: Scalars['Float'];
  splits: Array<BlockShare>;
  validators: Array<ValidatorBlock>;
};

export type BlockShare = {
  ethAddr: Scalars['String'];
  percent: Scalars['Float'];
  rewards: Scalars['Float'];
  withdrawn: Scalars['Float'];
  deposited: Scalars['Float'];
  balanceBefore: Scalars['Float'];
  balanceAfter: Scalars['Float'];
};

export type DailyReward = {
  pokt: Scalars['Float'];
  day: Scalars['String'];
  numNodes: Scalars['Float'];
};

export type GlobalStats = {
  pokt: Scalars['Float'];
  numDepositors: Scalars['Int'];
  numNodes: Scalars['Float'];
};

export type HeightResult = {
  maxDiff: Scalars['Float'];
  heights: Array<ValidatorHeight>;
};

export type Mutation = {
  generateDepositAddress: Maybe<Scalars['String']>;
  withdraw: Scalars['Boolean'];
};


export type MutationGenerateDepositAddressArgs = {
  ethAddr: Scalars['String'];
  signature: Scalars['String'];
};


export type MutationWithdrawArgs = {
  ethAddr: Scalars['String'];
  poktAddr: Scalars['String'];
  poktAmount: Scalars['Float'];
  signature: Scalars['String'];
};

export type PersonalBalance = {
  pokt: Scalars['Float'];
};

export type Query = {
  getDepositAddress: Maybe<Scalars['String']>;
  getBalance: Scalars['String'];
  getTransactions: Array<Scalars['String']>;
  getRewards: Scalars['String'];
  getStats: GlobalStats;
  getLatestPoktBalanceForEthAddr: Maybe<PersonalBalance>;
  getActivity: Array<Activity>;
  getBlockDetails: BlockRewardDetails;
  getRecentBlockRewards: Array<BlockReward>;
  getDailyRewards: Array<DailyReward>;
  getBlocksForDay: Array<BlockReward>;
  getAdminStats: AdminStats;
  heightCheck: HeightResult;
};


export type QueryGetDepositAddressArgs = {
  ethAddr: Scalars['String'];
};


export type QueryGetBalanceArgs = {
  poktAddr: Scalars['String'];
  blockHeight: Maybe<Scalars['String']>;
};


export type QueryGetTransactionsArgs = {
  poktAddr: Scalars['String'];
};


export type QueryGetRewardsArgs = {
  poktAddr: Scalars['String'];
  blockHeight: Scalars['String'];
};


export type QueryGetLatestPoktBalanceForEthAddrArgs = {
  ethAddr: Scalars['String'];
};


export type QueryGetActivityArgs = {
  ethAddr: Scalars['String'];
};


export type QueryGetBlockDetailsArgs = {
  blockHeight: Scalars['String'];
};


export type QueryGetBlocksForDayArgs = {
  day: Scalars['String'];
};

export type ValidatorBlock = {
  addr: Scalars['String'];
  name: Scalars['String'];
  pokt: Scalars['Float'];
};

export type ValidatorHeight = {
  url: Scalars['String'];
  height: Scalars['String'];
};

export type GetActivityQueryVariables = Exact<{
  ethAddr: Scalars['String'];
}>;


export type GetActivityQuery = { getActivity: Array<Pick<Activity, 'blockHeight' | 'pokt' | 'type' | 'poktBalanceAfter'>> };

export type GetBlockDetailsQueryVariables = Exact<{
  blockHeight: Scalars['String'];
}>;


export type GetBlockDetailsQuery = { getBlockDetails: (
    Pick<BlockRewardDetails, 'blockHeight' | 'totalRewards' | 'totalDeposited' | 'totalWithdrawn'>
    & { splits: Array<Pick<BlockShare, 'ethAddr' | 'rewards' | 'percent' | 'withdrawn' | 'deposited' | 'balanceBefore' | 'balanceAfter'>>, validators: Array<Pick<ValidatorBlock, 'addr' | 'name' | 'pokt'>> }
  ) };

export type GetDepositAddressQueryVariables = Exact<{
  ethAddr: Scalars['String'];
}>;


export type GetDepositAddressQuery = Pick<Query, 'getDepositAddress'>;

export type GenerateDepositAddressMutationVariables = Exact<{
  ethAddr: Scalars['String'];
  signature: Scalars['String'];
}>;


export type GenerateDepositAddressMutation = Pick<Mutation, 'generateDepositAddress'>;

export type GetLatestPoktBalanceQueryVariables = Exact<{
  ethAddr: Scalars['String'];
}>;


export type GetLatestPoktBalanceQuery = { getLatestPoktBalanceForEthAddr: Maybe<Pick<PersonalBalance, 'pokt'>> };

export type GetStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatsQuery = { getStats: Pick<GlobalStats, 'pokt' | 'numDepositors' | 'numNodes'> };

export type GetRecentBlockRewardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecentBlockRewardsQuery = { getRecentBlockRewards: Array<Pick<BlockReward, 'blockHeight' | 'pokt'>> };

export type GetDailyRewardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDailyRewardsQuery = { getDailyRewards: Array<Pick<DailyReward, 'day' | 'pokt' | 'numNodes'>> };

export type GetBlocksForDayQueryVariables = Exact<{
  day: Scalars['String'];
}>;


export type GetBlocksForDayQuery = { getBlocksForDay: Array<Pick<BlockReward, 'blockHeight' | 'pokt'>> };

export type WithdrawMutationVariables = Exact<{
  ethAddr: Scalars['String'];
  poktAddr: Scalars['String'];
  poktAmount: Scalars['Float'];
  signature: Scalars['String'];
}>;


export type WithdrawMutation = Pick<Mutation, 'withdraw'>;
