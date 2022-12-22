import client from '../../apollo-client'
import { graphql } from '../dist'

export const getVaultListGQL = async (first = 10) => {
  return client.query({
    query: graphql(`
      query VaultList($first: Int!) {
        vaults(first: $first) {
          id
          nounInVault
          token {
            id
          }
          noun {
            id
            currentDelegate
            nounlets(orderBy: id, orderDirection: asc) {
              id
              auction {
                startTime
                endTime
                highestBidAmount
                settled
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
      first
    }
  })
}

export const getVaultGQL = async (vaultId: string) => {
  console.log('getVaultGQL', vaultId)
  return client.query({
    query: graphql(`
      query Vault($vaultId: ID!) {
        vault(id: $vaultId) {
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
      vaultId: vaultId.toLowerCase()
    }
  })
}

export const getVaultByNounGQL = async (nounId: string) => {
  console.log('getVaultByNounGQL', nounId)
  return client.query({
    query: graphql(`
      query VaultByNoun($nounId: String!) {
        vaults(where: { noun: $nounId }) {
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
      nounId: nounId.toLowerCase()
    }
  })
}

export const getVaultNounletAuctionGQL = async (vaultId: string, nounletId: string) => {
  return client.query({
    query: graphql(`
      query VaultNounletAuction($vaultId: ID!, $nounletId: ID!) {
        vault(id: $vaultId) {
          noun {
            nounlets(where: { id: $nounletId }) {
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
      vaultId: vaultId.toLowerCase(),
      nounletId: nounletId.toLowerCase()
    }
  })
}

export const getVaultNounletVotesGQL = async (nounletId: string) => {
  return client.query({
    query: graphql(`
      query VaultNounletVotes($nounletId: ID!) {
        nounlet(id: $nounletId) {
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
      nounletId: nounletId.toLowerCase()
    }
  })
}
