import { NextApiRequest, NextApiResponse } from 'next';
import { util } from '../../apiUtil';
import { DOMAIN_HOST_NAME, IS_PROD, IS_STAGING, VERCEL_URL } from '../../env';

const COOKIE_NAME_JWT = 'jwt';

export namespace CookieService {
    
    export const setJWTCookie = (value: string, res: NextApiResponse) => {
        const days_120_ms = 1000 * 60 * 60 * 24 * 120;

        const domain = getCookieDomain();

        util.setCookie(res, COOKIE_NAME_JWT, value, {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            domain,
            maxAge: days_120_ms
        });
    };

    export const getJWTCookie = (req: NextApiRequest): string | null => {
        const value = req.cookies[COOKIE_NAME_JWT];
        if (!value) {
            return null;
        }
        return value;
    };

    const getCookieDomain = (): string => {
        if (IS_PROD) {
            return `.${DOMAIN_HOST_NAME}`;
        } 
        else if (IS_STAGING) {
            return 'dev.pooldash.com';
        }
        else if (VERCEL_URL === 'localhost:3000') {
            return '.app.localhost';
        }
        else {
            return VERCEL_URL;
        }
    };
}
