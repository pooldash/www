import { NextApiResponse } from 'next';
import { CustomRequest } from '../../graphql/gqlContext';
import { CookieService } from './CookieService';
import { JWT } from './JWTService';


export namespace AuthMiddleware {
    export const EnrichReqWithUserId = (req: CustomRequest, res: NextApiResponse, next: any) => {
        delete req.userId;
        const encodedToken = CookieService.getJWTCookie(req);
        if (encodedToken) {
            const tokenPayload = JWT.verify(encodedToken);
            if (tokenPayload && tokenPayload.userId) {
                req.userId = tokenPayload.userId;
            }
        }
        next();
    };
}