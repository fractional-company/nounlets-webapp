import { ChainId } from '@usedapp/core'

interface AppConfig {
  jsonRpcUri: string
  subgraphApiUri: string
}

type SupportedChains = ChainId.Goerli | ChainId.Mainnet

export const CHAIN_ID: SupportedChains = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '1')
export const IS_DEVELOP = CHAIN_ID !== 1
export const NEXT_PUBLIC_MAX_NOUNLETS = parseInt(process.env.NEXT_PUBLIC_MAX_NOUNLETS ?? '100')
export const NEXT_PUBLIC_NOUN_VAULT_ADDRESS =
  (typeof window !== 'undefined' &&
    localStorage?.getItem('NEXT_PUBLIC_NOUN_VAULT_ADDRESS_OVERRIDE')) ||
  process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS ||
  ''
export const NEXT_PUBLIC_BLOCKS_PER_DAY = parseInt(process.env.NEXT_PUBLIC_BLOCKS_PER_DAY ?? '7500')
export const NEXT_PUBLIC_BID_DECIMALS = +(process.env.NEXT_PUBLIC_BID_DECIMALS || 2)
export const NEXT_PUBLIC_CACHE_VERSION = +(process.env.NEXT_PUBLIC_CACHE_VERSION || -1)
export const NEXT_PUBLIC_SHOW_DEBUG =
  (process.env.NEXT_PUBLIC_SHOW_DEBUG || '0') === '1' ||
  !!(typeof window !== 'undefined' && localStorage?.getItem('ohgeezohman'))
export const NEXT_PUBLIC_OPENSEA_KEY = process.env.NEXT_PUBLIC_OPENSEA_KEY

const app: Record<number, AppConfig> = {
  [CHAIN_ID]: {
    jsonRpcUri: process.env.NEXT_PUBLIC_ALCHEMY_HTTPS ?? '',
    subgraphApiUri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? ''
  }
}

const config = {
  app: app[CHAIN_ID]
}

export const OPENSEA_API_URL = {
  [1]: 'https://api.opensea.io/api/v1',
  [5]: 'https://testnets-api.opensea.io/api/v1'
}

export const OPENSEA_URL = {
  [1]: 'https://opensea.io',
  [5]: 'https://testnets-opensea.io'
}

export default config
