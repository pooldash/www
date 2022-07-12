import { useState, useEffect } from 'react';

export interface Dimensions {
    innerWindow: {
        w: number;
        h: number;
    }
    safeWidth: number;
}

const getWindowDimensions = (): Dimensions => {
    if (typeof window === 'undefined') {
        return {
            innerWindow: {
                w: 400,
                h: 600,
            },
            safeWidth: 380,
        };
    }
    const { innerWidth: w, innerHeight: h } = window;

    const maxWidth = 700;
    const horizontalMargins = 12 * 2;
    const safeWidth = Math.min(w, maxWidth) - horizontalMargins;

    return { 
        innerWindow: {
            w,
            h,
        },
        safeWidth,
    };
};

export const useWindowDimensions = (): Dimensions => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
};
