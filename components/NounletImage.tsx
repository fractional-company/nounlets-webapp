import useSdk from 'hooks/useSdk'
import Image from 'next/image'
import { useMemo } from 'react'
import { useVaultStore } from 'store/vaultStore'
import useSWR from 'swr'
import IconSpinner from './icons/icon-spinner'
import nounLoadingImage from 'public/img/loading-skull.gif'

export default function NounletImage(props: { id: string | null }) {
  const { isLive, nounletTokenAddress } = useVaultStore()
  const sdk = useSdk()
  const canFetchNounetImage = useMemo(() => {
    return isLive && sdk != null && props.id != null
  }, [isLive, sdk, props.id])

  const { data: imageData } = useSWR(
    canFetchNounetImage && `nounlet/${nounletTokenAddress}/${props.id}`,
    async (key: string) => {
      let image: string | null = null

      try {
        if (localStorage) {
          image = localStorage.getItem(key)
        }

        if (image == null) {
          const nounletToken = sdk!.NounletToken.attach(nounletTokenAddress)
          const data = await nounletToken.uri(props.id as string)

          if (data == null) return null
          const base = data.split(',')[1]
          const json = JSON.parse(atob(base))

          console.log('json', json)
          image = json.image as string

          if (localStorage) {
            localStorage.setItem(key, image)
          }
        } else {
          console.log('got from storage!')
        }
      } catch (error) {
        console.log('Failed to parse nounlet cache')
      }

      return image
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  return imageData == null ? (
    <Image
      src={nounLoadingImage}
      layout="responsive"
      width={320}
      height={320}
      alt="nounlet loading"
    />
  ) : (
    <Image src={imageData} alt="nounelt" layout="responsive" width={320} height={320} />
  )
}
