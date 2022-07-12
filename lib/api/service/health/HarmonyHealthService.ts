import axios from 'axios';
import { HealthResult, NodeHeight } from './HealthResult';

export namespace HarmonyHealthService {

    const getHeightFromRPC = async (url: string): Promise<NodeHeight> => {
        const res = await axios.post(url, {
            jsonrpc: 2.0,
            method: 'eth_blockNumber',
            params: [],
            id: 1
        });
        const height = Number(res.data.result);
        
        return { url, height };
    };

    export const checkHarmonyNodes = async (urls: string[]): Promise<HealthResult> => {

        const publicRpcUrl = 'https://rpc.s0.t.hmny.io';

        const explorerHeight = (await getHeightFromRPC(publicRpcUrl)).height;

        const heights = await Promise.all(
            urls.map(getHeightFromRPC)
        );

        let healthy = true;
        let notes = `explorer height: ${explorerHeight}`;

        heights.forEach(h => {
            // matic block-time is ~2 seconds, explorer page is always behind.
            // This indicates the node has fallen behind by ~30 seconds.
            if (h.height - explorerHeight < -10) {
                healthy = false;
                notes += `\n${h.url} height: ${h.height}`;
            }
        });

        const result = {
            chain: 'matic',
            healthy,
            heights,
            explorerHeight,
            notes,
        };

        console.dir(result);

        return result;
    };
}

HarmonyHealthService.checkHarmonyNodes([
    'http://harmony-3.stakeriver.com:9500'
]);
