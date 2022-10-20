import type { NextPage } from 'next'

import HomeCollectiveOwnership from 'src/components/home/HomeCollectiveOwnership'
import HomeHero from 'src/components/home/HomeHero'
import HomeLeaderboard from 'src/components/home/HomeLeaderboard'
import HomeVotesFromNounlet from 'src/components/home/HomeVotesFromNounlet'
import HomeWtf from 'src/components/home/HomeWtf'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
import { useVaultStore } from 'src/store/vaultStore'
import ModalBidHistory from '../src/components/modals/ModalBidHistory'
import SimpleModalWrapper from '../src/components/common/simple/SimpleModalWrapper'
import { useAppStore } from '../src/store/application'
import useCurrentBackground from 'src/hooks/useCurrentBackground'
import SEO from '../src/components/SEO'
import BuyoutHero from 'src/components/buyout/BuyoutHero'
import { useBuyoutOfferModalStore } from 'src/store/buyout/buyout-offer-modal.store'
import { useBuyoutHowDoesItWorkModalStore } from 'src/store/buyout/buyout-how-does-it-work-modal.store'
import BuyoutOfferModal from 'src/components/buyout/BuyoutOfferModal'
import BuyoutHowDoesItWorkModal from 'src/components/buyout/BuyoutHowDoesItWorkModal'
import { useBuyoutStore } from 'src/store/buyout/buyout.store'

const Home: NextPage<{ url: string }> = ({ url }) => {
  const { setBidModalOpen, isBidModalOpen } = useAppStore()
  const { isLive, wereAllNounletsAuctioned, isGovernanceEnabled } = useVaultStore()
  const { isLoading } = useBuyoutStore()

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
              <ModalBidHistory />
            </SimpleModalWrapper>
          </>
        )}

        {isLive && isGovernanceEnabled && <HomeLeaderboard />}
        {isLive && <HomeCollectiveOwnership />}
        <HomeWtf />
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
