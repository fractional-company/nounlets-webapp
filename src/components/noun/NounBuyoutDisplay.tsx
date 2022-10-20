import BuyoutHero from 'src/components/buyout/BuyoutHero'
import BuyoutHowDoesItWorkModal from 'src/components/buyout/BuyoutHowDoesItWorkModal'
import BuyoutOfferModal from 'src/components/buyout/BuyoutOfferModal'
import SimpleModalWrapper from 'src/components/common/simple/SimpleModalWrapper'
import ModalBidHistory from 'src/components/modals/ModalBidHistory'
import { NounAuctionsDisplay } from 'src/components/noun/NounAuctionsDisplay'
import NounCollectiveOwnership from 'src/components/noun/NounCollectiveOwnership'
import NounHero from 'src/components/noun/NounHero'
import NounLeaderboard from 'src/components/noun/NounLeaderboard'
import NounVotesFromNounlet from 'src/components/noun/NounVotesFromNounlet'
import NounWtf from 'src/components/noun/NounWtf'
import OnMounted from 'src/components/OnMounted'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
import { useAppStore } from 'src/store/application'
import { useBuyoutHowDoesItWorkModalStore } from 'src/store/buyout/buyout-how-does-it-work-modal.store'
import { useBuyoutOfferModalStore } from 'src/store/buyout/buyout-offer-modal.store'
import { useNounStore } from 'src/store/noun.store'

export function NounBuyoutDisplay() {
  const { setBidModalOpen, isBidModalOpen } = useAppStore()
  const { isLive, isGovernanceEnabled } = useNounStore()
  const { hasAuctionSettled } = useDisplayedNounlet()

  const { initialFullPriceOffer, isBuyoutOfferModalShown, closeBuyoutOfferModal } =
    useBuyoutOfferModalStore()
  const { isBuyoutHowDoesItWorkModalShown, closeBuyoutHowDoesItWorkModal } =
    useBuyoutHowDoesItWorkModalStore()

  console.log({ isGovernanceEnabled })
  return (
    <OnMounted>
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
        <div className="space-y-16">
          <BuyoutHero />
          {/*{isLive && hasAuctionSettled && <NounVotesFromNounlet />}*/}
          {isLive && isGovernanceEnabled && <NounLeaderboard />}
          {isLive && <NounCollectiveOwnership />}
          <NounWtf />
        </div>
      </>
    </OnMounted>
  )
}
