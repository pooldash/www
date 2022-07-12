import { gql } from 'apollo-server-micro';

const schema = gql`
type Query {
    getDepositAddress(ethAddr: String!): String
    getBalance(poktAddr: String!, blockHeight: String): String!
    getTransactions(poktAddr: String!): [String!]!
    getRewards(poktAddr: String!, blockHeight: String!): String!
    getStats: GlobalStats!
    getLatestPoktBalanceForEthAddr(ethAddr: String!): PersonalBalance
    getActivity(ethAddr: String!): [Activity!]!
    getBlockDetails(blockHeight: String!): BlockRewardDetails!
    getRecentBlockRewards: [BlockReward!]!
    getDailyRewards: [DailyReward!]!
    getBlocksForDay(day: String!): [BlockReward!]!
    getAdminStats: AdminStats!
    heightCheck: HeightResult!
}
type Mutation {
    generateDepositAddress(ethAddr: String!, signature: String!): String
    withdraw(ethAddr: String!, poktAddr: String!, poktAmount: Float!, signature: String!): Boolean!
}

type ValidatorHeight {
    url: String!
    height: String!
}

type HeightResult {
    maxDiff: Float!
    heights: [ValidatorHeight!]!
}

type AdminStats {
    nodeBalance: Float!
    bankBalance: Float!
    revenue: Float!
}

type GlobalStats {
    pokt: Float!
    numDepositors: Int!
    numNodes: Float!
}

type BlockReward {
    pokt: Float!
    blockHeight: String!
}

type DailyReward {
    pokt: Float!
    day: String!
    numNodes: Float!
}

type PersonalBalance {
    pokt: Float!
}

type Activity {
    blockHeight: String!
    pokt: Float!
    type: String!
    poktBalanceAfter: Float!
}

type BlockShare {
    ethAddr: String!
    percent: Float!
    rewards: Float!
    withdrawn: Float!
    deposited: Float!
    balanceBefore: Float!
    balanceAfter: Float!
}

type ValidatorBlock {
    addr: String!
    name: String!
    pokt: Float!
}

type BlockRewardDetails {
    blockHeight: String!
    totalRewards: Float!
    totalWithdrawn: Float!
    totalDeposited: Float!
    splits: [BlockShare!]!
    validators: [ValidatorBlock!]!
}
`;

export default schema;
