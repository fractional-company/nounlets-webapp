import { useEthers } from '@usedapp/core'
import { ethers, FixedNumber } from 'ethers'
import { getAllNounlets } from 'lib/graphql/queries'
import txWithErrorHandling from 'lib/utils/tx-with-error-handling'
import { useEffect, useMemo } from 'react'
import { useBlockNumberCheckpointStore } from 'store/blockNumberCheckpointStore'
import { useVaultStore } from 'store/vaultStore'
import useSWR from 'swr'
import useSdk from './useSdk'

export default function useLeaderboard() {
  const sdk = useSdk()
  const { account, library } = useEthers()
  const { leaderboardBlockNumber, setLeaderboardBlockNumber } = useBlockNumberCheckpointStore()
  const {
    isLive,
    vaultAddress,
    nounTokenId,
    nounletTokenAddress,
    setIsCurrentDelegateOutOfSync,
    setCurrentDelegate
  } = useVaultStore()

  const canFetchLeaderboard = useMemo(() => {
    return isLive && sdk != null && nounTokenId !== ''
  }, [isLive, sdk, nounTokenId])

  const { data, mutate } = useSWR(
    canFetchLeaderboard && { name: 'Leaderboard' },
    async (key) => {
      console.log('🌽🌽🌽🌽🌽 Fetching new leaderboard data')
      const leaderboardData = await getAllNounlets(vaultAddress)
      // const [leaderboardData, currentDelegate] = await Promise.all([
      //   getAllNounlets(vaultAddress),
      //   sdk!.NounletGovernance.currentDelegate(vaultAddress)
      // ])

      console.groupCollapsed('🌽🌽🌽🌽🌽 Fetched new leaderboard data')
      console.log({ leaderboardData })
      console.groupEnd()

      return {
        ...leaderboardData
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

        return 0
      },
      onSuccess: (data, key, config) => {
        if (data == null) {
          setTimeout(() => {
            console.log('🌽🌽🌽', 'Data null, forced mutate', '🌽🌽🌽')
            mutate()
          }, 15000)
          return
        }

        setCurrentDelegate(data.currentDelegate)

        console.log('🌽🌽🌽🌽🌽🌽🌽🌽🌽 delegate out of sync', !data.doesDelegateHaveMostVotes)
        setIsCurrentDelegateOutOfSync(!data.doesDelegateHaveMostVotes)

        if (data._meta.block.number > leaderboardBlockNumber) {
          console.log('🌽🌽🌽🌽🌽', 'block number is higher on BE. Update it!')
          setLeaderboardBlockNumber(data._meta.block.number)
          return
        }

        if (leaderboardBlockNumber === 0) {
          setTimeout(() => {
            console.log('🌽🌽🌽', 'First load, forced mutate', '🌽🌽🌽')
            mutate()
          }, 15000)
          return
        }
      },
      onError(err, key, config) {
        console.log('Leaderboard error', err)
        //debugger
      }
    }
  )

  const isOutOfSync = useMemo(() => {
    return (data?._meta.block.number || 0) < leaderboardBlockNumber
  }, [data, leaderboardBlockNumber])

  const myNounlets = useMemo(() => {
    if (account == null) return []
    if (data == null) return []

    const myAccount = data.accounts[account.toLowerCase()]
    return myAccount?.holding || []
  }, [data, account])

  const myNounletsVotes = useMemo(() => {
    if (account == null) return {}
    const votesFor: Record<string, number> = {}

    myNounlets.forEach((nounlet) => {
      if (votesFor[nounlet.delegate] == null) {
        votesFor[nounlet.delegate] = 0
      }

      votesFor[nounlet.delegate] += 1
    })

    return votesFor
  }, [myNounlets, account])

  // const leaderboardListData = useMemo(() => {
  //   if (data == null) return []
  //   const myAddress = account?.toLowerCase() || ''

  //   const totalVotes = data.totalVotes
  //   const delegateVotes = data.accounts[data.currentDelegate.toLowerCase()]?.votes || 0
  //   let wasDelegateFound = false
  //   const mapped = Object.entries(data.accounts)
  //     .map(([address, acc]) => {
  //       const accVotes = +acc.votes
  //       const accAddress = address.toLowerCase()
  //       let percentage = 0.0
  //       if (totalVotes > 0 && accVotes > 0) {
  //         percentage = FixedNumber.from(accVotes)
  //           .divUnsafe(FixedNumber.from(totalVotes))
  //           .round(2)
  //           .toUnsafeFloat()
  //       }
  //       const isDelegate = address.toLowerCase() === data.currentDelegate.toLowerCase()
  //       if (isDelegate) {
  //         wasDelegateFound = true
  //       }
  //       return {
  //         isMe: accAddress === myAddress,
  //         isDelegate,
  //         hasMoreVotesThanDelegate: accVotes > delegateVotes,
  //         walletAddress: address.toLowerCase(),
  //         percentage,
  //         currentDelegateWalletAddress: data.currentDelegate,
  //         mostVotesWalletAddress: ethers.constants.AddressZero,
  //         numberOfOwnedNounlets: +acc.holding.length,
  //         numberOfVotes: accVotes,
  //         numberOfMyVotes: myNounletsVotes[accAddress] ?? 0
  //       }
  //     })
  //     // Filter out accounts with no votes
  //     .filter((acc) => {
  //       if (acc.isMe) return true
  //       if (acc.isDelegate) return true
  //       if (acc.numberOfVotes === 0) return false
  //       return true
  //     })
  //     .sort((a, b) => b.numberOfVotes - a.numberOfVotes)

  //   // Delegate was not found, so we insert it manually
  //   if (!wasDelegateFound) {
  //     mapped.push({
  //       isMe: data.currentDelegate.toLowerCase() === myAddress,
  //       isDelegate: true,
  //       hasMoreVotesThanDelegate: false,
  //       walletAddress: data.currentDelegate.toLowerCase(),
  //       percentage: 0,
  //       currentDelegateWalletAddress: data.currentDelegate,
  //       mostVotesWalletAddress: ethers.constants.AddressZero,
  //       numberOfOwnedNounlets: 0,
  //       numberOfVotes: 0,
  //       numberOfMyVotes: 0
  //     })
  //   }

  //   return mapped
  // }, [data, account, myNounletsVotes])

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
    isOutOfSync,
    data,
    mutate,
    // leaderboardListData,
    myNounlets,
    myNounletsVotes,
    delegateVotes,
    claimDelegate
    // mutateLeaderboard
  }
}

