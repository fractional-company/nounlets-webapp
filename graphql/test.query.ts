import { gql } from '@apollo/client'

export const GET_ALL_VAULTS = gql`
  query Query {
    vaults {
      id
    }
  }
`
