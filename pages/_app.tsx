import { ApolloProvider } from '@apollo/client';
import { client } from '~/gql/apollo';
import '~/styles/globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonTheme } from 'react-loading-skeleton';

function MyApp({ Component, pageProps }) {

    return <ApolloProvider client={ client }>
        <SkeletonTheme
            baseColor='#7DF1E6'
            highlightColor='#96c7ff'
            borderRadius='0.2rem'
            duration={3}
            height={25}
        >
            <Component {...pageProps} />
        </SkeletonTheme>
    </ApolloProvider>;
}

export default MyApp;
