import { useEthers } from '@usedapp/core'
import { getAllNounlets, getNounletAuctionData, getNounletAuctionDataBC } from 'graphql/src/queries'
import debounce from 'lodash/debounce'
import { useEffect } from 'react'
import useSdk, { NounletsSDK } from 'src/hooks/utils/useSdk'
import { useBlockNumberCheckpointStore } from 'src/store/blockNumberCheckpointStore.store'
import { useLeaderboardStore } from 'src/store/leaderboard.store'
import { useNounStore } from 'src/store/noun.store'
import { useNounletStore } from 'src/store/nounlet.store'
import useSWR, { useSWRConfig } from 'swr'

const tmpCache = new Map<string, any>()

export async function leaderboardDataFetcher(vaultAddress: string, sdk: NounletsSDK) {
  const response = await getAllNounlets(vaultAddress, sdk!.NounletAuction.address)
  console.log('leaderboard response', { response })

  return { leaderboard: response, fetchedAt: Date.now() }
}

export default function useLeaderboardData(callback?: (data: any) => void) {
  const { cache, mutate: globalMutate } = useSWRConfig()
  const sdk = useSdk()
  const { account, library } = useEthers()
  const { leaderboardBlockNumber, setLeaderboardBlockNumber } = useBlockNumberCheckpointStore()
  const {
    isLive,
    isLoading: isLoadingNoun,
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
  const { isLoading, setIsLoading, setLeaderboardData } = useLeaderboardStore()

  let keySWR = null
  if (isLive && !isLoadingNoun && nounTokenId) {
    keySWR = `noun/${nounTokenId}/leaderboard`
  }

  const cachedData: Awaited<ReturnType<typeof leaderboardDataFetcher>>['leaderboard'] | null =
    tmpCache.get(keySWR || '--empty')

  const shouldRevalidate = cachedData == null

  let refreshInterval = 0
  if (shouldRevalidate) {
    refreshInterval = 60_000
  }

  useEffect(() => {
    if (cachedData == null) {
      setIsLoading(true)
      setLeaderboardData(null)
    } else {
      console.log('Leaderboard data cached', cachedData)
      setLeaderboardData(cachedData)
      setIsLoading(false)
    }
  }, [cachedData])

  useSWR(
    keySWR && `noun/${nounTokenId}/leaderboard/delegate`,
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
    if (!isLive || sdk == null) return

    // TODO Maybe be more specific with the events?
    console.log('🍉 listen to any event on NounletToken', vaultAddress, nounletTokenAddress)
    const nounletToken = sdk.NounletToken.attach(nounletTokenAddress)
    const nounletAuction = sdk.NounletAuction
    const nounletGovernance = sdk.NounletGovernance

    const debouncedMutate = debounce(() => {
      globalMutate(`noun/${nounTokenId}/leaderboard`).then()
      globalMutate(`noun/${nounTokenId}/leaderboard/delegate`).then()
    }, 1000)

    const listener = (...eventData: any) => {
      const event = eventData.at(-1)
      // console.groupCollapsed('🍉🍉🍉 any event', event?.blockNumber, eventData)
      // console.log('event data', event)
      // console.groupEnd()

      setLeaderboardBlockNumber(event?.blockNumber || 0)
      debouncedMutate()
    }

    nounletToken.on(nounletToken, listener)
    nounletAuction.on(nounletAuction, listener)
    nounletGovernance.on(nounletGovernance, listener)

    return () => {
      console.log('🍉 stop listening to any event on NounletToken')
      nounletToken.off(nounletToken, listener)
      nounletAuction.off(nounletAuction, listener)
      nounletGovernance.off(nounletGovernance, listener)
    }
  }, [isLive, sdk, vaultAddress, nounletTokenAddress, setLeaderboardBlockNumber])

  const { data, mutate } = useSWR(
    cachedData == null && keySWR,
    async () => leaderboardDataFetcher(vaultAddress, sdk!),
    {
      dedupingInterval: 0,
      refreshInterval: (latestData) => {
        if (latestData?.leaderboard == null) return 15000
        if (latestData.leaderboard._meta!.block.number < leaderboardBlockNumber) {
          console.log(
            '🐌 Leaderboard is outdated',
            latestData.leaderboard._meta!.block.number,
            leaderboardBlockNumber
          )
          return 15000
        }

        return 0
      },
      revalidateIfStale: shouldRevalidate,
      onSuccess(data, key) {
        if (data?.leaderboard == null) {
          console.log('data null? mutate')
          setTimeout(() => {
            mutate().then()
          }, 15000)
          return
        }

        setCurrentDelegate(data.leaderboard.currentDelegate)
        setIsCurrentDelegateOutOfSyncOnVaultContract(
          data.leaderboard.mostVotesAddress !== data.leaderboard.currentDelegate
        )

        if (data.leaderboard._meta!.block.number > leaderboardBlockNumber) {
          console.log(data.leaderboard._meta!.block.number, leaderboardBlockNumber)
          setLeaderboardBlockNumber(data.leaderboard._meta!.block.number)
        }

        setLeaderboardData(data.leaderboard)
        setIsLoading(false)

        // if (data?.auction?.settled) {
        //   console.log('✨ setting cache', data)
        //   // cache.set(key, data)
        //   tmpCache.set(key, data)
        // }

        if (callback) {
          callback(data)
        }
      },
      onError(err, key, config) {
        console.log('Leaderboard error', err)
        //debugger
      }
    }
  )
}
