import Button from 'components/buttons/button'
import { BigNumber } from 'ethers'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import useSdk from 'hooks/useSdk'
import { getLeaderboardData, getVaultData } from 'lib/graphql/queries'
import { BidEvent } from 'lib/utils/types'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useVaultStore } from 'store/vaultStore'
import useSWR, { useSWRConfig } from 'swr'
import debounce from 'lodash/debounce'
import { useLeaderboardStore } from 'store/leaderboardStore'
import OnMounted from './utils/on-mounted'
import useLeaderboard from 'hooks/useLeaderboard'
import { useBlockCheckpointStore } from 'store/blockCheckpoint'

export default function ChainUpdater() {
  const router = useRouter()
  const sdk = useSdk()
  const {
    isLive,
    isLoading,
    vaultAddress,
    nounTokenId,
    nounletTokenAddress,
    currentDelegate,
    latestNounletTokenId
  } = useVaultStore()

  // url nid listener
  const { nid } = useDisplayedNounlet()

  // If overshoot, redirect to "/"
  useEffect(() => {
    if (!isLive) return
    if (nid == null) return
    const targetNid = +nid
    if (targetNid <= 0 || targetNid > +latestNounletTokenId) {
      console.log('Not in range', router.asPath)
      router.replace('/')
    }
  }, [isLive, nid, isLoading, latestNounletTokenId, router])

  // ====================================================
  // Vault metadata
  // ====================================================

  // const { mutate: mutateVaultMetadata } = useSWR(
  //   router.isReady &&
  //     sdk != null && {
  //       name: 'VaultMetadata',
  //       vaultAddress: vaultAddress
  //     },
  //   async (key) => {
  //     if (sdk == null) throw new Error('sdk not initialized')

  //     console.groupCollapsed('🏳️ fetching vault metadata ...')
  //     console.log({ ...key })
  //     console.groupEnd()

  //     const [vaultMetadata, vaultInfo, currentDelegate] = await Promise.all([
  //       getVaultData(key.vaultAddress),
  //       sdk.NounletAuction.vaultInfo(vaultAddress),
  //       sdk.NounletGovernance.currentDelegate(vaultAddress)
  //     ])

  //     return {
  //       ...vaultMetadata,
  //       ...vaultInfo,
  //       currentDelegate
  //     }
  //   },
  //   {
  //     dedupingInterval: 5000,
  //     errorRetryCount: 0, // TODO change to 2
  //     onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
  //       console.log(error, retryCount)
  //       if (error.status === 404) return
  //       if (error === 'vault not found') {
  //         console.log('🐉 Checking for vault again in 30 seconds 🐉')
  //         setTimeout(() => revalidate({ retryCount }), 30000)
  //         return
  //       }
  //       if (retryCount >= 3) return

  //       // Retry after 2 seconds.
  //       setTimeout(() => revalidate({ retryCount }), 2000)
  //     },
  //     onSuccess: (data) => {
  //       console.groupCollapsed('🏴 fetched vault metadata ...')
  //       console.table(data)
  //       console.groupEnd()

  //       if (data.isLive) {
  //         setNounletTokenAddress(data.nounletTokenAddress)
  //         setNounTokenId(data.nounTokenId)
  //         setVaultCuratorAddress(data.curator)
  //         setCurrentDelegate(data.currentDelegate)
  //         setBackendLatestNounletTokenId(`${data.nounletCount}`)
  //         setLatestNounletTokenId(`${data.currentId.toString()}`)
  //         setIsLive(true)
  //         setIsLoading(false)
  //       } else {
  //         console.log('Server returned null')
  //       }
  //     }
  //   }
  // )

  // const memoedMutateVaultMetadataDebounce = useMemo(
  //   () => debounce(mutateVaultMetadata, 2000),
  //   [mutateVaultMetadata]
  // )
  // const debouncedMutateVaultMetadata = useCallback(memoedMutateVaultMetadataDebounce, [
  //   memoedMutateVaultMetadataDebounce
  // ])

  // // ====================================================
  // // Settled event
  // // ====================================================

  // useEffect(() => {
  //   if (sdk == null) return
  //   if (!isLive) return

  //   console.log('🍁 setting SETTLED listener for ', latestNounletTokenId)
  //   const nounletAuction = sdk.NounletAuction
  //   const settledFilter = sdk.NounletAuction.filters.Settled(
  //     vaultAddress,
  //     nounletTokenAddress,
  //     latestNounletTokenId
  //   )
  //   const listener = (
  //     vault: string,
  //     token: string,
  //     id: BigNumber,
  //     winner: string,
  //     amount: BigNumber,
  //     event: any
  //   ) => {
  //     console.log('settled event!', vault, token, id, winner, amount, event)
  //     nounletAuction.off(settledFilter, listener)
  //     debouncedMutateVaultMetadata()
  //   }

  //   nounletAuction.on(settledFilter, listener)

  //   return () => {
  //     console.log('🍂 removing SETTLED listener for ', latestNounletTokenId)
  //     nounletAuction.off(settledFilter, listener)
  //   }
  // }, [
  //   isLive,
  //   vaultAddress,
  //   nounletTokenAddress,
  //   latestNounletTokenId,
  //   sdk,
  //   debouncedMutateVaultMetadata
  // ])

  const vaultMetadata = {
    isLive,
    isLoading,
    vaultAddress, // VaultContract
    nounletTokenAddress, // NouneltTokenContract (proxy?)
    nounTokenId,
    latestNounletTokenId
  }

  const asd = async () => {
    // console.log('asd', canFetchLeaderboard)
    // const dataa = await mutateLeaderboard()
    // console.log('sda', dataa)
  }

  return (
    <>
      <div className="overflow-hidden">
        <pre>{JSON.stringify(vaultMetadata, null, 4)}</pre>
        {/* <Button className="primary" onClick={() => mutateVaultMetadata()}>
          mutateVaultMetadata
        </Button> */}

        <Button className="primary" onClick={() => asd()}>
          mutateLeaderboard!
        </Button>
      </div>

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
      // setLeaderboardBlockNumber(event?.blockNumber || 0)
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
  const { setLeaderboardBlockNumber } = useBlockCheckpointStore()
  const { mutate } = useLeaderboard()

  const debouncedMutate = useMemo(() => {
    return debounce(() => {
      return mutate()
    }, 1000)
  }, [mutate])

  useEffect(() => {
    if (!isLive || sdk == null) return

    console.log('🍉 listen to any event on NounletToken', vaultAddress, nounletTokenAddress)
    const nounletToken = sdk.NounletToken.attach(nounletTokenAddress)
    const listener = (...eventData: any) => {
      const event = eventData.at(-1)
      console.log('🍉🍉🍉 any event', eventData)
      console.log('event data', event)
      setLeaderboardBlockNumber(event?.blockNumber || 0)
      debouncedMutate()
    }

    nounletToken.on(nounletToken, listener)
    sdk.NounletAuction.on(sdk.NounletAuction, listener)

    return () => {
      console.log('🍉 stop listening to any event on NounletToken')
      nounletToken.off(nounletToken, listener)
      sdk.NounletAuction.off(sdk.NounletAuction, listener)
    }
  }, [isLive, sdk, vaultAddress, nounletTokenAddress, debouncedMutate, setLeaderboardBlockNumber])

  return (
    <>
      <OnMounted>
        {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}

        <Button className="default" onClick={() => debouncedMutate()}>
          Can i mutate?
        </Button>
      </OnMounted>
    </>
  )
}
