import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GetActivityQuery, GetActivityQueryVariables } from '~/gql/generated/types';
import { GET_LATEST_ACTIVITY } from '~/gql/queries/activity';
import { Section } from '../section';
import { BalanceChart } from '../charts/balanceChart';
import styles from './index.module.scss';
import Link from 'next/link';
import { Loadable } from '../loading/Loadable';
import { DataGrid, GridRowsProp, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material';
import { Button } from '../button/button';

interface Props {
    ethAddr: string;
}

export const Activity: React.FC<Props> = (props) => {
    const ethAddr = props.ethAddr;
    const { data, loading } = useQuery<GetActivityQuery, GetActivityQueryVariables>(
        GET_LATEST_ACTIVITY,
        {
            variables: { ethAddr }
        }
    );

    const content = useMemo(() => {
        if (data?.getActivity?.length) {

            const rows: GridRowsProp = data.getActivity.map((tx, i) => ({
                id: i,
                ...tx,
            }));
            
            const getBlockButton = (data: GridRenderCellParams<string>) => {
                return <Link href={ `/blocks/${data.value}` }>
                    <a>
                        <Button backgroundColor='#7DF1E6' color='black' onPress={ () => { } } text={data.formattedValue} />
                    </a>
                </Link>;
            };

            const columns: GridColDef[] = [
                { field: 'pokt', headerName: 'Amount', width: 100 },
                { field: 'type', headerName: 'Type', width: 80 },
                { field: 'blockHeight', headerName: 'Block', width: 90, renderCell: getBlockButton },
            ];

            const theme = createTheme();

            const list = <div style={{ height: 600, width: 300 }}>
                <ThemeProvider theme={ theme }>
                    <DataGrid rows={rows} columns={columns} />
                </ThemeProvider>
            </div>;

            const chartData = data.getActivity.map(tx => ({ blockHeight: tx.blockHeight, balance: tx.poktBalanceAfter }));

            return <div>
                <BalanceChart events={chartData} />
                <Section title='My Activity:'> 
                    {list}
                </Section>
            </div>;
        } else {
            return <Section title='My Activity:'>
                <div className={styles.explainerText}>
                    Your deposits and rewards will show here.
                </div>
                <br />
                <br />
                <br />
            </Section>;
        }
    }, [data?.getActivity?.length, ethAddr]);
    

    if (loading) {
        return <Section title='My Activity:'>
            <Loadable loading={loading} height={300} />
        </Section>;
    }

    return content;
};
