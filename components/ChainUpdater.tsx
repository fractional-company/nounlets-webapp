import Button from 'components/buttons/button'
import { BigNumber } from 'ethers'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import useSdk from 'hooks/useSdk'
import { getLeaderboardData, getVaultData } from 'lib/graphql/queries'
import { BidEvent } from 'lib/utils/types'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useVaultStore } from 'store/vaultStore'
import useSWR, { useSWRConfig } from 'swr'
import debounce from 'lodash/debounce'
import { useLeaderboardStore } from 'store/leaderboardStore'

export default function ChainUpdater() {
  const router = useRouter()
  const sdk = useSdk()
  const { mutate: mutateSWRGlobal } = useSWRConfig()
  const {
    isLive,
    isLoading,
    vaultAddress,
    nounTokenId,
    nounletTokenAddress,
    currentDelegate,
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
  const { setData } = useLeaderboardStore()

  // url nid listener
  const { nid } = useDisplayedNounlet()

  // If overshoot, redirect to "/"
  useEffect(() => {
    if (!isLive) return
    if (nid == null) return
    const targetNid = +nid
    if (targetNid <= 0 || targetNid > +latestNounletTokenId) {
      console.log('Not in range', router.asPath)
      // router.replace('/')
    }
  }, [isLive, nid, isLoading, latestNounletTokenId, router])

  // ====================================================
  // Vault metadata
  // ====================================================

  const { mutate: mutateVaultMetadata } = useSWR(
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

      const [vaultMetadata, vaultInfo, currentDelegate] = await Promise.all([
        getVaultData(key.vaultAddress),
        sdk.NounletAuction.vaultInfo(vaultAddress),
        sdk.NounletGovernance.currentDelegate(vaultAddress)
      ])

      return {
        ...vaultMetadata,
        ...vaultInfo,
        currentDelegate
      }
    },
    {
      dedupingInterval: 5000,
      errorRetryCount: 0, // TODO change to 2
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        console.log(error, retryCount)
        if (error.status === 404) return
        if (error === 'vault not found') {
          console.log('🐉 Checking for vault again in 30 seconds 🐉')
          setTimeout(() => revalidate({ retryCount }), 30000)
          return
        }
        if (retryCount >= 3) return

        // Retry after 2 seconds.
        setTimeout(() => revalidate({ retryCount }), 2000)
      },
      onSuccess: (data) => {
        console.groupCollapsed('🏴 fetched vault metadata ...')
        console.table(data)
        console.groupEnd()

        if (data.isLive) {
          setNounletTokenAddress(data.nounletTokenAddress)
          setNounTokenId(data.nounTokenId)
          setVaultCuratorAddress(data.curator)
          setCurrentDelegate(data.currentDelegate)
          setBackendLatestNounletTokenId(`${data.nounletCount}`)
          setLatestNounletTokenId(`${data.currentId.toString()}`)
          setIsLive(true)
          setIsLoading(false)
        } else {
          console.log('Server returned null')
        }
      }
    }
  )

  const memoedMutateVaultMetadataDebounce = useMemo(
    () => debounce(mutateVaultMetadata, 2000),
    [mutateVaultMetadata]
  )
  const debouncedMutateVaultMetadata = useCallback(memoedMutateVaultMetadataDebounce, [
    memoedMutateVaultMetadataDebounce
  ])

  // ====================================================
  // Settled event
  // ====================================================

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
    const listener = (
      vault: string,
      token: string,
      id: BigNumber,
      winner: string,
      amount: BigNumber,
      event: any
    ) => {
      console.log('settled event!', vault, token, id, winner, amount, event)
      nounletAuction.off(settledFilter, listener)
      debouncedMutateVaultMetadata()
    }

    nounletAuction.on(settledFilter, listener)

    return () => {
      console.log('🍂 removing SETTLED listener for ', latestNounletTokenId)
      nounletAuction.off(settledFilter, listener)
    }
  }, [
    isLive,
    vaultAddress,
    nounletTokenAddress,
    latestNounletTokenId,
    sdk,
    debouncedMutateVaultMetadata
  ])

  //11247688 //11247688

  // ====================================================
  // Any event on NounletToken contract should trigger a
  // refetch of leaderboard data
  // ====================================================

  const lastEventBlockNumber = useRef(0)
  const canFetchLeaderboard = useMemo(() => {
    return isLive && sdk != null && nounTokenId !== ''
  }, [isLive, sdk, nounTokenId])

  const { mutate: mutateLeaderboard } = useSWR(
    canFetchLeaderboard && { name: 'Leaderboard' },
    async () => {
      console.log('Run now?')

      const [leaderboardData, currentDelegate] = await Promise.all([
        getLeaderboardData(nounTokenId),
        sdk!.NounletGovernance.currentDelegate(vaultAddress)
      ])

      // const result = await getLeaderboardData(nounTokenId)
      console.log('fetched new data', leaderboardData, currentDelegate)
      return {
        ...leaderboardData,
        currentDelegate
      }
    },
    {
      onSuccess(data) {
        setCurrentDelegate(data.currentDelegate)
        setData(data)
      },
      refreshInterval(latestData) {
        if (latestData == null) return 0
        const beBlockNumber = latestData?._meta.block.number || 0

        if (lastEventBlockNumber.current === 0) {
          lastEventBlockNumber.current = 1
          return 15000
        }

        if (lastEventBlockNumber.current > beBlockNumber) {
          console.log('🥒 Leadeboard data out of sync', nounTokenId)
          return 15000
        }

        // console.log('🥒🥒🥒 Leaderboard in sync')
        return 0
      }
    }
  )

  const memoedMutateLeaderboardDebounce = useMemo(() => {
    return debounce(mutateLeaderboard, 8000)
  }, [mutateLeaderboard])

  const debouncedMutateLeaderboard = useCallback(memoedMutateLeaderboardDebounce, [
    memoedMutateLeaderboardDebounce
  ])

  useEffect(() => {
    if (!isLive || sdk == null) return
    console.log('🍉 listen to any event on NounletToken', vaultAddress, nounletTokenAddress)
    const nounletToken = sdk.NounletToken.attach(nounletTokenAddress)

    const listener = (...eventData: any) => {
      console.log('🍉🍉🍉 any event', eventData)

      const event = eventData.at(-1)
      console.log('event data', event)
      lastEventBlockNumber.current = event?.blockNumber || 0

      debouncedMutateLeaderboard()
    }

    nounletToken.on(nounletToken, listener)
    // nounletAuction.on(nounletAuction, listener)

    return () => {
      console.log('🍉 stop listening to any event on NounletToken')
      nounletToken.off(nounletToken, listener)
      // nounletAuction.off(nounletAuction, listener)
    }
  }, [isLive, sdk, vaultAddress, nounletTokenAddress, debouncedMutateLeaderboard])

  const vaultMetadata = {
    isLive,
    isLoading,
    vaultAddress, // VaultContract
    nounletTokenAddress, // NouneltTokenContract (proxy?)
    nounTokenId,
    latestNounletTokenId
  }

  const asd = async () => {
    console.log('asd', canFetchLeaderboard)
    const dataa = await mutateLeaderboard()
    console.log('sda', dataa)
  }

  return (
    <div className="overflow-hidden">
      <pre>{JSON.stringify(vaultMetadata, null, 4)}</pre>
      <Button className="primary" onClick={() => mutateVaultMetadata()}>
        mutateVaultMetadata
      </Button>

      <Button className="primary" onClick={() => asd()}>
        mutateLeaderboard!
      </Button>
    </div>
  )
}
