import { FixedNumber } from 'ethers'
import { useBuyoutOfferModalStore } from 'store/buyout/buyout-offer-modal.store'
import StepOfferLive from './step-offer-live'
import StepReviewOffer from './step-review-offer'

type ComponentProps = {
  initialFullPriceOffer: FixedNumber
}

export type OfferDetails = {
  fullPrice: FixedNumber
  pricePerNounlet: FixedNumber
  nounletsOffered: FixedNumber
  priceOfOfferedNounlets: FixedNumber
  ethOffered: FixedNumber
}

export default function BuyoutOfferModal(props: ComponentProps): JSX.Element {
  const { buyoutOfferStep } = useBuyoutOfferModalStore()

  return (
    <StepReviewOffer initialFullPriceOffer={props.initialFullPriceOffer} />
    // <div className="buyout-offer-modal">
    //   {buyoutOfferStep === 0 ? (
    //   ) : (
    //     <StepOfferLive />
    //   )}
    // </div>
  )
}
