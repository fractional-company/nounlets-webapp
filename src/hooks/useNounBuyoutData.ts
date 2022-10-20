import { getNounletAuctionData, getNounletAuctionDataBC } from 'graphql/src/queries'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSdk, { NounletsSDK } from 'src/hooks/useSdk'
import { getBuyoutBidInfo } from 'src/lib/utils/buyoutInfoUtils'
import { useBuyoutStore } from 'src/store/buyout/buyout.store'
import { useNounStore } from 'src/store/noun.store'
import { useNounletStore } from 'src/store/nounlet.store'
import useSWR, { useSWRConfig } from 'swr'

const tmpCache = new Map<string, any>()

export async function nounBuyoutDataFetcher(
  vaultAddress: string,
  nounletTokenAddress: string,
  nounTokenId: string,
  sdk: NounletsSDK
) {
  const response = await getBuyoutBidInfo(sdk!, vaultAddress, nounletTokenAddress, nounTokenId)
  console.log('buyout response', { response })
  return { buyout: response, fetchedAt: Date.now() }
}

// TODO implement refresh interval

export function useNounBuyoutData(callback?: (data: any) => void) {
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
  const { isLoading, setIsLoading, setBuyoutInfo } = useBuyoutStore()

  let keySWR = null
  if (isLive && !isLoadingNoun && wereAllNounletsAuctioned && nounTokenId) {
    keySWR = `${vaultAddress}/buyout/`
  }

  const cachedData: Awaited<ReturnType<typeof nounBuyoutDataFetcher>> | null = tmpCache.get(
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
      setBuyoutInfo(null)
    } else {
      console.log('Auction data cached', cachedData)
      setBuyoutInfo(cachedData.buyout)
      setIsLoading(false)
    }
  }, [cachedData])

  const { data, mutate } = useSWR(
    cachedData == null && keySWR,
    async () => nounBuyoutDataFetcher(vaultAddress, nounletTokenAddress, nounTokenId!, sdk!),
    {
      dedupingInterval: 0,
      refreshInterval: refreshInterval,
      revalidateIfStale: shouldRevalidate,
      onSuccess(data, key) {
        setBuyoutInfo(data.buyout)
        setIsLoading(false)

        // if (data?.auction?.settled) {
        //   console.log('✨ setting cache', data)
        //   // cache.set(key, data)
        //   tmpCache.set(key, data)
        // }

        if (callback) {
          callback(data)
        }
      }
    }
  )
}
