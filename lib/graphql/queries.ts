import { gql } from '@apollo/client'
import { NEXT_PUBLIC_BLOCKS_PER_DAY } from 'config'
import { BigNumber, ethers } from 'ethers'
import { NounletsSDK } from 'hooks/useSdk'
import client from '../../apollo-client'
import { Account, Auction, Bid, Nounlet, Scalars, Vault, _Meta } from './graphql.models'

function splitKey(key: string) {
  try {
    const parts = key.split('-')
    if (parts.length === 1) return key
    return parts[1]
  } catch (error) {
    console.log('Error spliting key', key)
    return key
  }
}

type VaultDataResponse = {
  vault: {
    id: Scalars['ID']
    token: {
      id: Scalars['String']
    }
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
          token {
            id
          },
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

  if (data == null || data.vault == null || data.vault.noun == null) {
    throw 'vault not found'
  }

  return {
    isLive: true,
    vaultAddress: data.vault.id.toLowerCase(),
    nounletTokenAddress: data.vault.token.id.toLowerCase(),
    nounTokenId: data.vault.noun.id,
    nounletCount: data.vault.noun.nounlets.length,
    backendCurrentDelegate: data.vault.noun.currentDelegate.toLowerCase()
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

type NounletsDataResponse = {
  vault: {
    noun: {
      currentDelegate: Scalars['String']
      nounlets: {
        id: Scalars['ID']
        holder: {
          id: Scalars['ID']
        }
        delegate: {
          id: Scalars['ID']
        }
      }[]
    }
  }
  _meta: _Meta
}

export const getAllNounlets = async (vaultAddress: string, nounletAuctionAddress: string) => {
  const { data } = await client.query<NounletsDataResponse>({
    query: gql`
    {
      vault(id:"${vaultAddress}") {
        noun {
          currentDelegate
          nounlets {
            id
            holder {
              id
            }
            delegate {
              id
            }
          }
        }
      }
      _meta {
        block {
          number,
          timestamp
        }
      }
    }
    `
  })

  // Remove nounlet auction address
  const nounlets = data.vault.noun.nounlets.filter(
    (nounlet) =>
      nounlet.holder.id.toLowerCase().split('-')[1] !== nounletAuctionAddress.toLowerCase()
  )

  const accounts: Record<string, { holding: { id: string; delegate: string }[]; votes: number }> =
    {}

  let mostVotes = 0
  let mostVotesAddress = ethers.constants.AddressZero

  nounlets.forEach((nounlet) => {
    const id = splitKey(nounlet.id)
    const holder = splitKey(nounlet.holder.id)
    const delegate = splitKey(nounlet.delegate.id)

    if (accounts[holder] == null) {
      accounts[holder] = { holding: [], votes: 0 }
    }

    if (accounts[delegate] == null) {
      accounts[delegate] = { holding: [], votes: 0 }
    }

    accounts[holder].holding.push({ id, delegate })
    accounts[delegate].votes += 1
    if (accounts[delegate].votes > mostVotes) {
      mostVotes = accounts[delegate].votes
      mostVotesAddress = delegate
    }
  })

  const currentDelegate = data.vault.noun.currentDelegate
  let doesDelegateHaveMostVotes = false

  if (
    currentDelegate !== ethers.constants.AddressZero &&
    mostVotesAddress !== ethers.constants.AddressZero
  ) {
    if (accounts[currentDelegate].votes >= mostVotes) {
      mostVotesAddress = currentDelegate
      doesDelegateHaveMostVotes = true
    }
  }

  return {
    accounts,
    currentDelegate,
    mostVotes,
    mostVotesAddress,
    totalVotes: nounlets.length,
    _meta: data._meta
  }
}

export const getNounletVotes = async (
  nounletTokenAddress: string,
  nounletTokenId: string,
  nounletAuctionAddress: string
) => {
  const { data } = await client.query<{ nounlet: Nounlet }>({
    query: gql`
    {
      nounlet (id: "${nounletTokenAddress.toLowerCase()}-${nounletTokenId}") {
        id
        delegateVotes (orderBy: timestamp orderDirection: desc){
          id,
          delegate {id}
          timestamp
        }
      }
    }`
  })

  const filteredVotes = data.nounlet.delegateVotes.filter(
    (vote) => vote.delegate.id.toLowerCase().split('-')[1] !== nounletAuctionAddress.toLowerCase()
  )
  data.nounlet.delegateVotes = filteredVotes
  return data
}
