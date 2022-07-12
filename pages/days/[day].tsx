import * as React from 'react';
import styles from './[day].module.scss';
import { useRouter } from 'next/router';
import { GET_BLOCKS_FOR_DAY } from '~/gql/queries/stats';
import { GetBlocksForDayQuery, GetBlocksForDayQueryVariables } from '~/gql/generated/types';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import Link from 'next/link';
import { Button } from '~/components/button/button';
import Skeleton from 'react-loading-skeleton';
import { Util } from '~/lib/util';
import { Section } from '~/components/section';

// TODO: break this out into 2 components, whoops.

const Block: React.FC = () => {
    const router = useRouter();
    const { day } = router.query;

    const [fetch, { data, loading } ] = useLazyQuery<GetBlocksForDayQuery, GetBlocksForDayQueryVariables>(GET_BLOCKS_FOR_DAY);

    // fetch the blocks as soon as we load the height from the page
    useEffect(() => {
        if (day && typeof day === 'string') {
            fetch({ variables: { day } });
        }
    }, [day]);

    const content = React.useMemo(() => {
        
        if (loading || !data?.getBlocksForDay) {
            return <Skeleton height={ 400 } />;
        }

        const blocks = data.getBlocksForDay;
        
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

        return <div className={styles.container}>
            <Section title={`Block rewards for ${day}`}>
                <div style={{ height: 400, width: 330 }}>
                    <ThemeProvider theme={ theme }>
                        <DataGrid rows={rows} columns={columns} hideFooter />
                    </ThemeProvider>
                </div>
                <p>(press block number for details)</p>
            </Section>
        </div>;
    }, [data, loading]);

    return content;
};
export default Block;
