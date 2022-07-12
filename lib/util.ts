
/**
 * Just a grab-bag of stateless helper functions with no dependencies on the rest of the app
 */
export namespace Util {
    export const sanityCheckEmailUsingRegex = (email: string): boolean => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    export const validateUsernameUsingRegex = (username: string): boolean => {
        const regex = /^[A-Za-z0-9\-_\.]+$/;
        return regex.test(username);
    };

    /// These 2 methods use ISO strings (supposedly)
    export const stringFromTimestamp = (ts: number): string => {
        const d = new Date(ts);
        return d.toISOString();
    };
    export const timestampFromString = (ds: string): number => {
        const d = new Date(ds);
        return d.getTime();
    };

    export const removePrefix = (base: string, prefix: string): string => {
        const hasPrefix = base.indexOf(prefix) === 0;
        return hasPrefix
            ? base.substr(prefix.length)
            : base.toString();
    };

    export const countBytes = (input: string): number => {
        return Buffer.byteLength(input, 'utf8');
    };

    // Yes, this adds the elipsis if a trimming takes place
    export const trimStringToChars = (input: string, chars: number): string => {
        const shouldTrim = input.length > chars;
        if (!shouldTrim) {
            return input;
        }
        return input.substring(0, chars - 1) + '...';
    };

    export const sleepSeconds = async (seconds: number): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    };

    export const retryWithSleep = async <T>(fn: (() => Promise<T>), max_tries: number, seconds_between: number): Promise<T> => {
        try {
            const result = await fn();
            return result;
        } catch (e) {
            console.error(e);
            const retries_remaining = max_tries - 1;
            if (retries_remaining < 0) {
                throw e;
            }
            await Util.sleepSeconds(seconds_between);
            console.log(`retrying ${retries_remaining} more times.`);
            return await Util.retryWithSleep(fn, retries_remaining, seconds_between);
        }
    };

    export const firstOrNull = <T>(list: T[]): T | null => {
        if (list.length > 0) {
            return list[0];
        }
        return null;
    };

    export const lastOrNull = <T>(list: T[]): T | null => {
        if (list.length > 0) {
            return list[list.length - 1];
        }
        return null;
    };

    export const formatAsDollar = (dollars: number): string => {
        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        return formatter.format(dollars);
    };

    export const formatNumberWithCommas = (input: number, decimalPlaces?: number): string => {
        const maximumFractionDigits = decimalPlaces ?? 2;
        return input.toLocaleString('en-US', { maximumFractionDigits });
    };

    export const microPoktToPokt = (upokt: bigint): number => {
        return Number(upokt) / 1000000;
    };

    export const poktToMicroPokt = (pokt: number): bigint => {
        return BigInt(pokt * 1000000);
    };

    export const validatePoktAddress = (addr: string): boolean => {
        if (addr.length !== 40) {
            return false;
        }
        const re = /[0-9A-Fa-f]{6}/g;
        return re.test(addr);
    };

    export const truncate = (text: string, startChars: number, endChars: number): string => {
        if (text.length <= startChars + endChars) {
            return text;
        }
        var start = text.substring(0, startChars);
        var end = text.substring(text.length - endChars, text.length);
        return start + '...' + end;
    };

    export const ordinalString = (i: number): string => {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + 'st';
        }
        if (j == 2 && k != 12) {
            return i + 'nd';
        }
        if (j == 3 && k != 13) {
            return i + 'rd';
        }
        return i + 'th';
    };
}
