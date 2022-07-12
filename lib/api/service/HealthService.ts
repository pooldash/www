import { HeightResult } from '~/gql/generated/types';
import { pc } from '../repo/Prisma';
import { ValidatorRepo } from '../repo/ValidatorRepo';
import { EmailService } from './Email/EmailService';
import { HarmonyHealthService } from './health/HarmonyHealthService';
import { PolygonHealthService } from './health/PolygonHealthService';
import { PocketService } from './PocketService';

/// Half-baked monitoring
export namespace HealthService {

    export const checkHeight = async (): Promise<HeightResult> => {
        const allValidators = await ValidatorRepo.getAllValidators();
        const allServiceURLs = allValidators.map(v => `https://${v.name}.stakeriver.com`);

        const heightChecks = allServiceURLs.map(u => PocketService.getHeightForValidator(u));
        const results = await Promise.all(heightChecks);
        const prettyResults = results.map(r => ({
            url: r.addr,
            height: r.height.toString()
        }));

        let min = Number.MAX_VALUE;
        let max = Number.MIN_VALUE;

        for (let i = 0; i < allValidators.length; i++) {
            const h = Number(results[i].height);
            min = Math.min(min, h);
            max = Math.max(max, h);
        }
        const maxDiff = max - min;
        
        return {
            maxDiff,
            heights: prettyResults
        };
    };

    export const healthCheck = async () => {

        const minuteInMilliseconds = 60 * 1000;
        const thirtyMinutesAgo = new Date(
            Date.now() - (30 * minuteInMilliseconds)
        );
        const numberOfChecksInLast30Minutes = await pc.healthCheck.count({
            where: {
                created_at: {
                    gt: thirtyMinutesAgo
                }
            }
        });
        if (numberOfChecksInLast30Minutes > 0) {
            console.log('Already checked health recently, returning.');
            return;
        }
        let healthy = true;

        const res = await HealthService.checkHeight();
        if (res.maxDiff > 1) {
            await EmailService.nodeBehind(res.maxDiff);
            healthy = false;
        }

        // TODO: add fuse

        /// Polygon
        let maticNotes = '';
        try {
            const maticResults = await PolygonHealthService.checkPolygonNodes([
                'http://matic-b.stakeriver.com',
                'http://polygon-fsn.stakeops.net:8546'
            ]);
            if (!maticResults.healthy) {
                await EmailService.chainNodeBehind('Matic', maticResults.notes);
                healthy = false;
            }
            maticNotes = maticResults.notes;
        } catch (e) {
            maticNotes = 'Query crashed somehow';
            await EmailService.chainNodeBehind('Matic', maticNotes);
            healthy = false;
        }

        /// Harmony
        let harmonyNotes = '';
        try {
            const harmonyResults = await HarmonyHealthService.checkHarmonyNodes([
                'http://harmony-3.stakeriver.com:9500'
            ]);
            if (!harmonyResults.healthy) {
                await EmailService.chainNodeBehind('Harmony', harmonyResults.notes);
                healthy = false;
            }
            harmonyNotes = harmonyResults.notes;
        } catch (e) {
            harmonyNotes = 'Query crashed somehow';
            await EmailService.chainNodeBehind('Harmony', maticNotes);
            healthy = false;
        }

        const notes = `
Pocket nodes first height: ${res.heights[0].height}
Pocket nodes maxDiff: ${res.maxDiff}
Polygon:
${maticNotes}
Harmony:
${harmonyNotes}`;

        await pc.healthCheck.create({
            data: {
                created_at: new Date(),
                notes,
                healthy
            }
        });
    };
}
