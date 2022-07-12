import { pc } from './Prisma';

export interface PercentageShare {
    ethAddr: string;
    percent: number;
    balance: bigint;
}

export type PercentageShareTemp = Omit<PercentageShare, 'percent'>;

export namespace BalanceRepo {
    export const getAllPercentagesForBlock = async (blockHeight: bigint): Promise<PercentageShare[]> => {
        return await pc.blockBalances.findMany({
            where: { blockHeight },
        });
    };

    export const getAllPercentagesForLatestBlock = async (): Promise<Omit<PercentageShare, 'balance'>[]> => {
        const { blockHeight } = await pc.blockBalances.findFirst({
            orderBy: { blockHeight: 'desc' },
            select: { blockHeight: true },
        });
        return await pc.blockBalances.findMany({
            where: { blockHeight },
            select: {
                ethAddr: true,
                percent: true,
            },
        });
    };

    export const savePercentagesForBlock = async (percentages: PercentageShare[], blockHeight: bigint, date: Date) => {
        await pc.blockBalances.createMany({
            data: percentages.map(p => ({
                balance: p.balance,
                ethAddr: p.ethAddr,
                percent: p.percent,
                blockHeight: blockHeight,
                date: date,
            }))
        });
    };

    export const getLatestBalanceForEthAddr = async (ethAddr: string): Promise<bigint> => {
        const result = await pc.ledger.findFirst({
            where: {
                ethAddr,
            },
            orderBy: [{
                virtualTxNum: 'desc'
            }]
        });

        return result?.balanceAfter ?? null;
    };

    export const getLatestTotalBalanceUPokt = async (): Promise<bigint> => {
        const blockBalance = await pc.blockBalances.findFirst({
            orderBy: [
                { blockHeight: 'desc' },
                { balance: 'desc' },
            ]
        });

        const balance = blockBalance ? Math.floor(Number(blockBalance.balance) / blockBalance.percent) : 0;
        return BigInt(balance);
    };

    export const getTotalBalanceUPoktAtBlock = async (blockHeight: bigint): Promise<bigint> => {
        const blockBalance = await pc.blockBalances.findFirst({
            where: { blockHeight },
            orderBy: [{ balance: 'desc' }],
        });

        const balance = blockBalance ? Math.floor(Number(blockBalance.balance) / blockBalance.percent) : 0;
        return BigInt(balance);
    };

    export const getNumOfAddressesWithBalance = async (): Promise<number> => {
        const latest = await pc.blockBalances.findFirst({
            orderBy: [{
                blockHeight: 'desc'
            }]
        });

        const blockHeight = latest.blockHeight;
        const numStakers = await pc.blockBalances.count({
            where: {
                blockHeight,
                balance: {
                    not: 0
                }
            }
        });

        return numStakers;
    };

    export const getBalanceAtBlocks = async (blockHeights: bigint[]): Promise<{blockHeight: bigint, balance: bigint}[]> => {
        const entries = await pc.blockBalances.groupBy({
            by: ['blockHeight'],
            where: {
                blockHeight: {
                    in: blockHeights
                }
            },
            _sum: { balance: true },
            orderBy: [{ blockHeight: 'desc' }]
        });
        
        return entries.map(l => ({
            balance: l._sum.balance,
            blockHeight: l.blockHeight
        }));
    };
}
