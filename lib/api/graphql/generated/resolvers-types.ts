import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Activity = {
  __typename?: 'Activity';
  blockHeight: Scalars['String'];
  pokt: Scalars['Float'];
  type: Scalars['String'];
  poktBalanceAfter: Scalars['Float'];
};

export type AdminStats = {
  __typename?: 'AdminStats';
  nodeBalance: Scalars['Float'];
  bankBalance: Scalars['Float'];
  revenue: Scalars['Float'];
};

export type BlockReward = {
  __typename?: 'BlockReward';
  pokt: Scalars['Float'];
  blockHeight: Scalars['String'];
};

export type BlockRewardDetails = {
  __typename?: 'BlockRewardDetails';
  blockHeight: Scalars['String'];
  totalRewards: Scalars['Float'];
  totalWithdrawn: Scalars['Float'];
  totalDeposited: Scalars['Float'];
  splits: Array<BlockShare>;
  validators: Array<ValidatorBlock>;
};

export type BlockShare = {
  __typename?: 'BlockShare';
  ethAddr: Scalars['String'];
  percent: Scalars['Float'];
  rewards: Scalars['Float'];
  withdrawn: Scalars['Float'];
  deposited: Scalars['Float'];
  balanceBefore: Scalars['Float'];
  balanceAfter: Scalars['Float'];
};

export type DailyReward = {
  __typename?: 'DailyReward';
  pokt: Scalars['Float'];
  day: Scalars['String'];
  numNodes: Scalars['Float'];
};

export type GlobalStats = {
  __typename?: 'GlobalStats';
  pokt: Scalars['Float'];
  numDepositors: Scalars['Int'];
  numNodes: Scalars['Float'];
};

export type HeightResult = {
  __typename?: 'HeightResult';
  maxDiff: Scalars['Float'];
  heights: Array<ValidatorHeight>;
};

export type Mutation = {
  __typename?: 'Mutation';
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
  __typename?: 'PersonalBalance';
  pokt: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
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
  __typename?: 'ValidatorBlock';
  addr: Scalars['String'];
  name: Scalars['String'];
  pokt: Scalars['Float'];
};

export type ValidatorHeight = {
  __typename?: 'ValidatorHeight';
  url: Scalars['String'];
  height: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Activity: ResolverTypeWrapper<Activity>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  AdminStats: ResolverTypeWrapper<AdminStats>;
  BlockReward: ResolverTypeWrapper<BlockReward>;
  BlockRewardDetails: ResolverTypeWrapper<BlockRewardDetails>;
  BlockShare: ResolverTypeWrapper<BlockShare>;
  DailyReward: ResolverTypeWrapper<DailyReward>;
  GlobalStats: ResolverTypeWrapper<GlobalStats>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  HeightResult: ResolverTypeWrapper<HeightResult>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  PersonalBalance: ResolverTypeWrapper<PersonalBalance>;
  Query: ResolverTypeWrapper<{}>;
  ValidatorBlock: ResolverTypeWrapper<ValidatorBlock>;
  ValidatorHeight: ResolverTypeWrapper<ValidatorHeight>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Activity: Activity;
  String: Scalars['String'];
  Float: Scalars['Float'];
  AdminStats: AdminStats;
  BlockReward: BlockReward;
  BlockRewardDetails: BlockRewardDetails;
  BlockShare: BlockShare;
  DailyReward: DailyReward;
  GlobalStats: GlobalStats;
  Int: Scalars['Int'];
  HeightResult: HeightResult;
  Mutation: {};
  Boolean: Scalars['Boolean'];
  PersonalBalance: PersonalBalance;
  Query: {};
  ValidatorBlock: ValidatorBlock;
  ValidatorHeight: ValidatorHeight;
};

