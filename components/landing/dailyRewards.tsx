import { useQuery } from '@apollo/client';
import { createTheme, ThemeProvider } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import Link from 'next/link';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { GetDailyRewardsQuery, GetDailyRewardsQueryVariables } from '~/gql/generated/types';
import { GET_DAILY_REWARDS } from '~/gql/queries/stats';
import { Util } from '~/lib/util';
import { Button } from '../button/button';

export const DailyRewards: React.FC = () => {

    const { data, loading } = useQuery<GetDailyRewardsQuery, GetDailyRewardsQueryVariables>(GET_DAILY_REWARDS);

    const content = useMemo(() => {
        if (loading || !data?.getDailyRewards) {
            return <Skeleton height={ 400 } />;
        }

        const blocks = data.getDailyRewards;
        
        const rows: GridRowsProp = blocks.map((b, i) => ({
            id: i,
            ...b
        }));

        const getDayButton = (data: GridRenderCellParams<string>) => {
            return <Link href={ `/days/${data.value}` }>
                <a>
                    <Button backgroundColor='#7DF1E6' color='black' onPress={ () => { } } text={data.formattedValue} />
                </a>
            </Link>;
        };
    
        const columns: GridColDef[] = [
            { field: 'pokt', headerName: 'Rewards (POKT)', width: 130, valueFormatter: (v) => Util.formatNumberWithCommas(v.value as number) },
            { field: 'day', headerName: 'Day', width: 140, renderCell: getDayButton },
            { field: 'numNodes', headerName: 'Nodes', width: 90 },
        ];

        const theme = createTheme({
            palette: {
                text: {
                    primary: 'white'
                }
            }
        });

        return <div style={{ height: 400, width: 290 }}>
            <ThemeProvider theme={ theme }>
                <DataGrid rows={rows} columns={columns} hideFooter />
            </ThemeProvider>
        </div>;
    }, [data, loading]);

    return content;
};
