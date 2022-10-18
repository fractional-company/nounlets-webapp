import { _Meta, Scalars } from './graphql.models'
import client from '../apollo-client'
import { gql } from '@apollo/client'
import { ethers } from 'ethers'
import { splitKey } from './getVaultData'

type NounletsDataResponse = {
  vault: {
    token: {
      id: Scalars['String']
    }
    noun: {
      currentDelegate: Scalars['String']
      nounlets: {
        id: Scalars['ID']
        holder: {
          id: Scalars['ID']
        }
        delegate: {
          id: Scalars['ID']
        }
      }[]
    }
  }
  _meta: _Meta
}

export const getAllNounlets = async (vaultAddress: string, nounletAuctionAddress: string) => {
  const { data } = await client.query<NounletsDataResponse>({
    query: gql`
    {
      vault(id:"${vaultAddress}") {
        token {
          id
        },
        noun {
          currentDelegate
          nounlets {
            id
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
          number,
          timestamp
        }
      }
    }
    `
  })

  // Remove nounlet auction address
  const nounlets = data.vault.noun.nounlets
    // TODO remove when BE fixes
    .filter((nounlet) => {
      return nounlet.id.split('-')[0].toLowerCase() === data.vault.token.id.toLowerCase()
    })
    .filter(
      (nounlet) =>
        nounlet.holder.id.toLowerCase().split('-')[1] !== nounletAuctionAddress.toLowerCase()
    )

  const accounts: Record<string, { holding: { id: string; delegate: string }[]; votes: number }> =
    {}

  let mostVotes = 0
  let mostVotesAddress = ethers.constants.AddressZero

  nounlets.forEach((nounlet) => {
    const id = splitKey(nounlet.id)
    const holder = splitKey(nounlet.holder.id)
    const delegate = splitKey(nounlet.delegate.id)

    if (accounts[holder] == null) {
      accounts[holder] = { holding: [], votes: 0 }
    }

    if (accounts[delegate] == null) {
      accounts[delegate] = { holding: [], votes: 0 }
    }

    accounts[holder].holding.push({ id, delegate })
    accounts[delegate].votes += 1
    if (accounts[delegate].votes > mostVotes) {
      mostVotes = accounts[delegate].votes
      mostVotesAddress = delegate
    }
  })

  const currentDelegate = data.vault.noun.currentDelegate
  let doesDelegateHaveMostVotes = false

  if (
    currentDelegate !== ethers.constants.AddressZero &&
    mostVotesAddress !== ethers.constants.AddressZero
  ) {
    if (!accounts[currentDelegate]) {
      accounts[currentDelegate] = { holding: [], votes: 0 }
    }
    if (accounts[currentDelegate].votes >= mostVotes) {
      mostVotesAddress = currentDelegate
      doesDelegateHaveMostVotes = true
    }
  }

  return {
    accounts,
    currentDelegate,
    mostVotes,
    mostVotesAddress,
    totalVotes: nounlets.length,
    _meta: data._meta
  }
}
