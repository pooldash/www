import { gql } from '@apollo/client';

export const GET_STATS = gql`
  query GetStats {
      getStats {
          pokt
          numDepositors
          numNodes
      }
  }
`;

export const GET_RECENT_BLOCK_REWARDS = gql`
  query GetRecentBlockRewards {
      getRecentBlockRewards {
          blockHeight
          pokt
      }
  }
`;

export const GET_DAILY_REWARDS = gql`
  query GetDailyRewards {
    getDailyRewards {
          day
          pokt
          numNodes
      }
  }
`;

export const GET_BLOCKS_FOR_DAY = gql`
  query GetBlocksForDay($day: String!) {
    getBlocksForDay(day: $day) {
          blockHeight
          pokt
      }
  }
`;
