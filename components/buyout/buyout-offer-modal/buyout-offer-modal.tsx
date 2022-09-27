import { FixedNumber } from 'ethers'
import useBuyoutNoun from 'hooks/useBuyoutNoun'
import useNounBuyout from 'hooks/useNounBuyout'
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
    <div className="buyout-offer-modal">
      {buyoutOfferStep === 0 ? (
        <StepReviewOffer initialFullPriceOffer={props.initialFullPriceOffer} />
      ) : (
        <StepOfferLive />
      )}
    </div>
  )
}
