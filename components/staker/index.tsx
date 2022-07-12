import React from 'react';
import { useStakerContextRootProviderOnly } from './context/useStakerContext';
import { EthWidget } from './eth';
import { StakerContext } from './context';
import { EthWalletProvider } from './ethHelpers/ThirdwebProvider';
import { PoktWidget } from './deposit';
import { PoktBalance } from './poktBalance';
import styles from './index.module.scss';

/// This is our main staking app. Connects an ETH wallet & resolves a POKT address for it.
export const Staker: React.FC = () => {

    const context = useStakerContextRootProviderOnly();

    return (
        <EthWalletProvider>
            <StakerContext.Provider value={context}>
                <div className={styles.stakerContainer}>
                    <EthWidget />
                    <PoktWidget />
                    {context.ethAddress && <PoktBalance ethAddr={context.ethAddress} />}
                </div>
            </StakerContext.Provider>
        </EthWalletProvider>
    );
};
