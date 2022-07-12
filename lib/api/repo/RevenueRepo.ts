import { pc } from './Prisma';

export enum VirtualTxType {
    REWARDS = 'rewards',
    DEPOSIT = 'deposit',
    EXPENSE = 'expenses',
}

/// A ledger just for StakeRiver revenue
export namespace RevenueRepo {
    
    const saveTx = async (type: VirtualTxType, uPokt: bigint, blockHeight: bigint, date: Date) => {

        // Just in-case there are future entries, cascade them forward by 1 to make room:
        const futureEntries = await pc.revenueLedger.findMany({
            where: {
                blockHeight: {
                    gt: blockHeight
                } 
            },
            orderBy: [{ virtualTxNum: 'desc' }]     // This lets the cascade happen without triggering constraint errors.
        });
        if (futureEntries.length > 0) {
            // Keep an eye out for super-spam here, consider sending fewer emails.
            // await EmailService.oldTransactionFound(ethAddr, `${Util.microPoktToPokt(uPokt)}`);

            // TODO: batch this at some point.
            console.log(`Cascading change to ${futureEntries.length} transactions`);
            for (const tx of futureEntries) {
                await pc.revenueLedger.update({
                    where: {
                        id: tx.id
                    },
                    data: {
                        balanceBefore: tx.balanceBefore + uPokt,
                        balanceAfter: tx.balanceAfter + uPokt,
                        virtualTxNum: tx.virtualTxNum + BigInt(1)
                    }
                });
            }
        }

        // Now save the new tx:
        let txNumber = BigInt(0);
        let balanceBefore = BigInt(0);

        try {
            const last = await pc.revenueLedger.findFirst({
                where: {
                    blockHeight: { lte: blockHeight }
                },
                orderBy: [
                    { blockHeight: 'desc' },
                    { virtualTxNum: 'desc' }
                ]
            });
            txNumber = last.virtualTxNum + BigInt(1);
            balanceBefore = last.balanceAfter;
        } catch (e) {
            console.log('This is the first revenue ledger entry');
        }
        
        await pc.revenueLedger.create({
            data: {
                amount: uPokt,
                balanceBefore,
                balanceAfter: balanceBefore + uPokt,
                blockHeight,
                virtualTxNum: txNumber,
                type,
                date,
            }
        });
    };

    export const saveEarnings = async (amount: bigint, blockHeight: bigint, date: Date) => {
        await saveTx(VirtualTxType.REWARDS, amount, blockHeight, date);
    };

    export const savePayout = async (amount: bigint, blockHeight: bigint, date: Date) => {
        await saveTx(VirtualTxType.EXPENSE, -amount, blockHeight, date);
    };

    export const getRevenueAfterDate = async (earliest: Date): Promise<bigint> => {
        const result = await pc.revenueLedger.aggregate({
            where: {
                type: { equals: VirtualTxType.REWARDS },
                date: { gte: earliest }
            },
            _sum: { amount: true }
        });

        return result._sum.amount;
    };

    export const getUnrealizedRevenue = async (): Promise<bigint> => {
        const result = await pc.revenueLedger.findFirst({
            orderBy: [{ virtualTxNum: 'desc' }]
        });
        return result.balanceAfter;
    };
}