export type ActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Activity'] = ResolversParentTypes['Activity']> = {
  blockHeight: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pokt: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  type: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  poktBalanceAfter: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AdminStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AdminStats'] = ResolversParentTypes['AdminStats']> = {
  nodeBalance: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bankBalance: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  revenue: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockRewardResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockReward'] = ResolversParentTypes['BlockReward']> = {
  pokt: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  blockHeight: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockRewardDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockRewardDetails'] = ResolversParentTypes['BlockRewardDetails']> = {
  blockHeight: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalRewards: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalWithdrawn: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalDeposited: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  splits: Resolver<Array<ResolversTypes['BlockShare']>, ParentType, ContextType>;
  validators: Resolver<Array<ResolversTypes['ValidatorBlock']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockShareResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockShare'] = ResolversParentTypes['BlockShare']> = {
  ethAddr: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  percent: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  rewards: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  withdrawn: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  deposited: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  balanceBefore: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  balanceAfter: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DailyRewardResolvers<ContextType = any, ParentType extends ResolversParentTypes['DailyReward'] = ResolversParentTypes['DailyReward']> = {
  pokt: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  day: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numNodes: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GlobalStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['GlobalStats'] = ResolversParentTypes['GlobalStats']> = {
  pokt: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  numDepositors: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  numNodes: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HeightResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['HeightResult'] = ResolversParentTypes['HeightResult']> = {
  maxDiff: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  heights: Resolver<Array<ResolversTypes['ValidatorHeight']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  generateDepositAddress: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationGenerateDepositAddressArgs, 'ethAddr' | 'signature'>>;
  withdraw: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationWithdrawArgs, 'ethAddr' | 'poktAddr' | 'poktAmount' | 'signature'>>;
};

export type PersonalBalanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonalBalance'] = ResolversParentTypes['PersonalBalance']> = {
  pokt: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getDepositAddress: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryGetDepositAddressArgs, 'ethAddr'>>;
  getBalance: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryGetBalanceArgs, 'poktAddr'>>;
  getTransactions: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryGetTransactionsArgs, 'poktAddr'>>;
  getRewards: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryGetRewardsArgs, 'poktAddr' | 'blockHeight'>>;
  getStats: Resolver<ResolversTypes['GlobalStats'], ParentType, ContextType>;
  getLatestPoktBalanceForEthAddr: Resolver<Maybe<ResolversTypes['PersonalBalance']>, ParentType, ContextType, RequireFields<QueryGetLatestPoktBalanceForEthAddrArgs, 'ethAddr'>>;
  getActivity: Resolver<Array<ResolversTypes['Activity']>, ParentType, ContextType, RequireFields<QueryGetActivityArgs, 'ethAddr'>>;
  getBlockDetails: Resolver<ResolversTypes['BlockRewardDetails'], ParentType, ContextType, RequireFields<QueryGetBlockDetailsArgs, 'blockHeight'>>;
  getRecentBlockRewards: Resolver<Array<ResolversTypes['BlockReward']>, ParentType, ContextType>;
  getDailyRewards: Resolver<Array<ResolversTypes['DailyReward']>, ParentType, ContextType>;
  getBlocksForDay: Resolver<Array<ResolversTypes['BlockReward']>, ParentType, ContextType, RequireFields<QueryGetBlocksForDayArgs, 'day'>>;
  getAdminStats: Resolver<ResolversTypes['AdminStats'], ParentType, ContextType>;
  heightCheck: Resolver<ResolversTypes['HeightResult'], ParentType, ContextType>;
};

export type ValidatorBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['ValidatorBlock'] = ResolversParentTypes['ValidatorBlock']> = {
  addr: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pokt: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ValidatorHeightResolvers<ContextType = any, ParentType extends ResolversParentTypes['ValidatorHeight'] = ResolversParentTypes['ValidatorHeight']> = {
  url: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Activity: ActivityResolvers<ContextType>;
  AdminStats: AdminStatsResolvers<ContextType>;
  BlockReward: BlockRewardResolvers<ContextType>;
  BlockRewardDetails: BlockRewardDetailsResolvers<ContextType>;
  BlockShare: BlockShareResolvers<ContextType>;
  DailyReward: DailyRewardResolvers<ContextType>;
  GlobalStats: GlobalStatsResolvers<ContextType>;
  HeightResult: HeightResultResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  PersonalBalance: PersonalBalanceResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  ValidatorBlock: ValidatorBlockResolvers<ContextType>;
  ValidatorHeight: ValidatorHeightResolvers<ContextType>;
};

