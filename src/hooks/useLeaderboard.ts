import { useEthers } from '@usedapp/core'
import { ethers, FixedNumber } from 'ethers'
import { getAllNounlets } from 'graphql/src/queries'
import txWithErrorHandling from 'src/lib/utils/txWithErrorHandling'
import { useEffect, useMemo } from 'react'
import { useBlockNumberCheckpointStore } from 'src/store/blockNumberCheckpointStore.store'
import { useLeaderboardStore } from 'src/store/leaderboard.store'
import { useNounStore } from 'src/store/noun.store'
import useSWR from 'swr'
import useSdk from './utils/useSdk'

export default function useLeaderboard() {
  const sdk = useSdk()
  const { account, library } = useEthers()
  const { leaderboardBlockNumber, setLeaderboardBlockNumber } = useBlockNumberCheckpointStore()
  const {
    isLive,
    vaultAddress,
    nounTokenId,
    nounletTokenAddress,
    currentDelegate,
    currentNounDelegate,
    setIsCurrentDelegateOutOfSyncOnVaultContract,
    setIsCurrentDelegateOutOfSyncOnNounContract,
    setCurrentDelegate,
    setCurrentNounDelegate
  } = useNounStore()
  const { leaderboardData: data } = useLeaderboardStore()

  // const canFetchLeaderboard = useMemo(() => {
  //   return isLive && sdk != null && nounTokenId !== ''
  // }, [isLive, sdk, nounTokenId])

  const { mutate: delegateMutate } = useSWR(
    library && sdk && 'currentNounDelegate',
    async () => {
      if (!sdk || !library) return
      return sdk.NounsToken.delegates(vaultAddress)
    },
    {
      onSuccess: (delegate) => {
        if (!delegate) return
        setCurrentNounDelegate(delegate.toLowerCase())
      },
      onError: (_) => {
        console.log('Delegate error', _)
      }
    }
  )

  useEffect(() => {
    setIsCurrentDelegateOutOfSyncOnNounContract(
      currentNounDelegate.toLowerCase() !== currentDelegate.toLowerCase()
    )
  }, [currentDelegate, currentNounDelegate, setIsCurrentDelegateOutOfSyncOnNounContract])

  // const { data, mutate } = useSWR(
  //   canFetchLeaderboard && { name: 'Leaderboard' },
  //   async (key) => {
  //     // console.log('🌽🌽🌽🌽🌽 Fetching new leaderboard data')
  //     const leaderboardData = await getAllNounlets(vaultAddress, sdk!.NounletAuction.address)
  //     // console.groupCollapsed('🌽🌽🌽🌽🌽 Fetched new leaderboard data')
  //     // console.log({ leaderboardData })
  //     // console.groupEnd()
  //
  //     return leaderboardData
  //   },
  //   {
  //     revalidateIfStale: false,
  //     refreshInterval: (latestData) => {
  //       if (latestData == null) return 15000
  //       if (latestData._meta!.block.number < leaderboardBlockNumber) {
  //         // console.log(
  //         //   '🐌 Leaderboard is outdated',
  //         //   latestData._meta.block.number,
  //         //   leaderboardBlockNumber
  //         // )
  //         return 15000
  //       }
  //
  //       return 0
  //     },
  //     onSuccess: (data) => {
  //       if (data == null) {
  //         setTimeout(() => {
  //           mutate()
  //         }, 15000)
  //         return
  //       }
  //
  //       setCurrentDelegate(data.currentDelegate)
  //       setIsCurrentDelegateOutOfSyncOnVaultContract(data.mostVotesAddress !== data.currentDelegate)
  //
  //       if (data._meta!.block.number > leaderboardBlockNumber) {
  //         setLeaderboardBlockNumber(data._meta!.block.number)
  //         return
  //       }
  //
  //       if (leaderboardBlockNumber === 0) {
  //         setTimeout(() => {
  //           mutate()
  //         }, 15000)
  //         return
  //       }
  //     },
  //     onError(err, key, config) {
  //       console.log('Leaderboard error', err)
  //       //debugger
  //     }
  //   }
  // )

  const isOutOfSync = useMemo(() => {
    return (data?._meta!.block.number || 0) < leaderboardBlockNumber
  }, [data, leaderboardBlockNumber])

  const leaderboardData = useMemo(() => {
    const formattedData = constructLeaderboardData(data!, account)
    return formattedData
  }, [data, account])

  const myNounlets = useMemo(() => {
    return leaderboardData.myNounlets
  }, [leaderboardData])

  const myNounletsVotes = useMemo(() => {
    return leaderboardData.myVotes
  }, [leaderboardData])

  const mostVotesAcc = useMemo(() => {
    return {
      address: leaderboardData.mostVotesAddress,
      votes: leaderboardData.mostVotes
    }
  }, [leaderboardData])

  const claimVaultDelegate = async (toAddress: string) => {
    if (sdk == null || account == null || library == null) throw new Error('No signer')
    if (nounletTokenAddress == '') throw new Error('No nounlet token address')
    const nounletGovernance = sdk.NounletGovernance.connect(library.getSigner())
    const gasLimitClaimDelegate = await nounletGovernance.estimateGas.claimDelegate(
      vaultAddress,
      toAddress
    )
    const txClaimDelegate = await nounletGovernance.claimDelegate(vaultAddress, toAddress, {
      gasLimit: gasLimitClaimDelegate.mul(13).div(10)
    })
    return await txWithErrorHandling(txClaimDelegate)
  }

  const claimNounsDelegate = async (toAddress: string) => {
    if (sdk == null || account == null || library == null) throw new Error('No signer')
    if (nounletTokenAddress == '') throw new Error('No nounlet token address')
    const nounletGovernance = sdk.NounletGovernance.connect(library.getSigner())
    const merkleTree = await sdk.NounletProtoform.generateMerkleTree([
      sdk.NounletAuction.address,
      sdk.NounletGovernance.address,
      sdk.OptimisticBid.address
    ])
    const delegateProof = await sdk.NounletProtoform.getProof(merkleTree, 5)
    const gasLimitDelegate = await nounletGovernance.estimateGas.delegate(
      vaultAddress,
      toAddress,
      delegateProof
    )
    const txDelegate = await nounletGovernance.delegate(vaultAddress, toAddress, delegateProof, {
      gasLimit: gasLimitDelegate.mul(13).div(10)
    })
    return txWithErrorHandling(txDelegate)
  }

  const delegateVotes = async (toAddress: string) => {
    if (sdk == null || account == null || library == null) throw new Error('No signer')
    if (nounletTokenAddress == '') throw new Error('No nounlet token address')

    const nounletToken = sdk.NounletToken.connect(library.getSigner()).attach(nounletTokenAddress)
    const tx = await nounletToken.delegate(toAddress)
    return txWithErrorHandling(tx)
  }

  return {
    isOutOfSync,
    data,
    myNounlets,
    myNounletsVotes,
    mostVotesAcc,
    leaderboardData,
    // mutate,
    delegateMutate,
    delegateVotes,
    claimVaultDelegate,
    claimNounsDelegate
  }
}

