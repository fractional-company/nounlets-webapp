import { gql } from '@apollo/client'
import { NEXT_PUBLIC_BLOCKS_PER_DAY } from 'config'
import { NounletsSDK } from 'hooks/useSdk'
import client from '../../apollo-client'
import { Account, Nounlet, Vault } from './graphql.models'

interface _META {
  block: {
    hash: string
    number: number
  }
}

interface VaultResponse {
  vault: Vault
}

// get the vault nounlets that BE knows about
export const getVaultData = async (vaultAddress: string) => {
  const { data } = await client.query<VaultResponse>({
    query: gql`
      {
        vault(id: "${vaultAddress.toLowerCase()}") {
          id,
          tokenAddress,
          noun {
            id,
            nounlets {
              id,
            }
          }
        }
      }
    `
  })

  console.log('getVaultData', data)

  // this should not happen
  if (data.vault == null || data.vault.noun == null) {
    throw 'vault not found'
  }

  return {
    isLive: true,
    vaultAddress: data.vault.id.toLowerCase(),
    nounletTokenAddress: data.vault.tokenAddress.toLowerCase(),
    nounTokenId: data.vault.noun.id,
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

// nounlets.holder = current holder
// nounlets.delegate = current delegate (who this nounlet votes for)
// nounlets.delegateVotes = history of delegates (who this nounlet voted for)
export const getLeaderboardData = async (nounTokenId: string) => {
  console.log('🥏 fetching leaderboard data')
  const { data } = await client.query<{ accounts: Account[]; _meta: _META }>({
    query: gql`
      {
        accounts(where: {nounlets_: {noun: "${nounTokenId}"}}) {
          id
          nounlets {
            id
            holder {
              id
            }
            delegate {
              id
            }
            delegateVotes {
              delegate {
                id
              }
              voteAmount
              id
            }
          }
        },
        _meta {
          block {
            number
          }
        }
      }
    `
  })

  console.log('LOLOLOL', data)

  // sort and append totalNounletsHeld
  const newData = data.accounts
    .map((account) => {
      return {
        ...account,
        totalNounletsHeld: account.nounlets.length
      }
    })
    .sort((a, b) => b.totalNounletsHeld - a.totalNounletsHeld)

  return { ...data, accounts: newData }
}

export const getNounletVotes = async (nounletTokenAddress: string, nounletTokenId: string) => {
  console.log('trying!')

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

  console.log('got data', data)
  return data
}
