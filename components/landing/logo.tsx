import styles from './logo.module.scss';
import Image from 'next/image';
import { Images } from '~/helpers/images';

export const Logo: React.FC = () => {
    return (
        <div className={styles.logo}>
            <Image
                src={Images.logo}
                layout='intrinsic'
                alt="Stake River logo. It's some mountains with a river, and a little POKT flag staked to the top of the mountain, although it's so small that nobody will ever see it."
            />
        </div>
    );
};
