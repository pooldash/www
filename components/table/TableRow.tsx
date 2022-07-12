import Skeleton from 'react-loading-skeleton';
import styles from './table.module.scss';

interface Props {
    data: string[];
    loading: boolean;
    bigIndex?: number;
}

export const TableRow: React.FC<Props> = ({ data, loading, bigIndex }) => {
    return <tr>
        {data.map((d,i) => {
            const isBig = i === bigIndex;
            return <td
                key={i}
                className={isBig ? styles.bigTableRow : styles.tableRow}>
                {loading
                    ? <Skeleton />
                    : d
                }
            </td>;        
        })}
    </tr>;
};
