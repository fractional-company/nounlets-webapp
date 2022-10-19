import client from '../../apollo-client'
import { graphql } from '../dist'

export const getVaultListGQL = async () => {
  return client.query({
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
}

export const getVaultGQL = async (vaultID: string) => {
  console.log('getVaultGQL', vaultID)
  return client.query({
    query: graphql(`
      query Vault($vaultID: ID!) {
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
}

export const getVaultByNounGQL = async (nounID: string) => {
  console.log('getVaultByNounGQL', nounID)
  return client.query({
    query: graphql(`
      query VaultByNoun($nounID: String!) {
        vaults(where: { noun: $nounID }) {
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
      nounID: nounID.toLowerCase()
    }
  })
}

export const getVaultNounletAuctionGQL = async (vaultID: string, nounletID: string) => {
  return client.query({
    query: graphql(`
      query VaultNounletAuction($vaultID: ID!, $nounletID: ID!) {
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
        _meta {
          block {
            number
            timestamp
          }
        }
      }
    `),
    variables: {
      vaultID: vaultID.toLowerCase(),
      nounletID: nounletID.toLowerCase()
    }
  })
}

export const getVaultNounletVotesGQL = async (nounletID: string) => {
  return client.query({
    query: graphql(`
      query VaultNounletVotes($nounletID: ID!) {
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
}
