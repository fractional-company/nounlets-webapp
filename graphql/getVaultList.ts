import { Scalars } from './graphql.models'
import client from '../apollo-client'
import { gql } from '@apollo/client'

type VaultListResponse = {
  vaults: {
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
  }[]
}

export const getVaultList = async (vaultAddress: string) => {
  const { data } = await client.query<VaultListResponse>({
    query: gql`
      {
        vaults {
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
            }
          }
        }
      }
    `
  })
  return data
}
