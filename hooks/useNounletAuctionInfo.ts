import { ethers } from 'ethers'
import { Nounlet } from 'lib/graphql/graphql.models'
import { getNounletAuctionData, getNounletAuctionDataBC } from 'lib/graphql/queries'
import { useCallback, useEffect, useMemo } from 'react'
import { useVaultStore } from 'store/vaultStore'
import useSWR, { unstable_serialize, useSWRConfig } from 'swr'
import useLocalStorage from './useLocalStorage'
import useSdk from './useSdk'

export default function useNounletAuctionInfo(nounletId: string | null) {
  const { setNounletAuctionsCache } = useLocalStorage()
  const sdk = useSdk()
  const { cache } = useSWRConfig()
  const { isLive, vaultAddress, nounletTokenAddress, latestNounletTokenId } = useVaultStore()

  const nid = useMemo(() => {
    if (!isLive) return null
    if (nounletId == null || nounletId === '') return null

    return nounletId
  }, [isLive, nounletId])

  const swrKey = useMemo(() => {
    if (!isLive) return null
    if (nid == null) return null

    return {
      name: 'NounletAuctionInfo',
      vaultAddress: vaultAddress,
      nounletTokenAddress: nounletTokenAddress,
      nounletId: nid
    }
  }, [isLive, nid, vaultAddress, nounletTokenAddress])

  const unserializedKey = useMemo(() => {
    if (swrKey == null) return null

    return unstable_serialize(swrKey)
  }, [swrKey])

  const cachedData = cache.get(unserializedKey) || null

  // const cachedData = useMemo(() => {
  //   if (swrKey == null) return null
  //   const data: Nounlet | null = cache.get(unstable_serialize(swrKey))
  //   if (data == null) return null

  //   return data
  // }, [cache, swrKey])

  const cachedDataHasAuctionSettled = useMemo(() => {
    if (cachedData == null) return false
    // Is settled is manually set if the auction has settled on the BC but BE hasn't
    // caught up yet. This is so we can show the "settled" state on the home-hero.
    // But until the BE has cought up, the transaction hash is ZeroAddress
    // so we show a "indexing..." button
    return (
      !!cachedData.auction?.settled &&
      cachedData.auction.settledTransactionHash !== ethers.constants.AddressZero
    )
  }, [cachedData])

  const cachedDataAuctionRefreshInterval = useMemo(() => {
    try {
      if (cachedData == null) return 0
      if (cachedData.auction == null) return 0

      // No need to refresh since its DONE
      if (cachedDataHasAuctionSettled) {
        // console.log('⚱️ ⚱️ ⚱️ Ended AND settled. Stop retrying')
        return 0
      }
      const now = Date.now() + 5000 // add 5 second buffer
      const endTime = cachedData.auction.endTime * 1000
      const timeLeft = endTime - now
      const hasAuctionEnded = endTime <= now

      // Ended but not yet settled, try every minute
      if (hasAuctionEnded) {
        // console.log('⚱️ ⚱️ ⚱️ Ended but not settled 1 minute retry')
        return 60_000
      }
      // More than an hour left
      if (timeLeft >= 3600_000) {
        return 3600_000
      }
      // More than 10 minutes left
      if (timeLeft >= 600_000) {
        return 600_000
      }
      // More than 2 minutes left
      if (timeLeft >= 120_000) {
        // console.log('⚱️ ⚱️ ⚱️ More then 2 minutes')
        return 60_000
      }

      // console.log('⚱️ ⚱️ ⚱️ Less then 2 minutes')
      return 20_000
    } catch (error) {}

    // Fallback
    return 60_000
  }, [cachedData, cachedDataHasAuctionSettled])

  const canFetch = useMemo(() => {
    if (!isLive) return false
    if (sdk == null) return false
    if (swrKey == null) return false

    return true
  }, [isLive, sdk, swrKey])

  const { data, mutate } = useSWR(
    canFetch && swrKey,
    async (key) => {
      const isAuctionOld = +key.nounletId < +latestNounletTokenId
      console.log('👩‍⚖️ Fetching auction', { isAuctionOld, key })
      let response: Awaited<ReturnType<typeof getNounletAuctionData>>

      if (isAuctionOld) {
        console.log('👩‍⚖️ Old auction')
        try {
          response = await getNounletAuctionData(
            key.vaultAddress,
            key.nounletTokenAddress,
            key.nounletId as string
          )

          if (!response.settled) {
            console.log('👩‍⚖️👩‍⚖️ Old auction not yet synced. get from BC')
          } else {
            return { auction: response, fetchedAt: Date.now() }
          }
        } catch (error) {
          console.log('Error in subgraph', error)
        }
      }

      response = await getNounletAuctionDataBC(
        key.vaultAddress,
        key.nounletTokenAddress,
        key.nounletId,
        sdk!.NounletAuction
      )

      if (isAuctionOld) {
        console.log('👩‍⚖️👩‍⚖️ Data for unsynced auction should now be fixed')
        response.settled = true
      }

      return { auction: response, fetchedAt: Date.now() }
    },
    {
      onSuccess(data, key, config) {
        console.log('success?', data)
        // console.log('auction success', key, data)
        if (data != null && data.auction != null) {
          if (
            data.auction.settled === true &&
            data.auction.settledTransactionHash !== ethers.constants.AddressZero
          ) {
            setNounletAuctionsCache(key, data)
          }
        }
      },
      dedupingInterval: 30000,
      refreshInterval: cachedDataAuctionRefreshInterval,
      revalidateIfStale: !cachedDataHasAuctionSettled
    }
  )

  return {
    swrKey,
    data,
    mutate
  }
}
