import { AdminStats } from '~/gql/generated/types';
import { Util } from '~/lib/util';
import { BANKING_ADDRESS } from '../../env';
import { pc } from '../../repo/Prisma';
import { ValidatorRepo } from '../../repo/ValidatorRepo';
import { PocketService } from '../PocketService';

export namespace AdminStatsService {
    export const adminStats = async (): Promise<AdminStats> => {
        const revenueResult = await pc.revenueLedger.aggregate({
            _sum: { amount: true }
        });
        const revenue = Util.microPoktToPokt(revenueResult._sum.amount);

        const nodes = await ValidatorRepo.getAllValidators();
        const nodeBalances = await Promise.all(
            nodes.map(n => PocketService.getBalance(n.poktAddr))
        );
        const nodeBalance = Util.microPoktToPokt(
            nodeBalances.reduce((a,b) => a+b, BigInt(0))
        );

        const bankBalanceUpokt = await PocketService.getBalance(BANKING_ADDRESS);
        const bankBalance = Util.microPoktToPokt(bankBalanceUpokt);

        return {
            bankBalance,
            nodeBalance,
            revenue,
        };
    };
}
