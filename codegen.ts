import type { CodegenConfig } from '@graphql-codegen/cli'
import { CHAIN_ID } from './config'

console.log('asd', CHAIN_ID)

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://api.thegraph.com/subgraphs/name/fractional-company/nounlets-goerli',
  documents: 'graphql/src/**/*.ts',
  generates: {
    'graphql/dist': {
      preset: 'client',
      plugins: []
    },
    './graphql.schema.json': {
      plugins: ['introspection']
    }
  }
}

export default config
