import { Util } from '~/lib/util';
import { pc } from '../repo/Prisma';
import { ValidatorRepo } from '../repo/ValidatorRepo';
import { PocketService } from './PocketService';

/// Helpers for validator stuff.
export namespace ValidatorService {
    export const ensureStakeDateSet = async () => {
        const datelessValidators = await ValidatorRepo.getDatelessValidators();
        console.log(`Found ${datelessValidators.length} dateless validators`);
        for (const dv of datelessValidators) {
            const txns = await PocketService.getPoktTransactions(dv.poktAddr);
            const stakeTransactions = txns
                .filter(tx => tx.txResult.code === 0)
                .filter(tx => tx.txResult.messageType === 'stake_validator')
                .sort((a,b) => Number(a.height.valueOf() - b.height.valueOf()));
            const stakeHeight = Util.firstOrNull(stakeTransactions)?.height?.valueOf();
            if (stakeHeight) {
                const stakeTimestamp = await PocketService.getTimestampForBlock(stakeHeight);
                const stakeDate = new Date(stakeTimestamp);
                await ValidatorRepo.setDateForValidator(dv.poktAddr, stakeHeight, stakeDate);
            } else {
                console.log(`Skipping validator: ${dv.name}`);
            }
        }
        console.log('Done setting stake dates!');
    };
}