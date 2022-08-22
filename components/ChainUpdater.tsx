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

export default function ChainUpdater() {
  const router = useRouter()
  const sdk = useSdk()
  const { mutate: mutateSWRGlobal } = useSWRConfig()
  const {
    isLoading,
    vaultAddress,
    nounTokenId,
    nounletTokenAddress,
    currentDelegate,
    latestNounletTokenId,
    setIsLoading,
    setVaultCuratorAddress,
    setNounTokenId,
    setCurrentDelegate,
    setNounletTokenAddress,
    setBackendLatestNounletTokenId,
    setLatestNounletTokenId
  } = useVaultStore()

  // url nid listener
  const { nid } = useDisplayedNounlet()

  // If overshoot, redirect to "/"
  useEffect(() => {
    if (nid == null) return
    const targetNid = +nid
    if (targetNid <= 0 || targetNid > +latestNounletTokenId) {
      console.log('Not in range')
      router.replace('/')
    }
  }, [nid, isLoading, latestNounletTokenId, router])

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
      focusThrottleInterval: 5000,
      dedupingInterval: 5000,
      errorRetryCount: 0, // TODO change to 2
      onError: (error) => {
        console.error(error)
      },
      onSuccess: (data) => {
        console.groupCollapsed('🏴 fetched vault metadata ...')
        console.table(data)
        console.groupEnd()

        if (data.nounletCount > 0) {
          setNounletTokenAddress(data.nounletTokenAddress)
          setNounTokenId(data.nounTokenId)
          setVaultCuratorAddress(data.curator)
          setCurrentDelegate(data.currentDelegate)
          setBackendLatestNounletTokenId(`${data.nounletCount}`)
          setLatestNounletTokenId(`${data.currentId.toString()}`)
          setIsLoading(false)
        } else {
          console.log('an auction should already be running')
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
    if (latestNounletTokenId === '') return

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
      console.log('🍂 removing SETTLED listener for', latestNounletTokenId)
      nounletAuction.off(settledFilter, listener)
    }
  }, [vaultAddress, nounletTokenAddress, latestNounletTokenId, sdk, debouncedMutateVaultMetadata])

  const handleTest = async () => {
    if (sdk == null) return

    // refreshVaultMetadata()
    console.log('dedup?')
    debouncedMutateVaultMetadata()
    console.log('handling test')
    // const nounletAuction = sdk.NounletAuction
    // const settledFilter = sdk.NounletAuction.filters.Settled(vaultAddress, vaultTokenAddress, '1')

    // console.log('result', await NounletAuction.queryFilter(settledFilter))
  }

  //11247688 //11247688

  // ====================================================
  // Any event on NounletToken contract should trigger a
  // refetch of leaderboard data
  // ====================================================

  const lastEventBlockNumber = useRef(0)
  const { mutate: mutateLeaderboard } = useSWR(
    nounTokenId !== '' && { name: 'Leaderboard' },
    async () => {
      const result = await getLeaderboardData(nounTokenId)
      console.log('fetched new data', result)
      return result
    },
    {
      onSuccess(data, key, config) {
        console.log('sucess', data)
        if (data == null) return

        const beBlockNumber = data?._meta.block.number
        if (beBlockNumber != null) {
          if (lastEventBlockNumber.current === 0) {
            // first time fire, check again in 20 seconds
            console.log('🥝 first check')
            lastEventBlockNumber.current = 1
            debouncedMutateLeaderboard()
            return
          }

          if (lastEventBlockNumber.current > beBlockNumber) {
            console.log('🥝 out of sync', lastEventBlockNumber.current, beBlockNumber)
            // if there was an event since the last BE check, check in 20 seconds
            debouncedMutateLeaderboard()
            return
          }
        }

        console.log('🥝🥝🥝 Data is in sync!!')
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
    if (sdk == null || nounletTokenAddress == '') return
    console.log('🍉 listen to any event on NounletToken', vaultAddress, nounletTokenAddress)

    const listener = (...eventData: any) => {
      console.log('🍉🍉🍉 any event', eventData)

      const event = eventData.at(-1)
      console.log('event data', event)
      lastEventBlockNumber.current = event?.blockNumber || 0

      debouncedMutateLeaderboard()
    }

    // sdk.NounletToken.on(sdk.NounletToken, listener)
    sdk.NounletAuction.on(sdk.NounletAuction, listener)

    return () => {
      console.log('🍉 stop listening to any event on NounletToken')
      // sdk.NounletToken.off(sdk.NounletToken, listener)
      sdk.NounletAuction.off(sdk.NounletAuction, listener)
    }
  }, [sdk, vaultAddress, nounletTokenAddress, debouncedMutateLeaderboard])

  return (
    <>
      <Button className="primary" onClick={() => debouncedMutateVaultMetadata()}>
        debouncedMutateVaultMetadata
      </Button>

      <Button className="primary" onClick={() => mutateLeaderboard()}>
        mutateLeaderboard!
      </Button>

      <Button className="primary" onClick={() => debouncedMutateLeaderboard()}>
        debouncedMutateLeaderboard!
      </Button>
    </>
  )
}
