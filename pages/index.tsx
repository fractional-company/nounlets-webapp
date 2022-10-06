import type { NextPage } from 'next'

import HomeCollectiveOwnership from 'components/home/home-collective-ownership'
import HomeHero from 'components/home/home-hero'
import HomeLeaderboard from 'components/home/home-leaderboard'
import HomeVotesFromNounlet from 'components/home/home-votes-from-nounlet'
import HomeWTF from 'components/home/home-wtf'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import { useVaultStore } from 'store/vaultStore'
import BidHistoryModal from '../components/modals/bid-history-modal'
import SimpleModalWrapper from '../components/SimpleModalWrapper'
import { useAppStore } from '../store/application'
import useCurrentBackground from 'hooks/useCurrentBackground'
import SEO from '../components/seo'
import BuyoutHero from 'components/buyout/buyout-hero'
import { useBuyoutOfferModalStore } from 'store/buyout/buyout-offer-modal.store'
import { useBuyoutHowDoesItWorkModalStore } from 'store/buyout/buyout-how-does-it-work-modal.store'
import BuyoutOfferModal from 'components/buyout/buyout-offer-modal/buyout-offer-modal'
import BuyoutHowDoesItWorkModal from 'components/buyout/buyout-how-does-it-work-modal'

const Home: NextPage<{ url: string }> = ({ url }) => {
  const { setBidModalOpen, isBidModalOpen } = useAppStore()
  const { isLive, wereAllNounletsAuctioned } = useVaultStore()

  const { isLatestNounlet, hasAuctionSettled } = useDisplayedNounlet()

  const { initialFullPriceOffer, isBuyoutOfferModalShown, closeBuyoutOfferModal } =
    useBuyoutOfferModalStore()
  const { isBuyoutHowDoesItWorkModalShown, closeBuyoutHowDoesItWorkModal } =
    useBuyoutHowDoesItWorkModalStore()

  return (
    <div className="page-home w-screen">
      <SEO
        url={`${url}`}
        openGraphType="website"
        title="Nounlets"
        description="Own a noun together with Nounlets"
        image={`${url}/img/noun.jpg`}
      />

      <div className="space-y-16">
        {wereAllNounletsAuctioned ? (
          <>
            <BuyoutHero />
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
          </>
        ) : (
          <>
            <HomeHero />
            {isLive && hasAuctionSettled && <HomeVotesFromNounlet />}
            <SimpleModalWrapper
              className="md:!w-[600px] !max-w-[600px]"
              onClose={() => setBidModalOpen(false)}
              isShown={isBidModalOpen}
            >
              <BidHistoryModal />
            </SimpleModalWrapper>
          </>
        )}

        {isLive && <HomeLeaderboard />}
        {isLive && <HomeCollectiveOwnership />}
        <HomeWTF />
      </div>
    </div>
  )
}

export const getServerSideProps = (context: any) => {
  return {
    props: {
      url: 'https://' + context?.req?.headers?.host
    }
  }
}

export default Home
