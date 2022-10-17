import { CHAIN_ID } from 'config'
import { Goerli, Mainnet, ChainId } from '@usedapp/core'

export function shortenAddress(address: string, chars = 4) {
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`
}

export const getCurentChainExplorerTransactionLink = (txHash: string): string => {
  if (CHAIN_ID === ChainId.Mainnet) return Mainnet.getExplorerTransactionLink(txHash)
  return Goerli.getExplorerTransactionLink(txHash)
}

export const getCurrentChainExplorerAddressLink = (address: string): string => {
  if (CHAIN_ID === ChainId.Mainnet) return Mainnet.getExplorerAddressLink(address)
  return Goerli.getExplorerAddressLink(address)
}
