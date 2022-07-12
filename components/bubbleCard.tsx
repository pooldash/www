import styles from './bubbleCard.module.scss';

export interface BubbleCardProps {
    title?: string;
    type?: 'center' | 'left' | 'invisible';
}

export const BubbleCard: React.FC<BubbleCardProps> = ({ title, type, children }) => {

    const titleElement = title && <div className={`${styles.title2} title2`}>{title}</div>;

    let bubbleClass = styles.bubble;
    if (type === 'left') {
        bubbleClass = styles.bubbleLeft;
    }
    if (type === 'invisible') {
        bubbleClass = styles.bubbleLeftTrans;
    }

    return (
        <div className={styles.container}>
            {titleElement}

            <div className={bubbleClass}>
                {children}
            </div>
        </div>
    );
};

