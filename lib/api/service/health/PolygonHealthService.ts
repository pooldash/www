import axios from 'axios';
import { HealthResult, NodeHeight } from './HealthResult';

export namespace PolygonHealthService {

    const scrapeExplorerHeight = async (): Promise<number> => {
        const res = await axios.get('https://polygonscan.com');
        if (res.status === 200) {
            const html: string = res.data;
            const afterSpan = html.split('<span id=\'lastblock\'>')[1];
            const justNumber = afterSpan.split('</span>')[0];
            return +justNumber;
        }
        return Promise.reject('Can\'t find block height');
    };

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

    export const checkPolygonNodes = async (urls: string[]): Promise<HealthResult> => {

        const explorerHeight = await scrapeExplorerHeight();
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

        return result;
    };
}
