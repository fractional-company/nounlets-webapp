import { ChainId } from '@usedapp/core'
import { BigNumber, ethers } from 'ethers'

interface AppConfig {
  jsonRpcUri: string
  // wsRpcUri: string
  subgraphApiUri: string
}

type SupportedChains = ChainId.Rinkeby | ChainId.Goerli | ChainId.Mainnet

export const CHAIN_ID: SupportedChains = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '1')
export const NEXT_PUBLIC_NOUN_VAULT_ADDRESS = process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS
export const NEXT_PUBLIC_BLOCKS_PER_DAY = 7_000
export const NEXT_PUBLIC_BID_DECIMALS = +(process.env.NEXT_PUBLIC_BID_DECIMALS || 2)
export const NEXT_PUBLIC_CACHE_VERSION = +(process.env.NEXT_PUBLIC_CACHE_VERSION || -1)
export const NEXT_PUBLIC_SHOW_DEBUG = (process.env.NEXT_PUBLIC_SHOW_DEBUG || '0') === '1'

// OLD
// export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? ''

// export const ALCHEMY_RINKEBY_HTTPS_URL = process.env.NEXT_PUBLIC_ALCHEMY_RINKEBY_HTTPS_URL ?? ''
// export const ALCHEMY_RINKEBY_WSS_URL = process.env.NEXT_PUBLIC_ALCHEMY_RINKEBY_WSS_URL ?? ''
// export const ALCHEMY_MAINNET_HTTPS_URL = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_HTTPS_URL ?? ''
// export const ALCHEMY_MAINNET_WSS_URL = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_WSS_URL ?? ''

//TODO: replaced infura for prod
// export const createNetworkHttpUrl = (network: string): string => {
//   return network === 'rinkeby' ? ALCHEMY_RINKEBY_HTTPS_URL : ALCHEMY_MAINNET_HTTPS_URL
// }

// export const createNetworkWsUrl = (network: string): string => {
//   return network === 'rinkeby' ? ALCHEMY_RINKEBY_WSS_URL : ALCHEMY_MAINNET_WSS_URL
// }

const app: Record<number, AppConfig> = {
  [CHAIN_ID]: {
    jsonRpcUri: process.env.NEXT_PUBLIC_ALCHEMY_HTTPS ?? '',
    subgraphApiUri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? ''
  }
  // [ChainId.Mainnet]: {
  //   jsonRpcUri: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_HTTPS ?? '',
  //   subgraphApiUri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_MAINNET ?? ''
  // },
  // [ChainId.Rinkeby]: {
  //   jsonRpcUri: process.env.NEXT_PUBLIC_ALCHEMY_RINKEBY_HTTPS ?? '',
  //   subgraphApiUri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_RINKEBY ?? ''
  // },
  // [ChainId.Goerli]: {
  //   jsonRpcUri: process.env.NEXT_PUBLIC_ALCHEMY_GOERLI_HTTPS ?? '',
  //   subgraphApiUri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_GOERLI ?? ''
  // }
}

// export interface NounletContractAddresses {
//   nounsletToken: string
//   nounletAuction: string
// }

// const chainIdToAddresses: { [chainId: number]: NounletContractAddresses } = {
//   [ChainId.Mainnet]: {
//     nounsletToken: '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B',
//     nounletAuction: '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515'
//   },
//   [ChainId.Rinkeby]: {
//     nounsletToken: '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B',
//     nounletAuction: '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515'
//   }
// }

// export const getContractAddressesForChainOrThrow = (chainId: number): NounletContractAddresses => {
//   if (!chainIdToAddresses[chainId]) {
//     throw new Error(
//       `Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`
//     )
//   }
//   return chainIdToAddresses[chainId]
// }

// const getAddresses = (): NounletContractAddresses => {
//   let nounsAddresses = {} as NounletContractAddresses
//   try {
//     nounsAddresses = getContractAddressesForChainOrThrow(CHAIN_ID)
//   } catch {}
//   return { ...nounsAddresses }
// }

const config = {
  app: app[CHAIN_ID]
  // isPreLaunch: process.env.REACT_APP_IS_PRELAUNCH || 'false',
  // addresses: getAddresses()
}

export default config
