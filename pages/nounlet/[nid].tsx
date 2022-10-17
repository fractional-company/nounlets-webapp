import HomeCollectiveOwnership from 'src/components/home/HomeCollectiveOwnership'
import HomeHero from 'src/components/home/HomeHero'
import HomeLeaderboard from 'src/components/home/HomeLeaderboard'
import HomeVotesFromNounlet from 'src/components/home/HomeVotesFromNounlet'
import HomeWtf from 'src/components/home/HomeWtf'
import ModalBidHistory from 'src/components/modals/ModalBidHistory'
import SEO from 'src/components/SEO'
import SimpleModalWrapper from 'src/components/common/simple/SimpleModalWrapper'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
import { NextPage } from 'next'
import { useAppStore } from 'src/store/application'
import { useVaultStore } from 'src/store/vaultStore'
import Home from '../index'

const Nounlet: NextPage<{ url: string }> = ({ url }) => {
  const { setBidModalOpen, isBidModalOpen } = useAppStore()
  const { isLive, isGovernanceEnabled } = useVaultStore()
  const { hasAuctionSettled } = useDisplayedNounlet()

  return (
    <div className="page-home w-screen">
      <SEO
        url={`${url}`}
        openGraphType="website"
        title="Nounlets"
        description="Own a noun together with Nounlets"
        image={`${url}/img/noun.jpg`}
      />
      <SimpleModalWrapper
        className="md:!w-[600px] !max-w-[600px]"
        onClose={() => setBidModalOpen(false)}
        isShown={isBidModalOpen}
      >
        <ModalBidHistory />
      </SimpleModalWrapper>
      <div className="space-y-16">
        <HomeHero />
        {isLive && hasAuctionSettled && <HomeVotesFromNounlet />}
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

export default Nounlet
