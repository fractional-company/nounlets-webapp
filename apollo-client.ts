import { ApolloClient, InMemoryCache } from '@apollo/client'
import config from './config'

const client = new ApolloClient({
  uri: config.app.subgraphApiUri,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }
  }
})

export default client
