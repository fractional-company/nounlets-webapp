import { GetServerSideProps } from 'next'
import client from '../../apollo-client'
import { gql } from '@apollo/client'
import { Vault } from '../models/vault'
import { NounletAuctionAbiInterface } from 'typechain/interfaces/NounletAuctionAbi'
import { RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { BigNumber, ethers } from 'ethers'
import { NEXT_PUBLIC_BLOCKS_PER_DAY } from 'config'

interface VaultResponse {
  vault: Vault
}

// get the vault nounlets that BE knows about
export const getVaultMetadata = async (vaultAddress: string) => {
  const { data } = await client.query<VaultResponse>({
    query: gql`
      {
        vault(id: "${vaultAddress.toLowerCase()}") {
          id,
          noun {
            nounlets {
              id
            }
          }
        }
      }
    `
  })

  // this should not happen
  if (data.vault.noun.nounlets.length === 0) {
    console.log('no auction started')
    return {
      vaultAddress: data.vault.id.toLowerCase(),
      nounletTokenAddress: ethers.constants.AddressZero,
      nounletCount: 0
    }
  }

  const firstNounlet = data.vault.noun.nounlets[0]
  const [nounletTokenAddress, nounletId] = firstNounlet.id.split('-')

  return {
    vaultAddress: data.vault.id.toLowerCase(),
    nounletTokenAddress: nounletTokenAddress.toLowerCase(),
    nounletCount: data.vault.noun.nounlets.length
  }
}

export const getNounletAuctionData = async (
  vaultAddress: string,
  nounletTokenAddress: string,
  nounletTokenId: string
) => {
  console.log('🚀 Fetching auction data from BE')
  console.table({ vaultAddress, nounletTokenAddress, nounletTokenId })

  const { data } = await client.query<VaultResponse>({
    query: gql`
    {
      vault(id: "${vaultAddress.toLowerCase()}") {
        id,
        noun {
          id
          nounlets (where: { id: "${nounletTokenAddress.toLowerCase()}-${nounletTokenId}" }) {
            id,
            auction {
              id
              amount
              settled
              startTime
              endTime
              bidder {
                id
              }
              bids(orderBy: blockTimestamp orderDirection: desc) {
                id
                bidder {
                  id
                }
                amount
                blockNumber
                blockTimestamp
                txIndex
              }
            }
          }
        }
      }
    }`
  })

  console.log('🚀 Fetched auction data from BE')
  console.log(data)

  return data.vault.noun.nounlets[0]
}

export const getNounletAuctionDataBC = async (
  vaultAddress: string,
  nounletTokenAddress: string,
  nounletTokenId: string,
  nounletAuction: RinkebySdk['nounletAuction']
) => {
  console.log('⛓ Fetching auction data from Blockchain')
  console.table({ vaultAddress, nounletTokenAddress, nounletTokenId })

  const bidFilter = nounletAuction.filters.Bid(
    vaultAddress,
    nounletTokenAddress,
    nounletTokenId,
    null,
    null
  )

  const [auctionInfo, bids] = await Promise.all([
    nounletAuction.auctionInfo(vaultAddress, nounletTokenId),
    nounletAuction.queryFilter(bidFilter, -NEXT_PUBLIC_BLOCKS_PER_DAY)
  ])

  // Transform into GraphQL shape
  const formattedBids = bids.map((bid) => {
    const value = bid.args._value.toString()
    return {
      id: bid.transactionHash,
      bidder: {
        id: bid.args._bidder
      },
      amount: value,
      blockNumber: bid.blockNumber,
      blockTimestamp: '1660674514',
      txIndex: bid.transactionIndex
    }
  })

  // TODO id toLowerCase() if needed
  const bidder = formattedBids.at(-1)?.bidder || null
  const shape = {
    id: nounletTokenAddress + '-' + nounletTokenId,
    auction: {
      id: nounletTokenAddress + '-' + nounletTokenId,
      amount: auctionInfo.amount.toString(),
      settled: false,
      startTime: '' + auctionInfo.endTime,
      endTime: '' + auctionInfo.endTime,
      bidder: bidder,
      bids: [...formattedBids]
    }
  }

  return shape
}

export const getNouletAuctionDataFromBC = async (
  vaultAddress: string,
  vaultTokenAddress: string,
  vaultTokenId: string,
  nounletId: string,
  nounletAuction: RinkebySdk['nounletAuction'],
  latestNounletId: string
) => {
  console.log('🌟 Fetching blockchain data', {
    vaultAddress,
    vaultTokenAddress,
    vaultTokenId,
    nounletId,
    latestNounletId
  })

  const bidFilter = nounletAuction.filters.Bid(
    vaultAddress,
    vaultTokenAddress,
    nounletId,
    null,
    null
  )

  const [auctionInfo, bids] = await Promise.all([
    nounletAuction.auctionInfo(vaultAddress, nounletId),
    nounletAuction.queryFilter(bidFilter)
  ])

  // Transform into GraphQL shape
  const formattedBids = bids.map((bid) => {
    const value = bid.args._value.toString()
    return {
      id: bid.transactionHash.toLowerCase(),
      bidder: {
        id: bid.args._bidder.toLowerCase()
      },
      amount: value,
      blockNumber: bid.blockNumber,
      blockTimestamp: '1660674514'
    }
  })

  const bidder = formattedBids.at(-1)?.bidder || null

  const shape = {
    id: nounletId,
    auction: {
      amount: auctionInfo.amount.toString(),
      startTime: '' + auctionInfo.endTime,
      endTime: '' + auctionInfo.endTime,
      bidder,
      settled: nounletId !== latestNounletId,
      bids: [...formattedBids]
    }
  }

  console.log('🌟 got curent data', { auctionInfo, bids, shape })
  return shape
}

export const getNounletBids = async (id: string, nounletId: string) => {
  const { data } = await client.query<VaultResponse>({
    query: gql`
      {
        vault(id: "${id.toLowerCase()}") {
          noun {
            nounlets (where: { id: "${nounletId}"}) {
              auction {
                bids(orderBy: blockTimestamp, orderDirection: desc) {
                  id
                  bidder {
                    id
                  }
                  amount
                  blockNumber
                  blockTimestamp
                  txIndex
                }
              }
            }
          }
        }
      }
    `
  })

  return data
}

export const getVaultData = async (id: string) => {
  const { data } = await client.query<VaultResponse>({
    query: gql`
      {
        vault(id: "${id.toLowerCase()}") {
          id
          noun {
            id
            nounlets {
              id
              auction {
                amount
                startTime
                endTime
                bidder {
                  id
                }
                settled
                bids(first: 3, orderBy: blockTimestamp, orderDirection: desc) {
                  id
                  bidder {
                    id
                  }
                  amount
                  blockNumber
                  blockTimestamp
                  txIndex
                }
              }
            }
          }
        }
      }
    `
  })

  return data
}
