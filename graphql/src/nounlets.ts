import client from '../../apollo-client'
import { graphql } from '../dist'

export const getVaultListGQL = async (first = 100) => {
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
  // console.log('getVaultGQL', vaultId)
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
  // console.log('getVaultByNounGQL', nounId)
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

export type TributedNoun = {
  id: string
  tributedBy: string
}

export const getTributedNounsGQL = async (first = 10) => {
  // return {
  //   data: {
  //     nouns: [
  //       {
  //         id: '1',
  //         tributedBy: 0x497f34f8a6eab10652f846fd82201938e58d72e0
  //       },
  //       {
  //         id: '2',
  //         tributedBy: 0x497f34f8a6eab10652f846fd82201938e58d72e0
  //       },
  //       {
  //         id: '3',
  //         tributedBy: 0x497f34f8a6eab10652f846fd82201938e58d72e3
  //       },
  //       {
  //         id: '4',
  //         tributedBy: 0x497f34f8a6eab10652f846fd82201938e58d72e3
  //       }
  //     ],
  //     _meta: {
  //       block: {
  //         number: 8227570,
  //         timestamp: 1672414632
  //       }
  //     }
  //   }
  // }

  // return client.query({
  //   query: graphql(`
  //     query Nouns {
  //       nouns {
  //         id
  //         tributedBy
  //       }
  //       _meta {
  //         block {
  //           number
  //           timestamp
  //         }
  //       }
  //     }
  //   `)
  // })

  return client.query({
    query: graphql(`
      query Nouns {
        nouns(where: { tributedBy_not: "0x0000000000000000000000000000000000000000" }) {
          id
          tributedBy
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
