import useNounImageData, { NounletsImageData } from 'src/hooks/images/useNounImageData'
import useNounletImageData from 'src/hooks/images/useNounletImageData'
import Image from 'next/image'
import nounLoadingImage from 'public/img/loading-skull.gif'

export function NounletImage(props: {
  noundId?: string | null
  nounletTokenAddress?: string | null
  id: string | null
}) {
  const { data: nouneltData } = useNounletImageData(
    props.noundId,
    props.nounletTokenAddress,
    props.id
  )

  return nouneltData == null ? (
    <Image
      src={nounLoadingImage}
      layout="responsive"
      width={320}
      height={320}
      className="image-pixelated"
      alt="nounlet loading"
    />
  ) : (
    <Image
      className="image-pixelated"
      src={nouneltData.image}
      alt={`nounlet ${props.id}`}
      layout="responsive"
      width={320}
      height={320}
    />
  )
}

export function NounImage(props: { id?: string }) {
  const { data } = useNounImageData(props.id)

  return data == null ? (
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
      src={data.image}
      alt={`noun ${props.id}`}
      layout="responsive"
      width={320}
      height={320}
    />
  )
}
