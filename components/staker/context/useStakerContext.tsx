import { useState } from 'react';
import { IStakerContext } from '.';

/// Helper method to extract some state to a hook from the parent component.
export const useStakerContextRootProviderOnly = (): IStakerContext => {
    const [ethAddress, setEthAddress] = useState<string | null>(null);
    const [isInitiallyLoadingEthAddress, setIsInitiallyLoadingEthAddress] = useState(false);
    const [poktAddress, setPoktAddress] = useState<string | null>(null);

    return {
        ethAddress,
        setEthAddress,

        isInitiallyLoadingEthAddress,
        setIsInitiallyLoadingEthAddress,
        
        poktAddress,
        setPoktAddress,
    };
};
