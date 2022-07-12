import { NextApiRequest, NextApiResponse } from 'next';
import { CookieSerializeOptions, serialize } from 'cookie';

export namespace util {
    // Helper method to wait for a middleware to execute before continuing
    // And to throw an error when an error happens in a middleware
    export const runMiddleware = async (req: NextApiRequest, res: NextApiResponse, fn: (req: NextApiRequest, res: NextApiResponse, next: (result: any) => void) => void) => {
        return new Promise((resolve, reject) => {
            fn(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result);
                }
                return resolve(result);
            });
        });
    };

    // next.js api response objects don't have a cookie-setter by default?
    export const setCookie = (res: NextApiResponse, name: string, value: any, options: CookieSerializeOptions = {}) => {
        const stringValue =
        typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

        if ('maxAge' in options) {
            options.expires = new Date(Date.now() + options.maxAge);
            options.maxAge /= 1000;
        }

        res.setHeader('Set-Cookie', serialize(name, String(stringValue), options));
    };

    export const removePrefix = (base: string, prefix: string): string => {
        const hasPrefix = base.indexOf(prefix) === 0;
        return hasPrefix
            ? base.substring(prefix.length)
            : base.toString();
    };
}
