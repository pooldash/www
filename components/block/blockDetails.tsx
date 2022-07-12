import { useQuery } from '@apollo/client';
import { memo, useMemo } from 'react';
import { GetBlockDetailsQuery, GetBlockDetailsQueryVariables } from '~/gql/generated/types';
import { GET_BLOCK } from '~/gql/queries/block';
import { ChartPie } from '../charts/chartPie';
import styles from './blockDetails.module.scss';
import { BlockTable } from './blockTable';
import { Table } from '../table/Table';
import { Loadable } from '../loading/Loadable';
import { Section } from '../section';
import { ValidatorTable } from '../validatorTable/validatorTable';
import { useWindowDimensions } from '../window/hooks';

interface Props {
    height: string;
}

const InnerBlockDetails: React.FC<Props> = (props) => {
    const { data, loading } = useQuery<GetBlockDetailsQuery, GetBlockDetailsQueryVariables>(GET_BLOCK, {
        variables: {
            blockHeight: props.height
        }
    });

    const { safeWidth } = useWindowDimensions();
    const circleDiameter = Math.min(safeWidth, 320);
    
    const content = useMemo(() => {
        const totalRewards = data?.getBlockDetails?.totalRewards ?? 0;
        return <>
            <Section title={ 'Distribution:' }>
                <div style={{ width: circleDiameter, marginLeft: 'auto', marginRight: 'auto' }}>
                    <Loadable loading={loading} circle width={circleDiameter} height={circleDiameter}>
                        <ChartPie shares={data?.getBlockDetails?.splits ?? []} totalRewards={totalRewards} width={circleDiameter} />
                    </Loadable>
                </div>
            </Section>
            <Loadable loading={loading} width={safeWidth} height={400}>
                <BlockTable addresses={data?.getBlockDetails?.splits ?? []} totalRewards={totalRewards} width={safeWidth} />
            </Loadable>
            <Loadable loading={loading} width={safeWidth} height={600}>
                <ValidatorTable validators={data?.getBlockDetails?.validators ?? []} width={safeWidth} />
            </Loadable>
            <Section title={ 'StakeRiver Revenue:' }>
                <Loadable loading={loading}>
                    <div className={styles.explainerText}>
                        25% {'->'} ~{(totalRewards * 0.25).toFixed(2)} POKT
                    </div>
                </Loadable>
            </Section>
        </>;
    }, [loading, data?.getBlockDetails.blockHeight]);

    const details = data?.getBlockDetails;

    const headers = [
        'Block',
        'Rewards',
        'Stakers',
    ];
    const tableRows = [[
        `${props.height}`,
        `${details?.totalRewards}`,
        `${details?.splits.length}`,
    ]];

    return <div className={styles.container}>
        <Table headers={headers} loading={loading} rows={tableRows} />
        { content }
    </div>;
};

export const BlockDetails = memo(InnerBlockDetails);
