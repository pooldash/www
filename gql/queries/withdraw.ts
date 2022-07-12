import { gql } from '@apollo/client';

export const REQUEST_WITHDRAW = gql`
  mutation withdraw ($ethAddr: String!, $poktAddr: String!, $poktAmount: Float!, $signature: String!) {
      withdraw(ethAddr: $ethAddr, poktAddr: $poktAddr, poktAmount: $poktAmount, signature: $signature)
  }
`;
