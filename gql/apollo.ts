import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { IS_PREVIEW } from '~/lib/api/env';

// Hack to point local dev at production for easiser frontend dev
const uri = IS_PREVIEW ? 'https://stakeriver.com/api/graphql' : '/api/graphql';
// const uri = '/api/graphql;

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri,
        credentials: 'include',
    }),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});
