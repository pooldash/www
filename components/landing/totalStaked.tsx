import { useQuery } from '@apollo/client';
import moment from 'moment';
import { useMemo } from 'react';
import { GetDailyRewardsQuery, GetDailyRewardsQueryVariables, GetStatsQuery, GetStatsQueryVariables } from '~/gql/generated/types';
import { GET_DAILY_REWARDS, GET_STATS } from '~/gql/queries/stats';
import { Util } from '~/lib/util';
import { NodeAvgEarnChart } from '../charts/nodeAvgEarnChart';
import { Loadable } from '../loading/Loadable';
import { Table } from '../table/Table';
import styles from './totalStaked.module.scss';

export const TotalStaked: React.FC = () => {

    const { data, loading } = useQuery<GetStatsQuery, GetStatsQueryVariables>(GET_STATS);
    const { data: data2, loading: loading2 } = useQuery<GetDailyRewardsQuery, GetDailyRewardsQueryVariables>(GET_DAILY_REWARDS);

    const headers = [
        'Nodes',
        'POKT',
        'Stakers',
    ];
    const rows = useMemo(() => [[
        `${Util.formatNumberWithCommas(Math.floor(data?.getStats?.numNodes ?? 0))}`,
        `${Util.formatNumberWithCommas(Math.floor(data?.getStats?.pokt ?? 0))}`,
        `${Util.formatNumberWithCommas(data?.getStats?.numDepositors ?? 0)}`,
    ]], [data?.getStats?.pokt, data?.getStats?.numNodes, data?.getStats?.numDepositors]);

    const chartContent = useMemo(() => {
        const nodeAvgs = data2?.getDailyRewards?.map(dr => ({
            day: moment(dr.day).format('M/D'),
            avg: dr.pokt / dr.numNodes
        }));
        return <NodeAvgEarnChart events={nodeAvgs} />;
    }, [data2?.getDailyRewards?.length]);

    
    return <div className={styles.container}>
        <div className={styles.stakedExplainer}>
            We used to enjoy running Pocket nodes!
        </div>
        <div className={styles.stakedExplainer}>
            But we no longer do that.
        </div>
        <div className={styles.tableContainer}>
            <Table headers={ headers } rows={ rows } loading={ loading } bigMiddle />
        </div>
        <br />
        <div className={styles.stakedExplainer}>
            Average daily rewards per node (UTC)
        </div>
        <Loadable loading={loading2} height={215}>
            {chartContent}
        </Loadable>
    </div>;
};
