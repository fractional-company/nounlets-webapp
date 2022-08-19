import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import { getLeaderboardData } from 'lib/graphql/queries'
import { useMemo } from 'react'
import { useVaultMetadataStore } from 'store/VaultMetadataStore'
import useSWR from 'swr'
import useSdk from './useSdk'

export default function useLeaderboard() {
  const { account, library } = useEthers()
  const {
    isLoading,
    vaultAddress,
    nounletTokenAddress,
    backendLatestNounletTokenId,
    latestNounletTokenId
  } = useVaultMetadataStore()
  const sdk = useSdk()

  const { data } = useSWR(
    'Leaderboard',
    async (key) => {
      const result = await getLeaderboardData()
      return result.accounts || []
    },
    {
      dedupingInterval: 60 * 1000 // 1 min
    }
  )

  const myNounlets = useMemo(() => {
    if (account == null) return []
    if (data == null) return []

    console.log('mu nounlets')

    // const myAccount = data.find((acc) => acc.id.toLowerCase() === account?.toLowerCase())
    const myAccount = data.find((acc) => {
      console.log({ acc })
      return acc.id.toLowerCase() === account?.toLowerCase()
    })

    return myAccount?.nounlets || []
  }, [data, account])

  const myNounletsVotes = useMemo(() => {
    if (account == null) return {}
    return myNounlets
      .map((vote) => vote.delegateVotes.at(0)?.delegate.id.toLowerCase() || account.toLowerCase())
      .reduce((p: Record<string, number>, address: string) => {
        if (p[address] == null) {
          p[address] = 0
        }
        p[address] += 1
        return p
      }, {})
  }, [myNounlets, account])

  const leaderboardListData = useMemo(() => {
    if (data == null) return []
    const myAddress = account?.toLowerCase() || ''

    const mapped = data.map((acc) => {
      const accAddress = acc.id.toLowerCase()
      return {
        isMe: accAddress === myAddress,
        percentage: 0.69,
        walletAddress: acc.id.toLowerCase(),
        currentDelegateWalletAddress: ethers.constants.AddressZero,
        mostVotesWalletAddress: ethers.constants.AddressZero,
        numberOfOwnedNounlets: +acc.totalNounletsHeld,
        numberOfVotes: -1,
        numberOfMyVotes: myNounletsVotes[accAddress] ?? 0
      }
    })

    return mapped
  }, [data, account, myNounletsVotes])

  return {
    leaderboardListData,
    myNounlets,
    myNounletsVotes
  }
}
