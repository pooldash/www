import React from 'react';

/// This is most of the context in our UI.
export const StakerContext = React.createContext<IStakerContext>({
    ethAddress: null,
    setEthAddress: () => {},

    isInitiallyLoadingEthAddress: false,
    setIsInitiallyLoadingEthAddress: () => {},
    
    poktAddress: null,
    setPoktAddress: () => {},
});

export interface IStakerContext {
    ethAddress: string | null;
    setEthAddress: (newValue: string | null) => void;

    isInitiallyLoadingEthAddress: boolean;
    setIsInitiallyLoadingEthAddress: (newValue: boolean) => void;

    poktAddress: string | null;
    setPoktAddress: (newValue: string | null) => void;
}

export const getDefaultStakerContext = (): IStakerContext => {
    return; 
};
