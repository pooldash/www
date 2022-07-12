import { createTheme, ThemeProvider } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import { memo } from 'react';
import { Button } from '../button/button';
import { Section } from '../section';

interface ValidatorBlockEarnings {
    addr: string;
    name: string;
    pokt: number;
}

interface Props {
    validators: ValidatorBlockEarnings[];
    width: number;
}

const InnerValidatorTable: React.FC<Props> = (props) => {

    const rows: GridRowsProp = [...props.validators]
        .sort((a,b) => b.pokt - a.pokt)
        .map((a, i) => ({
            id: i,
            ...a,
            // Hack to re-use the same prop for different datagrid columns:
            addr2: a.addr,
            addr3: a.addr,
        }));

    const getPoktScanButton = (data: GridRenderCellParams<string>) => {
        return <a href={`https://poktscan.com/public/node/${data.value}`} target='_blank'>
            <Button backgroundColor='#7DF1E6' color='black' onPress={ () => { } } text='POKTScan' />
        </a>;
    };

    const getPoktToolsButton = (data: GridRenderCellParams<string>) => {
        return <a href={`https://pokt.tools/node/${data.value}/rewards`} target='_blank'>
            <Button backgroundColor='#7DF1E6' color='black' onPress={ () => { } } text='POKT Tools' />
        </a>;
    };
    
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'pokt', headerName: 'Rewards', width: 100 },
        { field: 'addr2', headerName: 'Pokt Tools', width: 120, renderCell: getPoktToolsButton },
        { field: 'addr', headerName: 'Pokt Scan', width: 120, renderCell: getPoktScanButton },
        { field: 'addr3', headerName: 'Address', width: 100 },
    ];

    const theme = createTheme();

    const list = <div style={{ height: 600, width: props.width }}>
        <ThemeProvider theme={ theme }>
            <DataGrid rows={rows} columns={columns} />
        </ThemeProvider>
    </div>;

    return <>
        <Section title={ 'Nodes:' }>
            {list}
        </Section>
    </>;
};

export const ValidatorTable = memo(InnerValidatorTable);
