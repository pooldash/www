import { memo } from 'react';
import { TableRow } from './TableRow';
import styles from './table.module.scss';


interface Props {
    headers: string[];
    rows: string[][];
    loading: boolean;
    // This is a 1-off lazy feature
    bigMiddle?: boolean;
}

/// This is just a hastily-implemented table thing.
const InnerTable: React.FC<Props> = ({ headers, rows, loading, bigMiddle }) => {
    let bigIndex = -1;
    if (bigMiddle && rows.length) {
        bigIndex = Math.floor(rows[0].length / 2);
    }
    return <table className={styles.table}>
        <thead>
            <tr>
                {headers.map((h,i) => <th key={i} className={styles.tableRow}>{h}</th>)}
            </tr>
        </thead>
        <tbody>
            {rows.map((r,i) => <TableRow key={i} data={r} loading={loading} bigIndex={bigIndex} />)}
        </tbody>
    </table>;
    
};

export const Table = memo(InnerTable);
