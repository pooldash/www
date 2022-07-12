import { GENESIS_BLOCK_HEIGHT } from '../env';
import { pc } from './Prisma';

export enum RebaseStatus {
    // Failed because we couldn't get the lock:
    failedLock = 'FAILED_LOCK',
    // In progress
    pending = 'PENDING',

    // Already done, succeeded
    succeeded = 'SUCCEEDED',
    // Already done, failed for some other reason
    failed = 'FAILED',
}

interface LockResponse {
    rebaseAttemptId: bigint;
    rebaseLockId: bigint;
}

export namespace RebaseRepo {

    export const ensureRebaseLockOrFail = async (blockHeight: bigint, currentTime: Date): Promise<LockResponse> => {
        // Check if there was already a successful rebase here:
        const successfulRebaseCount = await pc.rebaseAttempt.count({
            where: {
                blockHeight,
                status: RebaseStatus.succeeded
            }
        });
        if (successfulRebaseCount > 0) {
            console.log('Already rebased this block, exiting.');
            throw 'We already rebased this block';
        }

        // Try to get the rebase lock:
        const existingRebaseLock = await pc.rebaseLock.findFirst({
            where: {
                blockHeight: {
                    equals: blockHeight
                }
            }
        });
        
        if (existingRebaseLock !== null) {
            // See if lock is less than 15 mins old:
            const msSinceLockAcquired = currentTime.getTime() - existingRebaseLock.created_at.getTime();
            const minutesSinceLockAcquired = msSinceLockAcquired / (1000 * 60);
            if (minutesSinceLockAcquired < 15) {
                // If it is, then log this attempt & throw
                console.log('Lock exists, and is less than 15 mins old.');
                await pc.rebaseAttempt.create({
                    data: {
                        blockHeight,
                        status: RebaseStatus.failedLock,
                        created_at: currentTime,
                    }
                });
                throw 'The lock exists and is less than 15 minutes old.';
            } else {
                // Otherwise, delete the lock & continue
                console.log('Lock exists, but is more than 15 mins old, and we\'ve never rebased this block before successfully, so we are deleting it');
                await pc.rebaseLock.delete({
                    where: {
                        id: existingRebaseLock.id
                    }
                });
            }
        }

        // Make that lock!
        const lock = await pc.rebaseLock.create({
            data: {
                blockHeight,
                created_at: currentTime,
            }
        });

        // Log the attempt:
        const attempt = await pc.rebaseAttempt.create({
            data: {
                blockHeight,
                created_at: currentTime,
                status: RebaseStatus.pending,
            }
        });

        return {
            rebaseAttemptId: attempt.id,
            rebaseLockId: lock.id,
        };
    };

    export const getNextRebaseBlockHeight = async (): Promise<bigint> => {
        // Look at the latest rebase attempt:
        const rb = await pc.rebaseAttempt.findFirst({
            where: {
                status: RebaseStatus.succeeded,
            },
            orderBy: [
                { blockHeight: 'desc' },
                { created_at: 'desc' },
            ]
        });
        if (rb === null) {
            return GENESIS_BLOCK_HEIGHT;
        }

        if (rb.status === RebaseStatus.succeeded) {
            return rb.blockHeight + BigInt(1);
        }

        return rb.blockHeight;
    };

    export const resolveRebaseAttempt = async (lr: LockResponse) => {
        // TODO: this in a transaction?
        
        // Update the attempt status to success:
        await pc.rebaseAttempt.update({
            where: {
                id: lr.rebaseAttemptId
            },
            data: {
                status: RebaseStatus.succeeded
            }
        });  

        // Delete the lock on this block (just for fun, no real need to do so):
        await pc.rebaseLock.delete({
            where: {
                id: lr.rebaseLockId
            }
        });
    };
}