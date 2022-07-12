import { gql } from '@apollo/client';

export const GET_LATEST_ACTIVITY = gql`
    query GetActivity($ethAddr: String!) {
        getActivity(ethAddr: $ethAddr){
            blockHeight
            pokt
            type
            poktBalanceAfter
        }
    }
`;