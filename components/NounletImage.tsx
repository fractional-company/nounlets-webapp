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
    />
  ) : (
    <Image src={nouneltData.image} alt="nounelt" layout="responsive" width={320} height={320} />
  )
}

export function NounImage() {
  const { nounTokenId } = useVaultStore()
  const { data: nounData } = useNounImageData(nounTokenId)

  return nounData == null ? (
    <Image src={nounLoadingImage} layout="responsive" width={320} height={320} alt="noun loading" />
  ) : (
    <Image src={nounData.image} alt="noun" layout="responsive" width={320} height={320} />
  )
}
