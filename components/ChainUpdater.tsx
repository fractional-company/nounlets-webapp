import { useEthers } from '@usedapp/core'
import Button from 'components/buttons/button'
import { NEXT_PUBLIC_MAX_NOUNLETS, NEXT_PUBLIC_SHOW_DEBUG } from 'config'
import { BigNumber } from 'ethers'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import useLeaderboard from 'hooks/useLeaderboard'
import useSdk from 'hooks/useSdk'
import { getVaultData } from 'lib/graphql/queries'
import { getBuyoutBidInfo } from 'lib/utils/buyoutInfoUtils'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useBlockNumberCheckpointStore } from 'store/blockNumberCheckpointStore'
import { BuyoutInfo, BuyoutState, useBuyoutStore } from 'store/buyout/buyout.store'
import { useVaultStore } from 'store/vaultStore'
import useSWR, { useSWRConfig } from 'swr'
import IconBug from './icons/icon-bug'
import OnMounted from './utils/on-mounted'

export default function ChainUpdater() {
  return (
    <>
      <OnMounted>{NEXT_PUBLIC_SHOW_DEBUG && <LittleBug />}</OnMounted>
      <VaultUpdater />
      <LeaderboardUpdater />
      <BuyoutUpdater />
    </>
  )
}

function LittleBug() {
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const {
    isLive,
    isLoading,
    vaultAddress,
    nounTokenId,
    nounletTokenAddress,
    currentDelegate,
    backendLatestNounletTokenId,
    latestNounletTokenId
  } = useVaultStore()

  const { nid, auctionInfo } = useDisplayedNounlet()
  const { isOutOfSync, leaderboardData } = useLeaderboard()
  const { buyoutInfo } = useBuyoutStore()

  const vaultMetadata = {
    isLive,
    isLoading,
    vaultAddress, // VaultContract
    nounletTokenAddress, // NouneltTokenContract (proxy?)
    nounTokenId,
    backendLatestNounletTokenId,
    latestNounletTokenId,
    currentDelegate
  }

  const leaderboard = {
    isOutOfSync,
    ...leaderboardData
  }

  const testSentry = () => {
    console.error('Testing sentry 1')
    try {
      throw new Error('Testing Sentry 2')
    } catch (error) {
      console.error('Testing Sentry 2', error)
    }
    throw new Error('Testing Sentry 3')
  }

  const buyoutInfoTruncated = { ...buyoutInfo, fixedNumber: undefined }
  const display = { nid, vaultMetadata, buyoutInfo: buyoutInfoTruncated, auctionInfo, leaderboard }

  return (
    <>
      {NEXT_PUBLIC_SHOW_DEBUG && (
        <>
          <div
            className="absolute z-50 cursor-pointer p-1"
            onClick={() => setShowDebugInfo(!showDebugInfo)}
          >
            <IconBug className={showDebugInfo ? 'animate-spin' : ''} />
          </div>
          {showDebugInfo && (
            <div className="overflow-hidden p-1 pt-8 text-px14 bg-secondary-red/25">
              <Button className="basic" onClick={testSentry}>
                Test Sentry Error
              </Button>
              <pre>{JSON.stringify(display, null, 4)}</pre>
            </div>
          )}
        </>
      )}
    </>
  )
}

