import BuyoutHero from 'src/components/buyout/BuyoutHero'
import BuyoutHowDoesItWorkModal from 'src/components/buyout/BuyoutHowDoesItWorkModal'
import BuyoutOfferModal from 'src/components/buyout/BuyoutOfferModal'
import SimpleModalWrapper from 'src/components/common/simple/SimpleModalWrapper'
import ModalBidHistory from 'src/components/modals/ModalBidHistory'
import NounHero from 'src/components/noun/NounHero'
import OnMounted from 'src/components/OnMounted'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
import { useAppStore } from 'src/store/application.store'
import { useBuyoutHowDoesItWorkModalStore } from 'src/store/buyout/buyoutHowDoesItWorkModal.store'
import { useBuyoutOfferModalStore } from 'src/store/buyout/buyoutOfferModal.store'
import { useNounStore } from 'src/store/noun.store'

export default function NounHeroDisplay() {
  const { setBidModalOpen, isBidModalOpen } = useAppStore()
  const { isLive, isGovernanceEnabled, wereAllNounletsAuctioned } = useNounStore()
  const { hasAuctionSettled } = useDisplayedNounlet()

  const { initialFullPriceOffer, isBuyoutOfferModalShown, closeBuyoutOfferModal } =
    useBuyoutOfferModalStore()
  const { isBuyoutHowDoesItWorkModalShown, closeBuyoutHowDoesItWorkModal } =
    useBuyoutHowDoesItWorkModalStore()

  console.log({ isGovernanceEnabled })

  return (
    <OnMounted>
      {wereAllNounletsAuctioned ? (
        <>
          <SimpleModalWrapper
            className="md:!max-w-[512px]"
            isShown={isBuyoutOfferModalShown}
            onClose={() => closeBuyoutOfferModal()}
            preventCloseOnBackdrop
          >
            <BuyoutOfferModal initialFullPriceOffer={initialFullPriceOffer} />
          </SimpleModalWrapper>

          <SimpleModalWrapper
            className="!max-w-[680px]"
            isShown={isBuyoutHowDoesItWorkModalShown}
            onClose={() => closeBuyoutHowDoesItWorkModal()}
          >
            <BuyoutHowDoesItWorkModal />
          </SimpleModalWrapper>
          <BuyoutHero />
        </>
      ) : (
        <>
          <SimpleModalWrapper
            className="md:!w-[600px] !max-w-[600px]"
            onClose={() => setBidModalOpen(false)}
            isShown={isBidModalOpen}
          >
            <ModalBidHistory />
          </SimpleModalWrapper>

          <NounHero />
        </>
      )}
    </OnMounted>
  )
}
