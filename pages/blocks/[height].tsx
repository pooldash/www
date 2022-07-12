import styles from './[height].module.scss';
import * as React from 'react';
import { useRouter } from 'next/router';
import { BlockDetails } from '~/components/block/blockDetails';

const Block: React.FC = () => {
    const router = useRouter();
    const { height } = router.query;
    if (!height || !(typeof height === 'string')) {
        return <></>;
    }

    return (<>
        <div className={styles.containerLight}>
            <BlockDetails height={height} />  
        </div>
    </>);
};
export default Block;
