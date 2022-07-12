import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, ChartData, BarElement, ChartOptions, Legend, CategoryScale, LinearScale, PointElement, Filler, Tooltip } from 'chart.js';
import { useMemo } from 'react';

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, Legend, Title, Filler, Tooltip);

/// A data-point on this bar chart
interface NodeDay {
    day: string;
    avg: number;
}

interface Props {
    events: NodeDay[];
}

export const NodeAvgEarnChart: React.FC<Props> = (props) => {
    const data = useMemo(() => {
        const points = [...props.events].reverse(); // Sort recent -> latest
        points.pop();                               // Don't show incomplete day
        const d: ChartData<'bar', number[], unknown> = {
            datasets: [
                {
                    data: points.map(e => e.avg),
                    borderWidth: 1.5,
                    borderColor: '#AAAAAA',
                    backgroundColor: '#7DF1E6'
                }
            ],
            labels: points.map(e => e.day),
        };
        return d;
    }, [props.events.length]);

    const options: ChartOptions<'bar'> = {
        animation: {
            easing: 'easeOutCubic'
        },
        scales: {
            xAxes: {
                grid: {
                    display: false,
                },
            },
            yAxes: {
                grid: {
                    display: false,
                },
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return <Bar
        data={data}
        options={options}
    />;
};