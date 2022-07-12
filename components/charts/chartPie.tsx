import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, ChartData, ArcElement, ChartOptions, Legend, Tooltip } from 'chart.js';
import { memo } from 'react';
import { Util } from '~/lib/util';

ChartJS.register(ArcElement, Legend, Title, Tooltip);
ChartJS.overrides['pie'].plugins.tooltip;

interface Props {
    totalRewards: number;
    shares: {
        ethAddr: string,
        percent: number
    }[];
    width: number;
}

const InnerChartPie: React.FC<Props> = ({ shares, totalRewards, width }) => {

    const graphData: {value: number, label: string}[] = shares.map(s => ({
        value: s.percent,
        label: s.ethAddr
    }));
    graphData.push({
        value: 0.25,
        label: 'StakeRiver'
    });

    const data: ChartData<'pie', number[], unknown> = {
        datasets: [
            {
                data: graphData.map(s => s.value),
                backgroundColor: [
                    '#7ce1f5',
                    '#0a30a9'
                ]
            }
        ],
        labels: graphData.map(s => Util.truncate(s.label, 6, 4))
    };

    const options: ChartOptions<'pie'> = {
        rotation: 225,
        animation: {
            animateRotate: true,
        },
        plugins: {
            legend: {
                display: false,
                // align: 'center',
                // position: 'bottom'
            },
            tooltip: {
                enabled: true,
                position: 'average',
                callbacks: {
                    label: (item) => `${(item.parsed * 100).toFixed(2)}%`,
                    footer: (items) => `${items
                        .map(i => i.parsed * totalRewards)
                        .reduce((a,b) => a + b, 0)
                        .toFixed(2)
                    } POKT`,
                    title: (items) => items[0].label,
                }
            }
        },
        
    };

    return <Pie
        style={{ height: width, width }}
        data={data}
        options={options}
    />;
};

export const ChartPie = memo(InnerChartPie, (a,b) => 
    a.shares.length === b.shares.length && a.width === b.width
);
