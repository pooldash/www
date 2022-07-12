import { pc } from '~/lib/api/repo/Prisma';

export type CacheKey = 'pokt_price' | 'stats' | 'block_details' | 'recent_rewards' | 'block_date' | 'daily_blocks' | 'daily_rewards' | 'chain_node_health';

const expirationTimeMinutes = 20;

/// This is built ontop of postgres, so it's slow (and kinda lazy / stupid)
export namespace SlowCache {
    export const get = async (key: CacheKey, tag?: string): Promise<string | null> => {
        const oldestTimestampAllowed = Date.now() - (expirationTimeMinutes * 1000 * 60);
        const oldestDateAllowed = new Date(oldestTimestampAllowed);

        const cacheKey = !!tag ? `${key}_${tag}` : key;
        const result = await pc.cache.findFirst({
            where: {
                AND: [
                    { key: cacheKey },
                    {
                        created_at: {
                            gte: oldestDateAllowed
                        }
                    }
                ]
            },
            orderBy: { created_at: 'desc' }
        });

        return result?.value ?? null;
    };

    export const set = async (key: CacheKey, value: string, tag?: string) => {
        const cacheKey = !!tag ? `${key}_${tag}` : key;
        await pc.cache.create({
            data: {
                key: cacheKey,
                value,
                created_at: (new Date())
            }
        });
    };

    /// Clears expired entries from the cache.
    export const purge = async () => {
        const oldestTimestampAllowed = Date.now() - (expirationTimeMinutes * 1000 * 60);
        const oldestDateAllowed = new Date(oldestTimestampAllowed);

        await pc.cache.deleteMany({
            where: {
                created_at: {
                    lt: oldestDateAllowed
                }
            }
        });
    };
    
}