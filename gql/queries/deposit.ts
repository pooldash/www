import { gql } from '@apollo/client';

export const GET_DEPOSIT_ADDRESS = gql`
  query GetDepositAddress($ethAddr: String!) {
      getDepositAddress(ethAddr: $ethAddr)
  }
`;

export const GENERATE_DEPOSIT_ADDRESS = gql`
  mutation GenerateDepositAddress($ethAddr: String!, $signature: String!) {
      generateDepositAddress(ethAddr: $ethAddr, signature: $signature)
  }
`;
