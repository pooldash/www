import { ThirdwebProvider } from '@3rdweb/react';

/// Plumbing for the Eth wallet provider
export const EthWalletProvider: React.FC = (props) => {
    // We only support eth mainnet
    const supportedChainIds = [1];
    // TODO: support more wallets
    const connectors = {
        injected: {},
        walletconnect: {},
    };
    return <ThirdwebProvider 
        connectors={connectors} 
        supportedChainIds={supportedChainIds}
    >
        {props.children}
    </ThirdwebProvider>;
};
