import styles from './content.module.scss';
import { BubbleCard } from '~/components/bubbleCard';
import { ChartDoughnut } from '../chartDonut';
import { DailyRewards } from './dailyRewards';

export const LandingContent: React.FC = () => {
    return (
        <div className={styles.containerDark}>
            <main className={styles.main}>
                <div className={`${styles.subtitle} subtitle`}>beta release, use at your own risk</div>
                <BubbleCard title='Details' type='invisible'>
                    <p>You keep 75% of tokens earned, and we use 25% to cover costs (and hopefully profit).</p>
                    <div className={styles.chartContainerDoughnut}>
                        <ChartDoughnut />
                    </div>
                    <p>Recent reward distributions:</p>
                    <p>(press date for details)</p>
                    <div style={{ width: 290 }}>
                        <DailyRewards />
                    </div>
                    <br />
                    <p>This service is managed part-time by 2 engineers. We love Pocket, and we want to make it easy to stake.</p>
                    <br />
                    <p>{'We believe that web3 enables new types of companies that align incentives with minimal overhead.'}</p>
                    <br />
                    <p>{'If you need great customer support, don\'t stake here. We can only achieve this 75/25 split by laser-focusing our time on running great nodes, at the expense of everything else.'}</p>
                    <br />
                    <p>{'All earnings are public.'}</p>
                    <br />
                    <p>{'Less is more. Strength in numbers.'}</p>
                </BubbleCard>
            </main>
        </div>
    );
};