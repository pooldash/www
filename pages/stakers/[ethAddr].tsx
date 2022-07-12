import styles from './[ethAddr].module.scss';
import * as React from 'react';
import { useRouter } from 'next/router';
import { PoktBalance } from '~/components/staker/poktBalance';

const Block: React.FC = () => {
    const router = useRouter();
    const { ethAddr } = router.query;
    if (!ethAddr || !(typeof ethAddr === 'string')) {
        return <></>;
    }

    return (<div className={styles.containerLight}>
        <div className={styles.stakerContainer}>
            <PoktBalance ethAddr={ethAddr} />
        </div>
    </div>);
};
export default Block;
