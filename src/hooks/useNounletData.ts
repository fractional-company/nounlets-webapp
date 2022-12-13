import { getNounletAuctionData, getNounletAuctionDataBC } from 'graphql/src/queries'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSdk, { NounletsSDK } from 'src/hooks/utils/useSdk'
import { useNounStore } from 'src/store/noun.store'
import { useNounletStore } from 'src/store/nounlet.store'
import useSWR, { useSWRConfig } from 'swr'

const tmpCache = new Map<string, any>()

export async function nounletDataFetcher(
  vaultAddress: string,
  nounletTokenAddress: string,
  nounletId: string,
  latestNounletTokenID: string,
  sdk: NounletsSDK
) {
  let response: Awaited<ReturnType<typeof getNounletAuctionData>> = null
  // Ongoing auction, get from BC
  if (nounletId === latestNounletTokenID) {
    response = await getNounletAuctionData(vaultAddress, nounletTokenAddress, nounletId)

    if (!response?.settled) {
      response = await getNounletAuctionDataBC(
        vaultAddress,
        nounletTokenAddress,
        nounletId,
        sdk.NounletAuction
      )
    }
  } else {
    response = await getNounletAuctionData(vaultAddress, nounletTokenAddress, nounletId)
  }

  console.log('auction response', { response })

  return { auction: response, fetchedAt: Date.now() }
}

// TODO implement refresh interval

export function useNounletData(callback?: (data: any) => void) {
  const { cache, mutate: globalMutate } = useSWRConfig()
  const sdk = useSdk()
  const {
    isLive,
    isLoading: isLoadingNoun,
    nounTokenId,
    vaultAddress,
    nounletTokenAddress,
    latestNounletTokenId,
    wereAllNounletsAuctioned
  } = useNounStore()
  const { isLoading, nounletId, setIsLoading, setNounletID, setAuctionData } = useNounletStore()

  let keySWR = null
  if (isLive && !isLoadingNoun && nounletId) {
    keySWR = `${nounletTokenAddress}/nounlet/${nounletId}`
  }

  const cachedData: Awaited<ReturnType<typeof nounletDataFetcher>> | null = tmpCache.get(
    keySWR || '--empty'
  )

  const shouldRevalidate = cachedData == null

  let refreshInterval = 0
  if (shouldRevalidate) {
    refreshInterval = 60_000
  }

  useEffect(() => {
    if (cachedData == null) {
      setIsLoading(true)
      setAuctionData(null)
    } else {
      console.log('Auction data cached', cachedData)
      setAuctionData(cachedData)
      setIsLoading(false)
    }
  }, [cachedData])

  const { data, mutate } = useSWR(
    cachedData == null && keySWR,
    async () =>
      nounletDataFetcher(vaultAddress, nounletTokenAddress, nounletId!, latestNounletTokenId, sdk!),
    {
      dedupingInterval: 0,
      refreshInterval: refreshInterval,
      revalidateIfStale: shouldRevalidate,
      onSuccess(data, key) {
        setAuctionData(data)
        setIsLoading(false)

        if (data?.auction?.settled) {
          console.log('✨ setting cache', data)
          // cache.set(key, data)
          tmpCache.set(key, data)
        }

        if (callback) {
          callback(data)
        }
      }
    }
  )
}
