import { Scalars } from './graphql.models'
import client from '../apollo-client'
import { gql } from '@apollo/client'

export function splitKey(key: string) {
  try {
    const parts = key.split('-')
    if (parts.length === 1) return key
    return parts[1]
  } catch (error) {
    console.log('Error splitting key', key)
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
        auction: {
          settled: Scalars['Boolean']
        }
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
              auction {
                settled
              }
            }
          }
        }
      }
    `
  })

  if (data == null || data.vault == null || data.vault.noun == null) {
    throw new Error('vault not found')
  }

  const wereAllNounletsAuctioned = data.vault.noun.nounlets.every(
    (nounlet) => nounlet.auction.settled
  )

  // TODO remove when BE fixes
  data.vault.noun.nounlets = data.vault.noun.nounlets.filter((nounlet) => {
    return nounlet.id.split('-')[0].toLowerCase() === data.vault.token.id.toLowerCase()
  })

  return {
    isLive: true,
    vaultAddress: data.vault.id.toLowerCase(),
    nounletTokenAddress: data.vault.token.id.toLowerCase(),
    nounTokenId: data.vault.noun.id,
    nounletCount: data.vault.noun.nounlets.length,
    backendCurrentDelegate: data.vault.noun.currentDelegate.toLowerCase(),
    wereAllNounletsAuctioned
  }
}
