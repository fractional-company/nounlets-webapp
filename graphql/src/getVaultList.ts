import client from '../../apollo-client'
import { graphql } from '../dist'

export const getVaultList = async () => {
  const { data } = await client.query({
    query: graphql(`
      query Query {
        vaults {
          id
          nounInVault
        }
        _meta {
          block {
            number
          }
        }
      }
    `)
  })
  return data
}
