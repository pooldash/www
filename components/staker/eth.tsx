import { useWeb3 } from '@3rdweb/hooks';
import React, { useContext, useEffect } from 'react';
import { Button } from '~/components/button/button';
import { Util } from '~/lib/util';
import { Section } from '../section';
import { StakerContext } from './context';
import styles from './index.module.scss';

export const EthWidget: React.FC = () => {
    const w3 = useWeb3();

    const context = useContext(StakerContext);

    useEffect(() => {
        context.setEthAddress(w3.address ?? null);
    }, [w3.address, context.setEthAddress]);

    const handleConnectWalletPress = () => {
        w3.connectWallet('injected');
    };

    const handleUnlinkPressed = async () => {
        w3.disconnectWallet();
    };

    const isConnected = !!w3.address;
    const headerMessage = isConnected
        ? 'My Account:'
        : 'Create Account:';
    
    // We don't want people to accidentally copy-paste their ETH address (instead of the POKT deposit address):
    const displayAddress = Util.truncate(w3.address ?? '', 5, 3);

    return <>
        <Section title={headerMessage}>
            {!w3.address && <>
                <div className={styles.explainerText}>Pocket accounts aren't supported by Metamask or Coinbase Wallet yet.</div>
                <br />
                <div className={styles.explainerText}>For now, your ETH Mainnet address is your StakeRiver username. You authenticate by signing messages with your browser wallet.</div>
                <br />
                <Button text='Connect Wallet' backgroundColor='#7DF1E6' color='black' onPress={handleConnectWalletPress}/>
            </>}
            {w3.address && 
                <div className={styles.addressContainer}>
                    <div className={styles.addressText}>
                        {displayAddress}
                    </div>
                    <Button text='Change' onPress={ handleUnlinkPressed } backgroundColor='#7DF1E6' color='black' shrink />
                </div>
                
            }
        </Section>
    </>;
};
