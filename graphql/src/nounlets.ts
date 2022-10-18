import client from '../../apollo-client'
import { graphql } from '../dist'

export const getVaultListGQL = async () => {
  const { data } = await client.query({
    query: graphql(`
      query VaultList {
        vaults {
          id
          token {
            id
          }
          noun {
            id
            currentDelegate
            nounlets(first: 1) {
              id
              auction {
                startTime
              }
            }
          }
        }
        _meta {
          block {
            number
            timestamp
          }
        }
      }
    `)
  })
  return data
}

export const getVaultDataGQL = async (vaultID: string) => {
  const { data } = await client.query({
    query: graphql(`
      query VaultData($vaultID: ID!) {
        vault(id: $vaultID) {
          id
          token {
            id
          }
          noun {
            id
            currentDelegate
            nounlets {
              id
              auction {
                settled
              }
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
            number
            timestamp
          }
        }
      }
    `),
    variables: {
      vaultID: vaultID.toLowerCase()
    }
  })
  return data
}

export const getVaultNounletAuctionDataGQL = async (vaultID: string, nounletID: string) => {
  const { data } = await client.query({
    query: graphql(`
      query VaultNounletAuctionData($vaultID: ID!, $nounletID: ID!) {
        vault(id: $vaultID) {
          noun {
            nounlets(where: { id: $nounletID }) {
              id
              auction {
                id
                settled
                settledTransactionHash
                highestBidAmount
                highestBidder {
                  id
                }
                endTime
                bids(orderBy: amount, orderDirection: desc) {
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
    `),
    variables: {
      vaultID: vaultID.toLowerCase(),
      nounletID: nounletID.toLowerCase()
    }
  })

  return data
}

export const getVaultNounletVotesDataGQL = async (nounletID: string) => {
  const { data } = await client.query({
    query: graphql(`
      query VaultNounletVotesData($nounletID: ID!) {
        nounlet(id: $nounletID) {
          id
          delegateVotes(orderBy: timestamp, orderDirection: desc) {
            id
            delegate {
              id
            }
            timestamp
          }
        }
        _meta {
          block {
            number
            timestamp
          }
        }
      }
    `),
    variables: {
      nounletID: nounletID.toLowerCase()
    }
  })
  return data
}
