import { useQuery } from '@apollo/client';
import { GetLatestPoktBalanceQuery, GetLatestPoktBalanceQueryVariables } from '~/gql/generated/types';
import { GET_LATEST_POKT_BALANCE } from '~/gql/queries/poktBalance';
import { Util } from '~/lib/util';
import { Section } from '../section';
import { Activity } from './activity';
import { WithdrawWidget } from './withdraw';
import styles from './poktBalance.module.scss';
import { Loadable } from '../loading/Loadable';

interface Props {
    ethAddr: string;
}

export const PoktBalance: React.FC<Props> = (props) => {
    const ethAddr = props.ethAddr;
    const { data, loading } = useQuery<GetLatestPoktBalanceQuery, GetLatestPoktBalanceQueryVariables>(
        GET_LATEST_POKT_BALANCE,
        {
            variables: { ethAddr }
        }
    );

    const poktString = Util.formatNumberWithCommas(data?.getLatestPoktBalanceForEthAddr?.pokt ?? 0);

    return <>
        <Section title='My Balance:'>
            <Loadable loading={ loading }>
                <div className={styles.balanceText}>{poktString} POKT</div>
            </Loadable>
            <Activity ethAddr={ props.ethAddr }/>
            <Loadable loading={loading} height={50}>
                <WithdrawWidget />
            </Loadable>
        </Section>
    </>;
};