export interface LeaderboardListTileData {
  isMe: boolean
  isDelegate: boolean
  isDelegateCandidate: boolean
  walletAddress: string
  percentage: number
  numberOfOwnedNounlets: number
  numberOfVotes: number
  numberOfMyVotes: number
  canIVote: boolean
}

interface ConstructLeaderboardData {
  totalVotes: number
  currentDelegate: string
  currentDelegateVotes: number
  mostVotes: number
  mostVotesAddress: string
  myNounlets: { id: string; delegate: string }[]
  myVotes: Record<string, number>
  areMyVotesSplit: boolean
  list: LeaderboardListTileData[]
}

export const constructLeaderboardData = (
  data?: Awaited<ReturnType<typeof getAllNounlets>>,
  account?: string
) => {
  const leaderboardData: ConstructLeaderboardData = {
    totalVotes: 0,
    currentDelegate: ethers.constants.AddressZero,
    currentDelegateVotes: 0,
    mostVotes: 0,
    mostVotesAddress: ethers.constants.AddressZero,
    myNounlets: new Array(),
    myVotes: {},
    areMyVotesSplit: false,
    list: new Array()
  }

  if (data == null) return leaderboardData

  const myAddress = account?.toLowerCase() || ''
  const totalVotes = data.totalVotes
  const currentDelegateVotesCount = data.accounts[data.currentDelegate.toLowerCase()]?.votes || 0

  if (myAddress !== '') {
    const myNounlets = data.accounts[myAddress]?.holding || []
    const myVotes: Record<string, number> = {}

    myNounlets.forEach((nounlet) => {
      if (myVotes[nounlet.delegate] == null) {
        myVotes[nounlet.delegate] = 0
      }
      myVotes[nounlet.delegate] += 1
    })

    leaderboardData.myNounlets = myNounlets
    leaderboardData.myVotes = myVotes
    leaderboardData.areMyVotesSplit = Object.keys(myVotes).length > 1
  }

  leaderboardData.totalVotes = data.totalVotes
  leaderboardData.currentDelegate = data.currentDelegate.toLowerCase()
  leaderboardData.currentDelegateVotes = data.accounts[leaderboardData.currentDelegate]?.votes || 0

  let wasDelegateFound = false
  const mapped = Object.entries(data.accounts)
    .map(([address, acc]) => {
      const accVotes = +acc.votes
      const accAddress = address.toLowerCase()
      let percentage = 0.0
      if (data.totalVotes > 0 && accVotes > 0) {
        percentage = FixedNumber.from(accVotes)
          .divUnsafe(FixedNumber.from(totalVotes))
          .round(2)
          .toUnsafeFloat()
      }
      // const canIVote =
      //   leaderboardData.myNounlets.length > 0 &&
      //   (leaderboardData.areMyVotesSplit || leaderboardData.myNounlets[0]?.delegate !== accAddress)
      const canIVote = true // Sigh ...
      const isDelegate = address.toLowerCase() === leaderboardData.currentDelegate
      if (isDelegate) {
        wasDelegateFound = true
      }
      return {
        isMe: accAddress === myAddress,
        isDelegate,
        isDelegateCandidate: false,
        walletAddress: address.toLowerCase(),
        percentage,
        numberOfOwnedNounlets: +acc.holding.length,
        numberOfVotes: accVotes,
        numberOfMyVotes: leaderboardData.myVotes[accAddress] ?? 0,
        canIVote
      }
    })
    // Filter out accounts with no votes
    // .filter((acc) => {
    //   if (filterText != null && filterText.trim() != '') {
    //     console.log({ filterText })
    //     return acc.walletAddress.toLowerCase().includes(filterText.toLowerCase())
    //   }

    //   if (acc.isMe) return true
    //   if (acc.isDelegate) return true
    //   if (acc.numberOfVotes === 0) return false
    //   return true
    // })
    .sort((a, b) => b.numberOfVotes - a.numberOfVotes)

  // Delegate was not found, so we insert it manually
  if (!wasDelegateFound && data.currentDelegate !== ethers.constants.AddressZero) {
    mapped.push({
      isMe: data.currentDelegate.toLowerCase() === myAddress,
      isDelegate: true,
      isDelegateCandidate: false,
      walletAddress: data.currentDelegate.toLowerCase(),
      percentage: 0,
      numberOfOwnedNounlets: 0,
      numberOfVotes: 0,
      numberOfMyVotes: 0,
      canIVote: leaderboardData.myNounlets.length > 0
    })
  }

  // Find curator candidate by taking the most votes account
  // and checking if it has more votes than the current delegate
  // (and is not the current delegate)
  const mostVotesAcc = mapped[0]
  if (mostVotesAcc != null) {
    leaderboardData.mostVotes = mostVotesAcc.numberOfVotes
    leaderboardData.mostVotesAddress = mostVotesAcc.walletAddress
    if (!mostVotesAcc.isDelegate) {
      if (mostVotesAcc.numberOfVotes > currentDelegateVotesCount) {
        mostVotesAcc.isDelegateCandidate = true
      }
    }
  }

  leaderboardData.list = mapped
  return leaderboardData
}
