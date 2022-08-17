import { GetServerSideProps } from 'next'
import client from '../../apollo-client'
import { gql } from '@apollo/client'
import { Vault } from '../models/vault'
import { NounletAuctionAbiInterface } from 'typechain/interfaces/NounletAuctionAbi'
import { RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { BigNumber } from 'ethers'

interface VaultResponse {
  vault: Vault
}

export const getNouletAuctionDataFromBC = async (
  vaultAddress: string,
  vaultTokenAddress: string,
  vaultTokenId: string,
  nounletId: string,
  nounletAuction: RinkebySdk['nounletAuction'],
  latestNounletId: string
) => {
  console.log('🌟 Fetching blockchain data')
  console.log({
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

  console.log('🌟 got curent data', { auctionInfo, bids })

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
      blockTimestamp: '1660674514'
    }
  })

  const bidder = nounletId === latestNounletId ? null : formattedBids.at(-1)?.bidder || null

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

  console.log('shaped', shape)

  return shape
}

export const getVaultData = async (id: string) => {
  console.log('getVaultData', id)
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
                bids(first: 3) {
                  id
                  bidder {
                    id
                  }
                  amount
                  blockNumber
                  blockTimestamp
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

export const getVault = async (id: string): Promise<Vault> => {
  console.log('getVault', id)
  const { data } = await client.query<VaultResponse>({
    query: gql`
      query MyQuery {
        vault(id: "${id}") {
          id
          noun {
            id
            nounlets {
              id
            }
          }
        }
      }
    `
  })

  return data.vault
}
