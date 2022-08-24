import { useMemo } from 'react'
import { useVaultStore } from 'store/vaultStore'
import useSWR, { useSWRConfig } from 'swr'
import useSdk from './useSdk'

interface NounImageData {
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

export default function useNounImageData(nounId: string | null) {
  const sdk = useSdk()
  const { isLive, vaultAddress, nounletTokenAddress } = useVaultStore()

  const nid = useMemo(() => {
    if (!isLive) return null
    if (nounId == null || nounId === '') return null

    return nounId
  }, [isLive, nounId])

  const swrKey = useMemo(() => {
    if (!isLive) return null
    if (nid == null) return null

    return `vault/${vaultAddress}/noun/${nounletTokenAddress}/image/${nid}`
  }, [isLive, nid, vaultAddress, nounletTokenAddress])

  const canFetch = useMemo(() => {
    if (!isLive) return false
    if (sdk == null) return false
    if (swrKey == null) return false

    return true
  }, [isLive, sdk, swrKey])

  const { data } = useSWR<NounImageData>(
    canFetch && swrKey,
    async (key) => {
      const nounsToken = sdk!.NounsToken
      try {
        const [data, seed] = await Promise.all([
          nounsToken.tokenURI(nid as string),
          nounsToken.seeds(nid as string)
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
        console.log('🍕 fetched image data', nid, json.seed)
        return json
      } catch (error) {
        console.log('error while fetching nounlet image', error)
      }
      return null
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  return {
    swrKey,
    data
  }
}