function VaultUpdater() {
  const { cache, mutate: globalMutate } = useSWRConfig()
  const router = useRouter()
  const sdk = useSdk()
  const {
    isLive,
    isLoading,
    nounletTokenAddress,
    vaultAddress,
    latestNounletTokenId,
    setIsLive,
    setIsLoading,
    setWereAllNounletsAuctioned,
    setVaultCuratorAddress,
    setNounTokenId,
    setCurrentDelegate,
    setNounletTokenAddress,
    setBackendLatestNounletTokenId,
    setLatestNounletTokenId
  } = useVaultStore()

  const { mutate } = useSWR(
    router.isReady &&
      sdk != null && {
        name: 'VaultMetadata',
        vaultAddress: vaultAddress
      },
    async (key) => {
      if (sdk == null) throw new Error('sdk not initialized')
      // console.groupCollapsed('🏳️ fetching vault metadata ...')
      // console.log({ ...key })
      // console.groupEnd()

      const [vaultMetadata, vaultInfo /*, currentDelegate*/] = await Promise.all([
        getVaultData(key.vaultAddress),
        sdk.NounletAuction.vaultInfo(vaultAddress)
      ])

      const tmp = {
        ...vaultInfo
      }
      if (+tmp.currentId.toString() >= NEXT_PUBLIC_MAX_NOUNLETS) {
        tmp.currentId = BigNumber.from(NEXT_PUBLIC_MAX_NOUNLETS)
      }

      return {
        ...vaultMetadata,
        ...tmp
        // currentDelegate
      }
    },
    {
      dedupingInterval: 5000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.status === 404) return
        if (error.message === 'vault not found') {
          console.log('🐉 Checking for vault again in 30 seconds 🐉')
          setTimeout(() => revalidate({ retryCount }), 30000)
          return
        }
        if (retryCount >= 3) return

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000)
      },
      onSuccess: (data, key, config) => {
        console.groupCollapsed('🏴 fetched vault metadata ...')
        console.table(data)
        console.groupEnd()

        if (data.isLive) {
          setNounletTokenAddress(data.nounletTokenAddress)
          setNounTokenId(data.nounTokenId)
          setVaultCuratorAddress(data.curator)
          setCurrentDelegate(data.backendCurrentDelegate)
          setBackendLatestNounletTokenId(`${data.nounletCount}`)
          setLatestNounletTokenId(`${data.currentId.toString()}`)
          setWereAllNounletsAuctioned(data.wereAllNounletsAuctioned)
          setIsLive(true)
          setIsLoading(false)
        } else {
          console.log('Server returned null')
          // Retry after 15 seconds.
          setTimeout(() => mutate(), 15000)
        }
      },
      refreshInterval: 5 * 60000
    }
  )

  // const debouncedMutate = useMemo(() => debounce(mutate, 1000), [mutate])

  // useEffect(() => {
  //   if (sdk == null) return
  //   if (!isLive) return

  //   console.log('🍁 setting SETTLED listener for ', latestNounletTokenId)
  //   const nounletAuction = sdk.NounletAuction
  //   const settledFilter = sdk.NounletAuction.filters.Settled(
  //     vaultAddress,
  //     nounletTokenAddress
  //     // latestNounletTokenId
  //   )

  //   const listener = (...eventData: any) => {
  //     const event = eventData.at(-1)
  //     console.log('🍁🍁🍁 Settled event', eventData)
  //     console.log('event data', event)
  //     debouncedMutate()
  //   }

  //   // nounletAuction.on(settledFilter, listener)

  //   return () => {
  //     console.log('🍁 removing SETTLED listener for ', latestNounletTokenId)
  //     nounletAuction.off(settledFilter, listener)
  //   }
  // }, [isLive, vaultAddress, nounletTokenAddress, latestNounletTokenId, sdk, debouncedMutate])

  // const lala = () => {
  //   globalMutate(
  //     unstable_serialize({
  //       name: 'VaultMetadata',
  //       vaultAddress: vaultAddress
  //     })
  //   )
  // }
  return <></>
}

function LeaderboardUpdater() {
  const sdk = useSdk()
  const { isLive, vaultAddress, nounletTokenAddress } = useVaultStore()
  const { setLeaderboardBlockNumber } = useBlockNumberCheckpointStore()
  const { mutate, delegateMutate } = useLeaderboard()

  const debouncedMutate = useMemo(() => {
    return debounce(() => {
      mutate()
      delegateMutate()
    }, 1000)
  }, [mutate, delegateMutate])

  useEffect(() => {
    if (!isLive || sdk == null) return

    // TODO Maybe be more specific with the events?
    // console.log('🍉 listen to any event on NounletToken', vaultAddress, nounletTokenAddress)
    const nounletToken = sdk.NounletToken.attach(nounletTokenAddress)
    const nounletAuction = sdk.NounletAuction
    const nounletGovernance = sdk.NounletGovernance

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
      // console.log('🍉 stop listening to any event on NounletToken')
      nounletToken.off(nounletToken, listener)
      nounletAuction.off(nounletAuction, listener)
      nounletGovernance.off(nounletGovernance, listener)
    }
  }, [isLive, sdk, vaultAddress, nounletTokenAddress, debouncedMutate, setLeaderboardBlockNumber])

  return (
    <>
      {/* <Button
        className="primary"
        onClick={() => {
          mutate()
        }}
      >
        Update leaderboard
      </Button> */}
    </>
  )
}

function BuyoutUpdater() {
  const { cache } = useSWRConfig()
  const sdk = useSdk()
  const { isLive, wereAllNounletsAuctioned, vaultAddress, nounletTokenAddress, nounTokenId } =
    useVaultStore()
  const { setIsLoading, setBuyoutInfo } = useBuyoutStore()
  const { library } = useEthers()

  const cachedData: BuyoutInfo | null = cache.get('VaultBuyout') || null

  const refreshInterval = useMemo(() => {
    if (cachedData === null) return 1 * 60 * 1000
    if (cachedData.state === BuyoutState.SUCCESS) return 0

    return 1 * 60 * 1000
  }, [cachedData])

  const { mutate } = useSWR(
    isLive && wereAllNounletsAuctioned && sdk != null && 'VaultBuyout',
    async (key) => getBuyoutBidInfo(sdk!, vaultAddress, nounletTokenAddress, nounTokenId),
    {
      dedupingInterval: 5000,
      refreshInterval: refreshInterval,
      onSuccess: (data, key, config) => {
        // console.group('🤑 fetched vault buyout ...')
        // console.log({ data })
        // console.groupEnd()
        setBuyoutInfo(data)
        setIsLoading(false)
      }
    }
  )

  const debouncedMutate = useMemo(() => debounce(mutate, 1000), [mutate])

  useEffect(() => {
    if (sdk == null) return
    if (!isLive) return

    const optimisticBid = sdk.OptimisticBid

    const listener = (...eventData: any) => {
      const event = eventData.at(-1)
      // console.log('Optimistic event', event, eventData)
      debouncedMutate()
    }

    optimisticBid.on(optimisticBid, listener)

    return () => {
      optimisticBid.off(optimisticBid, listener)
    }
  }, [isLive, vaultAddress, sdk, debouncedMutate])

  return <></>
}
