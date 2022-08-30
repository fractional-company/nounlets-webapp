import Button from 'components/buttons/button'
import { BigNumber } from 'ethers'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import useSdk from 'hooks/useSdk'
import { getVaultData } from 'lib/graphql/queries'
import { BidEvent } from 'lib/utils/types'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useVaultStore } from 'store/vaultStore'
import useSWR, { useSWRConfig } from 'swr'
import debounce from 'lodash/debounce'
import OnMounted from './utils/on-mounted'
import useLeaderboard from 'hooks/useLeaderboard'
import { useBlockNumberCheckpointStore } from 'store/blockNumberCheckpointStore'
import { SDKContext } from './WalletConfig'
import IconBug from './icons/icon-bug'
import { NEXT_PUBLIC_SHOW_DEBUG } from 'config'

export default function ChainUpdater() {
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const router = useRouter()
  const sdk = useContext(SDKContext)
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

  // url nid listener
  const { nid, auctionInfo } = useDisplayedNounlet()
  const { isOutOfSync, leaderboardData } = useLeaderboard()

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

  return (
    <>
      {NEXT_PUBLIC_SHOW_DEBUG && (
        <>
          <div
            className="absolute cursor-pointer p-1"
            onClick={() => setShowDebugInfo(!showDebugInfo)}
          >
            <IconBug className={showDebugInfo ? 'animate-spin' : ''} />
          </div>
          {showDebugInfo && (
            <div className="overflow-hidden p-1 pt-8 text-px14 bg-secondary-red/25">
              <pre>{JSON.stringify({ nid, vaultMetadata, auctionInfo, leaderboard }, null, 4)}</pre>
            </div>
          )}
        </>
      )}

      <VaultUpdater />
      <LeaderboardUpdater />
    </>
  )
}

function VaultUpdater() {
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
      console.groupCollapsed('🏳️ fetching vault metadata ...')
      console.log({ ...key })
      console.groupEnd()

      const [vaultMetadata, vaultInfo /*, currentDelegate*/] = await Promise.all([
        getVaultData(key.vaultAddress),
        sdk.NounletAuction.vaultInfo(vaultAddress)
        // sdk.NounletGovernance.currentDelegate(vaultAddress)
      ])

      return {
        ...vaultMetadata,
        ...vaultInfo
        // currentDelegate
      }
    },
    {
      dedupingInterval: 5000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        console.log(error, retryCount)
        if (error.status === 404) return
        if (error === 'vault not found') {
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
          setIsLive(true)
          setIsLoading(false)
        } else {
          console.log('Server returned null')
          // Retry after 15 seconds.
          setTimeout(() => mutate(), 15000)
        }
      }
    }
  )

  const debouncedMutate = useMemo(() => debounce(mutate, 1000), [mutate])

  useEffect(() => {
    if (sdk == null) return
    if (!isLive) return

    console.log('🍁 setting SETTLED listener for ', latestNounletTokenId)
    const nounletAuction = sdk.NounletAuction
    const settledFilter = sdk.NounletAuction.filters.Settled(
      vaultAddress,
      nounletTokenAddress,
      latestNounletTokenId
    )

    const listener = (...eventData: any) => {
      const event = eventData.at(-1)
      console.log('🍁🍁🍁 Settled event', eventData)
      console.log('event data', event)
      debouncedMutate()
    }

    nounletAuction.on(settledFilter, listener)

    return () => {
      console.log('🍁 removing SETTLED listener for ', latestNounletTokenId)
      nounletAuction.off(settledFilter, listener)
    }
  }, [isLive, vaultAddress, nounletTokenAddress, latestNounletTokenId, sdk, debouncedMutate])

  return <></>
}

function LeaderboardUpdater() {
  const sdk = useSdk()
  const { isLive, vaultAddress, nounletTokenAddress } = useVaultStore()
  const { setLeaderboardBlockNumber } = useBlockNumberCheckpointStore()
  const { mutate } = useLeaderboard()

  const debouncedMutate = useMemo(() => {
    return debounce(() => {
      return mutate()
    }, 1000)
  }, [mutate])

  useEffect(() => {
    if (!isLive || sdk == null) return

    // TODO Maybe be more specific with the events?
    console.log('🍉 listen to any event on NounletToken', vaultAddress, nounletTokenAddress)
    const nounletToken = sdk.NounletToken.attach(nounletTokenAddress)
    const nounletAuction = sdk.NounletAuction
    const nounletGovernance = sdk.NounletGovernance

    const listener = (...eventData: any) => {
      const event = eventData.at(-1)
      console.groupCollapsed('🍉🍉🍉 any event', event?.blockNumber, eventData)
      console.log('event data', event)
      console.groupEnd()

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
