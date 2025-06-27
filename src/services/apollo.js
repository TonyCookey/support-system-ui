import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

const uploadLink = createUploadLink({
    uri: import.meta.env.API_GRAPHQL_URI || 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

export default new ApolloClient({
    link: authLink.concat(uploadLink),
    cache: new InMemoryCache()
});
