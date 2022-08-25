import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import { getLeaderboardData } from 'lib/graphql/queries'
import txWithErrorHandling from 'lib/utils/tx-with-error-handling'
import { useMemo } from 'react'
import { useBlockCheckpointStore } from 'store/blockCheckpoint'
import { useVaultStore } from 'store/vaultStore'
import useSWR from 'swr'
import useSdk from './useSdk'

export default function useLeaderboard() {
  const { account, library } = useEthers()
  const { leaderboardBlockNumber, setLeaderboardBlockNumber } = useBlockCheckpointStore()
  const { isLive, vaultAddress, nounTokenId, nounletTokenAddress } = useVaultStore()
  const sdk = useSdk()

  const canFetchLeaderboard = useMemo(() => {
    return isLive && sdk != null && nounTokenId !== ''
  }, [isLive, sdk, nounTokenId])

  const { data, mutate } = useSWR(
    canFetchLeaderboard && { name: 'Leaderboard' },
    async (key) => {
      console.log('🌽🌽🌽🌽🌽 Fetching new leaderboard data')
      const [leaderboardData, currentDelegate] = await Promise.all([
        getLeaderboardData(nounTokenId),
        sdk!.NounletGovernance.currentDelegate(vaultAddress)
      ])

      console.groupCollapsed('🌽🌽🌽🌽🌽 Fetched new leaderboard data')
      console.log({ currentDelegate, leaderboardData })
      console.groupEnd()
      return {
        ...leaderboardData,
        currentDelegate
      }
    },
    {
      revalidateIfStale: false,
      refreshInterval: (latestData) => {
        if (latestData == null) return 15000
        if (latestData._meta.block.number < leaderboardBlockNumber) {
          console.log(
            '🍆🍆🍆🍆🍆🍆 Leaderboard is behind',
            latestData._meta.block.number,
            'vs',
            leaderboardBlockNumber
          )
          return 15000
        }

        // console.log('🌽🌽🌽🌽🌽 Leaderboard is in sync. Dont update until events')
        return 0
      },
      onSuccess: (data, key, config) => {
        if (data == null || leaderboardBlockNumber === 0) {
          setTimeout(() => {
            console.log('🌽🌽🌽', 'First load or data null, forced mutate', '🌽🌽🌽')
            mutate()
          }, 15000)
        }
        if (data._meta.block.number > leaderboardBlockNumber) {
          console.log('🌽🌽🌽🌽🌽', 'block number is higher on BE. Update it!')
          setLeaderboardBlockNumber(data._meta.block.number)
        }
      },
      onError(err, key, config) {
        console.log('error?', err)
        debugger
      }
    }
  )

  // const {} = useSWR('Leaderboard', () => {

  // }, {
  //   revalidateIfStale: false
  // })

  const myNounlets = useMemo(() => {
    if (account == null) return []
    if (data == null) return []

    const myAccount = data.accounts.find((acc) => {
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

    const mapped = data.accounts.map((acc) => {
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

  const claimDelegate = async (toAddress: string) => {
    console.log('update delegate', vaultAddress, toAddress)
    if (sdk == null || account == null || library == null) throw new Error('No signer')
    if (nounletTokenAddress == '') throw new Error('No nounlet token address')

    const nounletGovernance = sdk.NounletGovernance.connect(library.getSigner())
    const tx = await nounletGovernance.claimDelegate(vaultAddress, toAddress)
    return txWithErrorHandling(tx)
  }

  const delegateVotes = async (toAddress: string) => {
    console.log('delegating votes to:', toAddress)
    if (sdk == null || account == null || library == null) throw new Error('No signer')
    if (nounletTokenAddress == '') throw new Error('No nounlet token address')

    const nounletToken = sdk.NounletToken.connect(library.getSigner()).attach(nounletTokenAddress)
    const tx = await nounletToken.delegate(toAddress)
    return txWithErrorHandling(tx)
  }

  return {
    data,
    mutate,
    leaderboardListData,
    myNounlets,
    myNounletsVotes,
    delegateVotes,
    claimDelegate
    // mutateLeaderboard
  }
}
