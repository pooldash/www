import { useLazyQuery, useMutation } from '@apollo/client';
import React, { useContext, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Button } from '~/components/button/button';
import { GetDepositAddressQuery, GetDepositAddressQueryVariables, GenerateDepositAddressMutation, GenerateDepositAddressMutationVariables } from '~/gql/generated/types';
import { GET_DEPOSIT_ADDRESS, GENERATE_DEPOSIT_ADDRESS } from '~/gql/queries/deposit';
import { Loadable } from '../loading/Loadable';
import { Section } from '../section';
import { StakerContext } from './context';
import { useSignedRequest } from './ethHelpers/useSignMessage';
import styles from './index.module.scss';

/// This component is responsible for generating the POKT deposit address for a given eth address.
export const PoktWidget: React.FC = () => {
    const context = useContext(StakerContext);
    const signedRequests = useSignedRequest();

    const [fetchDepositAddress, fetchDepositAddressResult] = useLazyQuery<GetDepositAddressQuery, GetDepositAddressQueryVariables>(GET_DEPOSIT_ADDRESS);
    const [generateDepositAddress, generateDepositAddressResult] = useMutation<GenerateDepositAddressMutation, GenerateDepositAddressMutationVariables>(GENERATE_DEPOSIT_ADDRESS);

    const isLoading = fetchDepositAddressResult.loading || generateDepositAddressResult.loading;

    // Try to fetch an existing deposit address immediately when the component is mounted.
    useEffect(() => {
        generateDepositAddressResult?.reset();
        if (!context.ethAddress) { return; }
        
        fetchDepositAddress({
            variables: {
                ethAddr: context.ethAddress
            }
        });
    }, [context.ethAddress]);

    // Update context whenever an address is successfully fetched
    let resolvedPoktAddress = null;
    if (!!context.ethAddress) {
        resolvedPoktAddress = fetchDepositAddressResult.data?.getDepositAddress ?? generateDepositAddressResult.data?.generateDepositAddress;
    }

    useEffect(() => {
        context.setPoktAddress(resolvedPoktAddress ?? null);
    }, [resolvedPoktAddress, context.setPoktAddress]);

    // *************************** end hooks ***************************

    // If no ETH address exists, return nothing
    if (!context.ethAddress) {
        return <></>;
    }

    const handleGenerateDepositAddressPress = async () => {
        if (isLoading) { 
            console.log('Ignored button press because request is in flight.');
            return;
        }
        
        const signature = await signedRequests.generateDepositAddress(context.ethAddress);
        generateDepositAddress({
            variables: {
                ethAddr: context.ethAddress,
                signature,
            }
        });
    };

    // It's probably a good idea to always display the UI based on the pokt address in the context (not locally fetched one):
    const { poktAddress } = context;

    return <Section title='POKT Staking Address:'>
        <Loadable loading={isLoading}>
            {!poktAddress && <Button text='Generate POKT Address' backgroundColor='#7DF1E6' color='black' onPress={handleGenerateDepositAddressPress}/>}
            {poktAddress && <>
                <div className={styles.addressText}>
                    DEPOSITS ARE CANCELED
                </div>
            </>
            }
            <br />
            <div className={styles.explainerText}>
                StakeRiver is currently unstaking all funds, for more info please view the Discord.
            </div>
        </Loadable>
    </Section>; 
};
