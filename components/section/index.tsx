import * as React from 'react';
import styles from './index.module.scss';


interface SectionProps {
    title: string;
}

export const Section: React.FC<SectionProps> = (props) => {
    return <>
        <div className={styles.sectionHeader}>
            {props.title}
        </div>
        {props.children}
    </>;
};