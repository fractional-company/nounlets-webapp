import { useMemo } from 'react'
import { useVaultStore } from 'store/vaultStore'
import useSWR, { useSWRConfig, mutate as globalMutate } from 'swr'
import useLocalStorage from './useLocalStorage'
import useSdk from './useSdk'

interface NounletImageData {
  name: string
  description: string
  image: string
  seed: {
    accessory: number
    background: number
    body: number
    glasses: number
    head: number
  }
}

export default function useNounletImageData(nounletId: string | null) {
  const { setNounletImageCache } = useLocalStorage()
  const sdk = useSdk()
  const { isLive, vaultAddress, nounletTokenAddress } = useVaultStore()

  const nid = useMemo(() => {
    if (!isLive) return null
    if (nounletId == null || nounletId === '') return null

    return nounletId
  }, [isLive, nounletId])

  const swrKey = useMemo(() => {
    if (!isLive) return null
    if (nid == null) return null

    return `vault/${vaultAddress}/nounlet/${nounletTokenAddress}/image/${nid}`
  }, [isLive, nid, vaultAddress, nounletTokenAddress])

  const canFetch = useMemo(() => {
    if (!isLive) return false
    if (sdk == null) return false
    if (swrKey == null) return false

    return true
  }, [isLive, sdk, swrKey])

  const { data } = useSWR<NounletImageData>(
    canFetch && swrKey,
    async (key) => {
      console.log('🍧🍧🍧🍧 fetcheing image data', nid)
      const nounletToken = sdk!.NounletToken.attach(nounletTokenAddress)

      const [data, seed] = await Promise.all([
        nounletToken.uri(nid as string),
        nounletToken.seeds(nid as string)
        // nounletToken.generateSeed(nid as string)
      ])
      const base = data.split(',')[1]
      const json = JSON.parse(atob(base))
      json.seed = {
        accessory: seed.accessory,
        background: seed.background,
        body: seed.body,
        glasses: seed.glasses,
        head: seed.head
      }

      console.log('🍧🍧🍧🍧 fetched image data', nid, json.seed)
      return json
    },
    {
      onSuccess(data, key) {
        if (data != null) {
          setNounletImageCache(key, data)
        }
      },
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 3
    }
  )

  return {
    swrKey,
    data
  }
}
