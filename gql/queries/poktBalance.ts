import { gql } from '@apollo/client';

export const GET_LATEST_POKT_BALANCE = gql`
    query GetLatestPoktBalance($ethAddr: String!) {
        getLatestPoktBalanceForEthAddr(ethAddr: $ethAddr){
            pokt
        }
    }
`;