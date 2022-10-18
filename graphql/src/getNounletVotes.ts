import client from '../../apollo-client'
import { Nounlet } from './graphql.models'
import { gql } from '@apollo/client'
import { ethers } from 'ethers'

export const getNounletVotes = async (
  nounletTokenAddress: string,
  nounletTokenId: string,
  nounletAuctionAddress: string
) => {
  const { data } = await client.query<{ nounlet: Nounlet }>({
    query: gql`
    {
      nounlet (id: "${nounletTokenAddress.toLowerCase()}-${nounletTokenId}") {
        id
        delegateVotes (orderBy: timestamp orderDirection: desc){
          id,
          delegate {id}
          timestamp
        }
      }
    }`
  })

  const filteredVotes = data.nounlet.delegateVotes.filter((vote) => {
    const delegateAddress = vote.delegate.id.toLowerCase().split('-')[1]

    return (
      delegateAddress !== nounletAuctionAddress.toLowerCase() &&
      delegateAddress !== ethers.constants.AddressZero
    )
  })
  data.nounlet.delegateVotes = filteredVotes
  return data
}
