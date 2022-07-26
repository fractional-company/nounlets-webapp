import { ChainId } from '@usedapp/core';

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
}

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet;

export const CHAIN_ID: SupportedChains = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '1');

export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? '';

const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_ID;

//TODO: replaced infura for prod
export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_JSONRPC`];

  if (network === "rinkeby") {
    return custom || `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
  } else {
    return custom || `https://eth-mainnet.alchemyapi.io/v2/jO-pIswuUui5ipthjbcIOZEeuuxWibBd`
  }
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_WSRPC`];

  if (network === "rinkeby") {
    return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
  } else {
    return custom || 'wss://eth-mainnet.alchemyapi.io/v2/jO-pIswuUui5ipthjbcIOZEeuuxWibBd'
  }
};

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Rinkeby]: {
    jsonRpcUri: createNetworkHttpUrl('rinkeby'),
    wsRpcUri: createNetworkWsUrl('rinkeby'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/vidmahovic/nounlets',
  },
  [ChainId.Mainnet]: {
    jsonRpcUri: createNetworkHttpUrl('mainnet'),
    wsRpcUri: createNetworkWsUrl('mainnet'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/vidmahovic/nounlets'
  }
};

export interface NounletContractAddresses {
  nounsletToken: string;
  nounletAuction: string;
}

const chainIdToAddresses: { [chainId: number]: NounletContractAddresses } = {
  [ChainId.Mainnet]: {
    nounsletToken: '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B',
    nounletAuction: '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515'
  },
  [ChainId.Rinkeby]: {
    nounsletToken: '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B',
    nounletAuction: '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515'
  }
};


export const getContractAddressesForChainOrThrow = (chainId: number): NounletContractAddresses => {
  if (!chainIdToAddresses[chainId]) {
    throw new Error(
        `Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`,
    );
  }
  return chainIdToAddresses[chainId];
};

const getAddresses = (): NounletContractAddresses => {
  let nounsAddresses = {} as NounletContractAddresses;
  try {
    nounsAddresses = getContractAddressesForChainOrThrow(CHAIN_ID);
  } catch {}
  return { ...nounsAddresses };
}


const config = {
  app: app[CHAIN_ID],
  isPreLaunch: process.env.REACT_APP_IS_PRELAUNCH || 'false',
  addresses: getAddresses(),
};

export default config;
