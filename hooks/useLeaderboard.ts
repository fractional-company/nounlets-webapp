import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import { getLeaderboardData } from 'lib/graphql/queries'
import { useMemo } from 'react'
import { useVaultStore } from 'store/vaultStore'
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
  } = useVaultStore()
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

  const delegateVotes = async (toAddress: string) => {
    const primary = '0x497F34f8A6EaB10652f846fD82201938e58d72E0'
    const secondary = '0x6d2343bEecEd0E805f3ccCfF870ccB974B5795E6'

    console.log('delegating votes to:', toAddress)
    if (sdk == null || account == null || library == null) return
    if (nounletTokenAddress == null) return
    try {
      const nounletToken = sdk.NounletToken.connect(library.getSigner()).attach(nounletTokenAddress)
      // console.log(await nounletToken.NOUNS_TOKEN_ID())

      // console.log(await nounletToken.balanceOf(account, 4))
      // console.log(await nounletToken.maxSupply())
      // console.log(await nounletToken.ownerOf(4)) // NounletAuction contract
      // console.log(await nounletToken.votesToDelegate(account))
      // console.log(await nounletToken.delegates(account))
      // console.log(await nounletToken.getCurrentVotes(account))

      // console.log(await nounletToken.balanceOf(secondary, 4))
      // console.log(await nounletToken.votesToDelegate(secondary))
      // console.log(await nounletToken.delegates(secondary))
      // console.log(await nounletToken.getCurrentVotes(secondary))
      // console.log(await nounletToken.numCheckpoints(secondary))

      const tx = await nounletToken.delegate(primary)
      console.log(await tx.wait())
    } catch (error) {
      console.log('error', error)
    }
  }

  return {
    leaderboardListData,
    myNounlets,
    myNounletsVotes,
    delegateVotes
  }
}
