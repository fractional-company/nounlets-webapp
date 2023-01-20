import useSWR from 'swr'
import useLocalStorage from '../utils/useLocalStorage'
import useSdk from '../utils/useSdk'
import { NounletsImageData } from './useNounImageData'

export default function useNounletImageData(
  nounId?: string | null,
  nounletTokenAddress?: string | null,
  nounletId?: string | null
) {
  const sdk = useSdk()
  const { setImageCache } = useLocalStorage()
  const swrKey =
    nounId && nounletTokenAddress && nounletId && `image/noun/${nounId}/nounlet/${nounletId}`

  const { data } = useSWR<NounletsImageData>(
    swrKey,
    async () => {
      const nounletToken = sdk!.v2.NounletToken.attach(nounletTokenAddress!)

      const [data, seed] = await Promise.all([
        nounletToken.uri(nounletId!),
        nounletToken.seeds(nounletId!)
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
