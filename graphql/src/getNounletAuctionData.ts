import { Scalars } from './graphql.models'
import client from '../../apollo-client'
import { gql } from '@apollo/client'
import { splitKey } from './getVaultData'
import { NounletsSDK } from '../../src/hooks/useSdk'
import { NEXT_PUBLIC_BLOCKS_PER_DAY } from '../../config'
import { BigNumber, ethers } from 'ethers'

type AuctionDataResponse = {
  vault: {
    noun: {
      nounlets: {
        id: Scalars['ID']
        auction: {
          id: Scalars['ID']
          settled: Scalars['Boolean']
          settledTransactionHash: Scalars['String']
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
  // console.groupCollapsed('🚀 Fetching auction data from BE')
  // console.table({ vaultAddress, nounletTokenAddress, nounletTokenId })
  // console.groupEnd()

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
              settledTransactionHash
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

  // console.groupCollapsed('🚀 Fetched auction data from BE')
  // console.log(data)
  // console.groupEnd()

  if ((data.vault.noun?.nounlets?.length ?? 0) === 0) {
    // console.log('BE doesnt have data yet')
    return null
  }

  const auction = data.vault.noun.nounlets[0].auction
  auction.id = splitKey(auction.id)
  if (auction.highestBidder) {
    auction.highestBidder = {
      ...auction.highestBidder,
      id: splitKey(auction.highestBidder.id)
    }
  }
  auction.bids = auction.bids.map((auction) => {
    return {
      ...auction,
      bidder: {
        id: splitKey(auction.bidder.id)
      }
    }
  })

  return auction
}

export const getNounletAuctionDataBC = async (
  vaultAddress: string,
  nounletTokenAddress: string,
  nounletTokenId: string,
  nounletAuction: NounletsSDK['NounletAuction']
) => {
  // console.groupCollapsed('🔩 Fetching auction data from Blockchain')
  // console.table({ vaultAddress, nounletTokenAddress, nounletTokenId })
  // console.groupEnd()

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
          id: `${bid.args._bidder}`
        },
        amount: value,
        blockNumber: bid.blockNumber,
        blockTimestamp: 0,
        txIndex: bid.transactionIndex
      }
    })
    .sort((a, b) => {
      // return BigNumber.from(b.amount).sub(BigNumber.from(a.amount)).toNumber() // This can overflow
      return BigNumber.from(b.amount).gte(BigNumber.from(a.amount)) ? 1 : -1
    })

  // TODO id toLowerCase() if needed
  const latestBid = formattedBids.at(0)
  const highestBidder = latestBid?.bidder || undefined
  const highestBidAmount = latestBid?.amount || 0

  type AuctionBC = AuctionDataResponse['vault']['noun']['nounlets'][0]['auction']
  const auction: AuctionBC = {
    id: nounletTokenId,
    settled: false,
    settledTransactionHash: ethers.constants.AddressZero,
    highestBidAmount: highestBidAmount,
    highestBidder: highestBidder,
    endTime: auctionInfo.endTime,
    bids: [...formattedBids]
  }

  // console.groupCollapsed('🔩 Fetched auction data from Blockchain')
  // console.log(auction)
  // console.groupEnd()

  return auction
}
