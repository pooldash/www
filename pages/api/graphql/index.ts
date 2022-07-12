import { ApolloServer } from 'apollo-server-micro';

import { NextApiRequest, NextApiResponse } from 'next';

import cors from 'cors';
import { send } from 'micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import schema from '~/lib/api/graphql/schema';
import { resolvers } from '~/lib/api/graphql/resolvers';
import { util } from '~/lib/api/apiUtil';
import { AuthMiddleware } from '~/lib/api/service/auth/Middleware';
import { Util } from '~/lib/util';

let isStarted = false;
let currentlyStarting = false;

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: ({ req, res }) => ({ req, res }),      // This is the context object, GQLContext
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({
            settings: {
                'editor.theme': 'dark',
                'editor.cursorShape': 'line',
                'editor.reuseHeaders': true,
                'tracing.hideTracingResponse': true,
                'queryPlan.hideQueryPlanResponse': true,
                'editor.fontSize': 16,
                'editor.fontFamily': '\'Source Code Pro\', \'Consolas\', \'Inconsolata\', \'Droid Sans Mono\', \'Monaco\', monospace',
                'request.credentials': 'include',
            },
        }),
    ],
    introspection: true,
    debug: true
});


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // CORS stuff:
    await util.runMiddleware(req, res, cors({ credentials: true, origin: true }));
    if (req.method === 'OPTIONS') {
        return send(res, 200, 'ok');
    }
    // Custom auth stuff:
    await util.runMiddleware(req, res, AuthMiddleware.EnrichReqWithUserId);
    
    
    // GQL attachment (surely there is a better way?):
    let counter = 10;
    while (currentlyStarting && counter > 0) {
        await Util.sleepSeconds(1);
        counter -= 1;
    }
    if (!isStarted) {   
        currentlyStarting = true;
        await server.start();
        isStarted = true;
        currentlyStarting = false;
    }    
    const handler = server.createHandler({ path: '/api/graphql' });
    return handler(req, res);
};

export default handler;

export const config = {
    api: {
        bodyParser: false,
    },
};
