import { GetServerSideProps } from 'next'
import client from '../../apollo-client'
import { gql } from '@apollo/client'
import { NounletAuctionAbiInterface } from 'typechain/interfaces/NounletAuctionAbi'
import { RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { BigNumber, ethers } from 'ethers'
import { NEXT_PUBLIC_BLOCKS_PER_DAY } from 'config'
import { Account, Nounlet, Vault } from './graphql.models'

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
          tokenAddress,
          noun {
            nounlets {
              id,
            }
          }
        }
      }
    `
  })

  console.log('getVaultMetadata', data)

  // this should not happen
  if (data.vault == null || data.vault.noun == null) {
    console.log('no auction started')
    return {
      vaultAddress: vaultAddress.toLowerCase(),
      nounletTokenAddress: '0xf84c41e7b15df8c6e218ccc701f7b3be87e6b8c4', // ethers.constants.AddressZero
      nounletCount: 1
    }
  }

  return {
    vaultAddress: data.vault.id.toLowerCase(),
    nounletTokenAddress: data.vault.tokenAddress.toLowerCase(),
    nounletCount: data.vault.noun.nounlets.length
  }
}

export const getNounletAuctionData = async (
  vaultAddress: string,
  nounletTokenAddress: string,
  nounletTokenId: string
) => {
  console.groupCollapsed('🚀 Fetching auction data from BE')
  console.table({ vaultAddress, nounletTokenAddress, nounletTokenId })
  console.groupEnd()

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

  console.groupCollapsed('🚀 Fetched auction data from BE')
  console.log(data)
  console.groupEnd()

  return data.vault.noun!.nounlets[0]
}

export const getNounletAuctionDataBC = async (
  vaultAddress: string,
  nounletTokenAddress: string,
  nounletTokenId: string,
  nounletAuction: RinkebySdk['NounletAuction']
) => {
  console.groupCollapsed('🔩 Fetching auction data from Blockchain')
  console.table({ vaultAddress, nounletTokenAddress, nounletTokenId })
  console.groupEnd()

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

  console.groupCollapsed('🔩 Fetched auction data from Blockchain')
  console.log(shape)
  console.groupEnd()

  return shape as Awaited<ReturnType<typeof getNounletAuctionData>>
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

export const getLeaderboardData = async () => {
  const { data } = await client.query<{ accounts: Account[] }>({
    query: gql`
      {
        accounts(orderBy: totalNounletsHeld, orderDirection: desc) {
          id
          totalNounletsHeld
          nounlets {
            id
            delegateVotes {
              delegate {
                id
              }
              voteAmount
              id
            }
          }
        }
      }
    `
  })

  return data
}
