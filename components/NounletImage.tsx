import useNounImageData from 'hooks/useNounImageData'
import useNounletImageData from 'hooks/useNounletImageData'
import Image from 'next/image'
import nounLoadingImage from 'public/img/loading-skull.gif'
import { useVaultStore } from 'store/vaultStore'

export function NounletImage(props: { id: string | null }) {
  const { data: nouneltData } = useNounletImageData(props.id)

  return nouneltData == null ? (
    <Image
      src={nounLoadingImage}
      layout="responsive"
      width={320}
      height={320}
      alt="nounlet loading"
      className="image-pixelated"
    />
  ) : (
    <Image
      src={nouneltData.image}
      alt="nounlet"
      layout="responsive"
      width={320}
      height={320}
      className="image-pixelated"
    />
  )
}

export function NounImage() {
  const { nounTokenId } = useVaultStore()
  const { data: nounData } = useNounImageData(nounTokenId)

  return nounData == null ? (
    <Image
      src={nounLoadingImage}
      layout="responsive"
      width={320}
      height={320}
      className="image-pixelated"
      alt="noun loading"
    />
  ) : (
    <Image
      className="image-pixelated"
      src={nounData.image}
      alt="noun"
      layout="responsive"
      width={320}
      height={320}
    />
  )
}
