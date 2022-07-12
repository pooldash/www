import React from 'react';
import styles from './button.module.scss';

interface ButtonProps {
    color: string;
    backgroundColor: string;
    text: string;
    onPress: () => void;
    shrink?: boolean;
};

export const Button: React.FunctionComponent<ButtonProps> = ({ color, backgroundColor, text, onPress, shrink }) => {

    const style = { color, backgroundColor };

    const className = shrink ? styles.containerSmall : styles.container;

    return (
        <div className={ className } style={ style } onClick={ onPress }>
            { text }
        </div>
    );
};
