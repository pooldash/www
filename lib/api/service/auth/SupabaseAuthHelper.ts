import { ApiError, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY_ANON } from '../../env';


export namespace SB {
    
    const getClient = (): SupabaseClient => {
        // This uses the anon key, which returns the less-dangerous client.
        return createClient(SUPABASE_URL, SUPABASE_KEY_ANON);
    };

    export const loginUser = async (email: string, password: string) => {
        const supabase = getClient();
        const authResult = await supabase.auth.signIn({
            email,
            password,
        });
        return parseAuthResult(authResult);
    };

    export const signUpUser = async (email: string, password: string) => {
        const supabase = getClient();
        const authResult = await supabase.auth.signUp({
            email,
            password
        });
        return parseAuthResult(authResult);
    };

    const parseAuthResult = (result: {user: User, session: Session, error: ApiError}): User | null => {
        if (result.user) {
            return result.user;
        }
        if (result.error) {
            console.log('Auth error!');
            console.log(result.error.status);
            console.log(result.error.message);
        }
        return null;
    };
}
