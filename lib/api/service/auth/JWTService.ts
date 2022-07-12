import jwt from 'jsonwebtoken';
import { SUPABASE_JWT_SECRET } from '../../env';

/// We keep our JWTs simple around here:
export interface JWTPayload {
    userId: string;
}

export namespace JWT {
    export const sign = (payload: JWTPayload): string => {
        return jwt.sign(payload, SUPABASE_JWT_SECRET, { expiresIn: '7 days' });
    };

    export const verify = (encodedToken: string): JWTPayload | null => {
        try {
            const result = jwt.verify(encodedToken, SUPABASE_JWT_SECRET) as JWTPayload;
            if (result) {
                return result;
            }
        } catch (e) {
            console.error('Error verifying JWT:');
            console.error(e);
        }
        return null;
    };
}
