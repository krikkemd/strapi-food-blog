import '../styles/globals.css';
import Head from 'next/head';
import Layout from '../components/Layout';
import { ApolloClient, ApolloProvider, concat, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAccessTokenFromMemory } from '../util/accessToken';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

const authLink = setContext((_, { headers }) => {
  // accesToken is set after successful login, so we get it here, and add it to the headers for every next http request
  const accessToken = getAccessTokenFromMemory();
  console.log(`accessToken: ${accessToken}`);
  return {
    headers: {
      ...headers,
      authorization: accessToken && `Bearer ${accessToken}`,
    },
  };
});

const link = new HttpLink({
  // credentials: 'include',
  uri: `${API_URL}/graphql`,
});

const client = new ApolloClient({
  link: concat(authLink, link),
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <link
          rel='stylesheet'
          href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
          integrity='sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm'
          crossOrigin='anonymous'
        />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
