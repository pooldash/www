import { createTheme, ThemeProvider } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { memo } from 'react';
import { Section } from '../section';

interface Props {
    totalRewards: number;
    addresses: {
        ethAddr: string;
        percent: number;
        balanceBefore: number;
        balanceAfter: number;
        deposited: number;
        withdrawn: number;
        rewards: number;
    }[];
    width: number;
}

const InnerBlockTable: React.FC<Props> = (props) => {

    const sortedAddrs = [...props.addresses].sort((a, b) => b.rewards - a.rewards);
    const rows: GridRowsProp = sortedAddrs.map((a, i) => ({
        id: i,
        ...a
    }));
    
    const columns: GridColDef[] = [
        { field: 'ethAddr', headerName: 'Account', width: 100 },
        { field: 'percent', headerName: 'Rewards %', width: 100, valueFormatter: (v) =>  `${((v.value as number) * 100).toFixed(2)}%` },
        { field: 'rewards', headerName: 'Rewards', width: 100 },
        { field: 'balanceBefore', headerName: 'Balance (this block)', width: 100 },
        { field: 'deposited', headerName: 'Staked Additional', width: 100 },
        { field: 'withdrawn', headerName: 'Unstaked', width: 100 },
        { field: 'balanceAfter', headerName: 'Balance (next block)', width: 100 },
    ];

    const theme = createTheme();

    const list = <div style={{ height: 400, width: props.width }}>
        <ThemeProvider theme={ theme }>
            <DataGrid rows={rows} columns={columns} />
        </ThemeProvider>
    </div>;

    return <>
        <Section title={ 'Stakers:' }>
            {list}
        </Section>
    </>;
};

export const BlockTable = memo(InnerBlockTable);
