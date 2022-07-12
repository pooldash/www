import { NextApiHandler } from 'next';
import { SlowCache } from '~/lib/api/service/CacheService';
import { EmailService } from '~/lib/api/service/Email/EmailService';
import { HarmonyHealthService } from '~/lib/api/service/health/HarmonyHealthService';
import { HealthResult } from '~/lib/api/service/health/HealthResult';
import { PolygonHealthService } from '~/lib/api/service/health/PolygonHealthService';

/// This API call will, supposedly, be used by the chain nodes to determine if they need to kick their local processes to get back in sync.
/// 1 means healthy, 0 means UH-OH TIME TO KICK IT!!
const handler: NextApiHandler = async (req, res) => {
    // const node: string = req.query.node as string;

    // // Make sure it's a valid query
    // const supportedNodes = ['matic-b', 'harmony-3'];
    // if (!supportedNodes.includes(node)) {
    //     console.error('Unsupported node health query: ' + node);
    //     return res.send('Please send one of these: ' + supportedNodes.join(', '));
    // }

    // // See if we have a cached result
    // const cachedResult = await SlowCache.get('chain_node_health', node);
    // if (cachedResult) {
    //     return res.send(cachedResult);
    // }

    // // Actually do the check
    // let result: HealthResult;
    // if (node === 'matic-b') {
    //     result = await PolygonHealthService.checkPolygonNodes(['http://matic-b.stakeriver.com']);   
    // } else if (node === 'harmony-3') {
    //     // TODO: actually do the health check.
    //     return res.send('1');
    //     // result = await HarmonyHealthService.checkHarmonyNodes(['http://harmony-3.stakeriver.com:9500']);
    // }

    // if (result?.healthy) {
    //     // Cache the healthy result:
    //     await SlowCache.set('chain_node_health', '1', node);
    //     return res.send('1');
    // }

    // /// Email the admins if we recommend the boot
    // await EmailService.kickingChainNode(node);
    return res.send('0');
};

export default handler;
