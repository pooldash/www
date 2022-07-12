// @ts-ignore
import * as CoinMarketCap from 'coinmarketcap-api';
import { COINMARKETCAP_KEY } from '../env';
import { SlowCache } from './CacheService';

// CoinMarketCap id for POKT token (this is necessary to disambiguate)
const pokt_id = 11823;

export namespace PriceService {
    export const getPoktPriceDollars = async (): Promise<number> => {
        // Try to load a cached price:
        const cachedPrice = await SlowCache.get('pokt_price');
        if (cachedPrice !== null) {
            return +cachedPrice;
        }

        // Fetch from CMC:
        const client = new CoinMarketCap(COINMARKETCAP_KEY);
        const result = await client.getQuotes({ id: [pokt_id] });
        const price = result.data[pokt_id.toString()].quote.USD.price as number;

        // Cache result:
        await SlowCache.set('pokt_price', `${price}`);
        
        return price;
    };
}