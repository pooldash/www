// import { Chart as ChartJS, defaults } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, ChartData, ArcElement, ChartOptions, Legend } from 'chart.js';

ChartJS.register(ArcElement, Legend, Title);
ChartJS.overrides['doughnut'].plugins.tooltip;

export const ChartDoughnut = () => {

    const data: ChartData<'doughnut', number[], unknown> = {
        datasets: [
            {
                label: 'Revenue Split',
                data: [0.75, 0.25,],
                backgroundColor: [
                    '#24439e',
                    '#1cbc9b',
                ],
            }
        ],
        labels: [
            'Stakers',
            'StakeRiver'
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        rotation: 225,
        animation: {
            animateRotate: true,
            // animateScale: true
        },
        responsive: true,
        plugins: {
            legend: {
                display: true,
                align: 'center',
                position: 'right',
                labels: {
                    color: 'white'
                },
                onClick: () => {}
            },
        }
    };

    return <Doughnut
        data={data}
        options={options}
    />;
};