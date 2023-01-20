import useSWR from 'swr'
import useLocalStorage from '../utils/useLocalStorage'
import useSdk from '../utils/useSdk'

export interface NounletsImageData {
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

export default function useNounImageData(nounId?: string | null) {
  const sdk = useSdk()
  const { setImageCache } = useLocalStorage()

  const swrKey = nounId && `image/noun/${nounId}/`

  const { data } = useSWR<NounletsImageData>(
    sdk && swrKey,
    async () => {
      const nounsToken = sdk!.v2.NounsToken
      try {
        const [data, seed] = await Promise.all([
          nounsToken.tokenURI(nounId!),
          nounsToken.seeds(nounId!)
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
        return json
      } catch (error) {
        console.log('error while fetching nounlet image', error)
      }
    },
    {
      onSuccess(data, key) {
        if (data != null) {
          setImageCache(key, data)
        }
      },
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 1
    }
  )

  return {
    swrKey,
    data
  }
}
