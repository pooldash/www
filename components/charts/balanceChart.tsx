import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, ChartData, LineElement, ArcElement, ChartOptions, Legend, CategoryScale, LinearScale, PointElement, Filler, Tooltip } from 'chart.js';
import { useMemo } from 'react';

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Legend, Title, Filler, Tooltip);

/// A data-point on a balance chart
interface BalanceEvent {
    blockHeight: string;        // todo: make this a date or something
    balance: number;            // close enough is OK.
}

interface Props {
    events: BalanceEvent[];
}

export const BalanceChart: React.FC<Props> = (props) => {
    const data = useMemo(() => {
        const points = [...props.events].reverse();
        const d: ChartData<'line', number[], unknown> = {
            datasets: [
                {
                    data: points.map(e => e.balance),
                    pointRadius: 0,
                    pointHitRadius: 5,
                    tension: 0,
                    fill: 'origin',
                    backgroundColor: '#7DF1E6',
                    borderWidth: 1.5,
                    borderColor: '#AAAAAA'
                }
            ],
            labels: points.map(e => e.blockHeight),
        };
        return d;
    }, [props.events.length]);

    const options: ChartOptions<'line'> = {
        animation: {
            easing: 'easeOutCubic'
        },
        scales: {
            xAxes: {
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                }
            },
            yAxes: {
                grid: {
                    display: false,
                },
                ticks: {
                    display: false,
                },
                display: false,
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
        // plugins: {
        //     legend: {
        //         display: false,
        //         align: 'center',
        //         position: 'bottom'
        //     },
        // },
        
    };

    return <Line
        data={data}
        options={options}
    />;
};