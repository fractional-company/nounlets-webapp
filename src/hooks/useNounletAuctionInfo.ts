import { ethers } from 'ethers'
import { getNounletAuctionData, getNounletAuctionDataBC } from 'graphql/src/queries'
import { useMemo } from 'react'
import { useNounStore } from 'src/store/noun.store'
import useSWR, { unstable_serialize, useSWRConfig } from 'swr'
import useLocalStorage from './utils/useLocalStorage'
import useSdk from './utils/useSdk'

export default function useNounletAuctionInfo(nounletId: string | null) {
  const { setAuctionsCache: setNounletAuctionsCache } = useLocalStorage()
  const sdk = useSdk()
  const { cache, mutate: globalMutate } = useSWRConfig()
  const { isLive, vaultAddress, nounletTokenAddress, latestNounletTokenId } = useNounStore()

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

  const cachedDataHasAuctionSettled = useMemo(() => {
    if (cachedData == null) return false
    // Is settled is manually set if the auction has settled on the BC but BE hasn't
    // caught up yet. This is so we can show the "settled" state on the home-hero.
    // But until the BE has caught up, the transaction hash is ZeroAddress
    // so we show a "indexing..." button
    return (
      !!cachedData.auction?.settled &&
      cachedData.auction.settledTransactionHash !== ethers.constants.AddressZero
    )
  }, [cachedData])

  const chachedActionTimeLeft = useMemo(() => {
    if (cachedData == null) return 1
    if (cachedData.auction == null) return 1

    const now = Date.now() + 2000 // add 2 second buffer
    const endTime = cachedData.auction.endTime * 1000
    const timeLeft = endTime - now
    return timeLeft
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

      const timeLeft = chachedActionTimeLeft
      const hasAuctionEnded = chachedActionTimeLeft <= 0

      // Ended but not yet settled, try every minute
      if (hasAuctionEnded) {
        return 60_000
      }
      // More than 2 hours left
      if (timeLeft >= 7200_000) {
        return 3600_000
      }
      // More than 20 minutes left
      if (timeLeft >= 1200_000) {
        return 600_000
      }
      // More than 2 minutes left
      if (timeLeft >= 120_000) {
        return 60_000
      }

      return 10_000
    } catch (error) {}

    // Fallback
    return 60_000
  }, [cachedData, cachedDataHasAuctionSettled, chachedActionTimeLeft])

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
      let response: Awaited<ReturnType<typeof getNounletAuctionData>>
      // console.log('👩‍⚖️ Fetching auction', { isAuctionOld, key })

      // The auction has already settled on the BC
      if (isAuctionOld) {
        // console.log('👩‍⚖️ Old auction')
        try {
          response = await getNounletAuctionData(
            key.vaultAddress,
            key.nounletTokenAddress,
            key.nounletId as string
          )

          if (response == null || !response.settled) {
            // console.log('👩‍⚖️👩‍⚖️ Old auction not yet synced. get from BC')
            response = await getNounletAuctionDataBC(
              key.vaultAddress,
              key.nounletTokenAddress,
              key.nounletId,
              sdk!.NounletAuction
            )
            response.settled = true // Fake it
          }
          return { auction: response, fetchedAt: Date.now() }
        } catch (error) {
          console.log('Error in subgraph', error)
          // return { auction: null, fetchedAt: Date.now() }
        }
      }
      // Check for auction info every once in a while
      // console.log('👩‍⚖️👩‍⚖️👩‍⚖️👩‍⚖️ Just checking')
      try {
        response = await getNounletAuctionData(
          key.vaultAddress,
          key.nounletTokenAddress,
          key.nounletId as string
        )

        if (response == null || !response.settled) {
          // console.log('👩‍⚖️👩‍⚖️👩‍⚖️👩‍⚖️ Auction not yet synced. get from BC')
          response = await getNounletAuctionDataBC(
            key.vaultAddress,
            key.nounletTokenAddress,
            key.nounletId,
            sdk!.NounletAuction
          )
          // response.settled = true // Dont fake it
        }
        return { auction: response, fetchedAt: Date.now() }
      } catch (error) {
        console.log('Error in subgraph', error)
        throw error
      }
    },
    {
      onSuccess(data, key) {
        if (data != null && data.auction != null) {
          if (data.auction.settled === true) {
            if (data.auction.id === latestNounletTokenId) {
              globalMutate(
                unstable_serialize({
                  name: 'VaultMetadata',
                  vaultAddress: vaultAddress
                })
              )
            }
          }
          if (
            data.auction.settled === true &&
            data.auction.settledTransactionHash !== ethers.constants.AddressZero
          ) {
            setNounletAuctionsCache(key, data)
          }
        }
      },
      dedupingInterval: 5000,
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
