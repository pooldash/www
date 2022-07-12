import { gql } from '@apollo/client';

export const GET_BLOCK = gql`
  query GetBlockDetails($blockHeight: String!) {
      getBlockDetails(blockHeight: $blockHeight) {
          blockHeight,
          totalRewards,
          totalDeposited,
          totalWithdrawn,
          splits {
            ethAddr,
            rewards,
            percent,
            withdrawn,
            deposited,
            balanceBefore,
            balanceAfter
          }
          validators {
            addr
            name
            pokt
          }
      }
  }
`;
