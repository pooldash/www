import { GQLContext } from '../graphql/gqlContext';
import { CookieService } from '../service/auth/CookieService';
import { JWT } from '../service/auth/JWTService';
import { SB } from '../service/auth/SupabaseAuthHelper';


export namespace Accounts {
    export const registerUser = async (info: {
        username: string;
        email: string;
        password: string;
        ctx: GQLContext
    }): Promise<string> => {

        try {
            const user = await SB.signUpUser(info.email, info.password);
            const jwt = JWT.sign({ userId: user.id });
            CookieService.setJWTCookie(jwt, info.ctx.res);
            return user.id;
        } catch (e) {
            console.error('can\'t sign up');
            console.dir(e);
        }
    };

    export const loginUser = async (info: {
        email: string;
        password: string;
        ctx: GQLContext
    }): Promise<string> => {

        try {
            const user = await SB.loginUser(info.email, info.password);
            const jwt = JWT.sign({ userId: user.id });
            CookieService.setJWTCookie(jwt, info.ctx.res);
            return user.id;
        } catch (e) {
            console.error('can\'t sign up');
            console.dir(e);
        }
    };

    export const getUserId = async (info: {
        ctx: GQLContext
    }): Promise<string | null> => {
        return info.ctx.req.userId ?? null;
    };
}
