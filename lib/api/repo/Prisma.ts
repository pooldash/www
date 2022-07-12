import { PrismaClient } from '@prisma/client';
import { SUPABASE_DB_STRING } from '../env';

/// Due to hot-reloading during dev, please just use "pc" exported from the bottom of this file.
export class PrismaHelper {
    // The PrismaClient in node_modules is already custom-tailored to our schema, so we get all the type-checking.
    static getClient = (): PrismaClient => {
        return new PrismaClient({
            datasources: {
                db: {
                    url: `${SUPABASE_DB_STRING}?connection_limit=1&pool_timeout=0&pgbouncer=true`
                }
            }
        });
    };

    /// TODO: is there a better way to do a singleton thing here? I didn't research the implications of re-using this.
    static shared = PrismaHelper.getClient();
}

let prismaInstance: PrismaClient;
if (process.env.NODE_ENV === 'production') {
    prismaInstance = PrismaHelper.shared;
} else {
    if (!(global as any).prisma) {
        (global as any).prisma = PrismaHelper.getClient();
    }
    prismaInstance = (global as any).prisma;
}

/// Syntactic sugar to get a prisma client that won't overwhelm dev.
export const pc = prismaInstance;
