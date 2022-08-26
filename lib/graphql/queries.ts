import { gql } from '@apollo/client'
import { NEXT_PUBLIC_BLOCKS_PER_DAY } from 'config'
import { BigNumber } from 'ethers'
import { NounletsSDK } from 'hooks/useSdk'
import client from '../../apollo-client'
import { Account, Auction, Bid, Nounlet, Scalars, Vault, _Meta } from './graphql.models'

type VaultDataResponse = {
  vault: {
    id: Scalars['ID']
    tokenAddress: Scalars['String']
    noun: {
      id: Scalars['ID']
      currentDelegate: Scalars['String']
      nounlets: {
        id: Scalars['ID']
      }[]
    }
  }
}

// Get the vault nounlets that BE knows about
export const getVaultData = async (vaultAddress: string) => {
  const { data } = await client.query<VaultDataResponse>({
    query: gql`
      {
        vault(id: "${vaultAddress.toLowerCase()}") {
          id,
          tokenAddress,
          noun {
            id,
            currentDelegate,
            nounlets {
              id,
            }
          }
        }
      }
    `
  })

  if (data.vault == null || data.vault.noun == null) {
    throw 'vault not found'
  }

  return {
    isLive: true,
    vaultAddress: data.vault.id.toLowerCase(),
    nounletTokenAddress: data.vault.tokenAddress.toLowerCase(),
    nounTokenId: data.vault.noun.id,
    nounletCount: data.vault.noun.nounlets.length,
    backendCurrentDelegate: data.vault.noun.currentDelegate
  }
}

type AuctionDataResponse = {
  vault: {
    noun: {
      nounlets: {
        id: Scalars['ID']
        auction: {
          id: Scalars['ID']
          settled: Scalars['Boolean']
          highestBidAmount: Scalars['BigInt']
          highestBidder?: {
            id: Scalars['ID']
          }
          endTime: Scalars['BigInt']
          bids: {
            id: Scalars['ID']
            bidder: {
              id: Scalars['ID']
            }
            amount: Scalars['BigInt']
            blockNumber: Scalars['BigInt']
            blockTimestamp: Scalars['BigInt']
            txIndex: Scalars['BigInt']
          }[]
        }
      }[]
    }
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

  const { data } = await client.query<AuctionDataResponse>({
    query: gql`
    {
      vault(id: "${vaultAddress.toLowerCase()}") {
        noun {
          nounlets (where: { id: "${nounletTokenAddress.toLowerCase()}-${nounletTokenId}" }) {
            id,
            auction {
              id
              settled
              highestBidAmount
              highestBidder {
                id
              }
              endTime
              bids(orderBy: amount orderDirection: desc) {
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

  return data.vault.noun!.nounlets[0].auction
}

export const getNounletAuctionDataBC = async (
  vaultAddress: string,
  nounletTokenAddress: string,
  nounletTokenId: string,
  nounletAuction: NounletsSDK['NounletAuction']
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
  type BidBC = AuctionDataResponse['vault']['noun']['nounlets'][0]['auction']['bids'][0]
  const formattedBids: BidBC[] = bids
    .map((bid) => {
      const value = bid.args._value.toString()
      return {
        id: bid.transactionHash,
        bidder: {
          id: bid.args._bidder
        },
        amount: value,
        blockNumber: bid.blockNumber,
        blockTimestamp: 0,
        txIndex: bid.transactionIndex
      }
    })
    .sort((a, b) => {
      return BigNumber.from(b.amount).sub(BigNumber.from(a.amount)).toNumber()
    })

  // TODO id toLowerCase() if needed
  const latestBid = formattedBids.at(0)
  const highestBidder = latestBid?.bidder || undefined
  const highestBidAmount = latestBid?.amount || 0

  type AuctionBC = AuctionDataResponse['vault']['noun']['nounlets'][0]['auction']
  const auction: AuctionBC = {
    id: nounletTokenAddress + '-' + nounletTokenId,
    settled: false,
    highestBidAmount: highestBidAmount,
    highestBidder: highestBidder,
    endTime: auctionInfo.endTime,
    bids: [...formattedBids]
  }

  console.groupCollapsed('🔩 Fetched auction data from Blockchain')
  console.log(auction)
  console.groupEnd()

  return auction
}

// nounlets.holder = current holder
// nounlets.delegate = current delegate (who this nounlet votes for)
// nounlets.delegateVotes = history of delegates (who this nounlet voted for)
export const getLeaderboardData = async (nounTokenId: string) => {
  console.log('🥏 fetching leaderboard data')

  return {
    accounts: [],
    _meta: {
      block: {
        number: 12270204
      }
    }
  } as {
    accounts: any[]
    _meta: {
      block: {
        number: number
      }
    }
  }

  // const { data } = await client.query<{ accounts: Account[]; _meta: _Meta }>({
  //   query: gql`
  //     {
  //       accounts(where: {nounlets_: {noun: "${nounTokenId}"}}) {
  //         id
  //         nounlets {
  //           id
  //           holder {
  //             id
  //           }
  //           delegate {
  //             id
  //           }
  //           delegateVotes {
  //             delegate {
  //               id
  //             }
  //             voteAmount
  //             id
  //           }
  //         }
  //       },
  //       _meta {
  //         block {
  //           number
  //         }
  //       }
  //     }
  //   `
  // })

  // // sort and append totalNounletsHeld
  // const newData = data.accounts
  //   .map((account) => {
  //     return {
  //       ...account,
  //       totalNounletsHeld: account.nounlets.length
  //     }
  //   })
  //   .sort((a, b) => b.totalNounletsHeld - a.totalNounletsHeld)

  // return { ...data, accounts: newData }
}

export const getNounletVotes = async (nounletTokenAddress: string, nounletTokenId: string) => {
  const { data } = await client.query<{ nounlet: Nounlet }>({
    query: gql`
    {
      nounlet (id: "${nounletTokenAddress.toLowerCase()}-${nounletTokenId}") {
        id
        delegateVotes {
          id,
          delegate {id}
          timestamp
        }
      }
    }`
  })
  return data
}
