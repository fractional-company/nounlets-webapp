import { useEthers } from '@usedapp/core'
import { getNFTBalance } from 'graphql/src/queries'
import useSdk from '../utils/useSdk'
import useSWRInfinite from 'swr/infinite'

export default function useWalletNounsList(enabled: boolean) {
  const { account } = useEthers()
  const sdk = useSdk()
  const PAGE_SIZE = 9

  const infinite = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (enabled && account) {
        return [`wallet/${account!.toLowerCase()}`, pageIndex]
      }
      return null
    },
    async (key, index) => {
      return await getNFTBalance(sdk, account!, +index, PAGE_SIZE)
    },
    {
      revalidateFirstPage: false,
      revalidateAll: false
    }
  )

  const { data, error, size, isValidating } = infinite

  const concatenatedData = data ? data.map((datum) => datum.assets).flatMap((datum) => datum) : null
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.assets.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.assets.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size
  const hasMore = !isLoadingMore && !isReachingEnd

  return {
    ...infinite,
    concatenatedData,
    isLoadingInitialData,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
    isRefreshing,
    hasMore
  }
}