export const constructLeaderboardListData = (
  data: ReturnType<typeof useLeaderboard>['data'],
  myNounletsVotes: ReturnType<typeof useLeaderboard>['myNounletsVotes'],
  account?: string,
  filterText?: string
) => {
  if (data == null) return []
  const myAddress = account?.toLowerCase() || ''

  const totalVotes = data.totalVotes
  const delegateVotes = data.accounts[data.currentDelegate.toLowerCase()]?.votes || 0
  let wasDelegateFound = false
  const mapped = Object.entries(data.accounts)
    .map(([address, acc]) => {
      const accVotes = +acc.votes
      const accAddress = address.toLowerCase()
      let percentage = 0.0
      if (totalVotes > 0 && accVotes > 0) {
        percentage = FixedNumber.from(accVotes)
          .divUnsafe(FixedNumber.from(totalVotes))
          .round(2)
          .toUnsafeFloat()
      }
      const isDelegate = address.toLowerCase() === data.currentDelegate.toLowerCase()
      if (isDelegate) {
        wasDelegateFound = true
      }
      return {
        isMe: accAddress === myAddress,
        isDelegate,
        hasMoreVotesThanDelegate: accVotes > delegateVotes,
        walletAddress: address.toLowerCase(),
        percentage,
        currentDelegateWalletAddress: data.currentDelegate,
        mostVotesWalletAddress: ethers.constants.AddressZero,
        numberOfOwnedNounlets: +acc.holding.length,
        numberOfVotes: accVotes,
        numberOfMyVotes: myNounletsVotes[accAddress] ?? 0
      }
    })
    // Filter out accounts with no votes
    .filter((acc) => {
      if (filterText != null && filterText.trim() != '') {
        console.log({ filterText })
        return acc.walletAddress.toLowerCase().includes(filterText.toLowerCase())
      }

      if (acc.isMe) return true
      if (acc.isDelegate) return true
      if (acc.numberOfVotes === 0) return false
      return true
    })
    .sort((a, b) => b.numberOfVotes - a.numberOfVotes)

  // Delegate was not found, so we insert it manually
  if (!wasDelegateFound) {
    mapped.push({
      isMe: data.currentDelegate.toLowerCase() === myAddress,
      isDelegate: true,
      hasMoreVotesThanDelegate: false,
      walletAddress: data.currentDelegate.toLowerCase(),
      percentage: 0,
      currentDelegateWalletAddress: data.currentDelegate,
      mostVotesWalletAddress: ethers.constants.AddressZero,
      numberOfOwnedNounlets: 0,
      numberOfVotes: 0,
      numberOfMyVotes: 0
    })
  }

  return mapped
}
