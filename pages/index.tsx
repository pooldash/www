import styles from './index.module.scss';
import * as React from 'react';
import { Staker } from '~/components/staker';
import { LandingContent } from '~/components/landing/content';
import { TotalStaked } from '~/components/landing/totalStaked';
import { Logo } from '~/components/landing/logo';

const Home: React.FC = () => {
    return (<>
        <div className={styles.containerLight}>
            <div className={styles.totalStakedContainer}>
                <Logo />
                <TotalStaked />
            </div>
            
            <div className={styles.walletButtonContainer}>
                <Staker />
            </div>
            
        </div>
        <LandingContent />
    </>);
};
export default Home;
