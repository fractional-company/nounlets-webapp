import { ChainId } from '@usedapp/core'

interface AppConfig {
  jsonRpcUri: string
  subgraphApiUri: string
}

type SupportedChains = ChainId.Rinkeby | ChainId.Goerli | ChainId.Mainnet

export const CHAIN_ID: SupportedChains = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '1')
export const NEXT_PUBLIC_NOUN_VAULT_ADDRESS = process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS
export const NEXT_PUBLIC_BLOCKS_PER_DAY = 7_000
export const NEXT_PUBLIC_BID_DECIMALS = +(process.env.NEXT_PUBLIC_BID_DECIMALS || 2)
export const NEXT_PUBLIC_CACHE_VERSION = +(process.env.NEXT_PUBLIC_CACHE_VERSION || -1)
export const NEXT_PUBLIC_SHOW_DEBUG =
  (process.env.NEXT_PUBLIC_SHOW_DEBUG || '0') === '1' ||
  !!(typeof window !== 'undefined' && localStorage?.getItem('ohgeezohman'))

const app: Record<number, AppConfig> = {
  [CHAIN_ID]: {
    jsonRpcUri: process.env.NEXT_PUBLIC_ALCHEMY_HTTPS ?? '',
    subgraphApiUri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? ''
  }
}

const config = {
  app: app[CHAIN_ID]
}

export default config
