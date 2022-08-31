import { ethers } from 'ethers'
import { Nounlet } from 'lib/graphql/graphql.models'
import { getNounletAuctionData, getNounletAuctionDataBC } from 'lib/graphql/queries'
import { useCallback, useMemo } from 'react'
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

  const cachedDataAuctionSettled = useMemo(() => {
    if (swrKey == null) return false
    const data: Nounlet | null = cache.get(unstable_serialize(swrKey))
    if (data == null) return false

    // Is settled is manually set if the auction has settled on the BC but BE hasn't
    // caught up yet. This is so we can show the "settled" state on the home-hero.
    // But until the BE has cought up, the transaction hash is ZeroAddress
    // so we show a "indexing..." button
    return (
      !!data.auction?.settled &&
      data.auction.settledTransactionHash !== ethers.constants.AddressZero
    )
  }, [cache, swrKey])

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
      dedupingInterval: 2000,
      revalidateIfStale: !cachedDataAuctionSettled
    }
  )

  return {
    swrKey,
    data,
    mutate
  }
}
