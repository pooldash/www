import { useQuery } from '@apollo/client';
import { createTheme, ThemeProvider } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import Link from 'next/link';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { GetRecentBlockRewardsQuery, GetRecentBlockRewardsQueryVariables } from '~/gql/generated/types';
import { GET_RECENT_BLOCK_REWARDS } from '~/gql/queries/stats';
import { Util } from '~/lib/util';
import { Button } from '../button/button';

export const RecentRewards: React.FC = () => {

    const { data, loading } = useQuery<GetRecentBlockRewardsQuery, GetRecentBlockRewardsQueryVariables>(GET_RECENT_BLOCK_REWARDS);

    const content = useMemo(() => {
        if (loading || !data?.getRecentBlockRewards) {
            return <Skeleton height={ 400 } />;
        }

        const blocks = data.getRecentBlockRewards;
        
        const rows: GridRowsProp = blocks.map((b, i) => ({
            id: i,
            ...b
        }));

        const getBlockButton = (data: GridRenderCellParams<string>) => {
            return <Link href={ `/blocks/${data.value}` }>
                <a>
                    <Button backgroundColor='#7DF1E6' color='black' onPress={ () => { } } text={data.formattedValue} />
                </a>
            </Link>;
        };
    
        const columns: GridColDef[] = [
            { field: 'pokt', headerName: 'Rewards (POKT)', width: 150, valueFormatter: (v) => Util.formatNumberWithCommas(v.value as number) },
            { field: 'blockHeight', headerName: 'Block', width: 100, renderCell: getBlockButton },
        ];

        const theme = createTheme({
            palette: {
                text: {
                    primary: 'white'
                }
            }
        });

        return <div style={{ height: 400 }}>
            <ThemeProvider theme={ theme }>
                <DataGrid rows={rows} columns={columns} hideFooter />
            </ThemeProvider>
        </div>;
    }, [data, loading]);

    return content;
};
