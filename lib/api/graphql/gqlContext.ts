import { NextApiRequest, NextApiResponse } from 'next';


export interface CustomRequest extends NextApiRequest {
    /// For logged in users, we'll set this string in our middleware
    userId?: string;
}

/// The custom context object we inject to each resolver func
export interface GQLContext {
    req: CustomRequest;
    res: NextApiResponse;
}
