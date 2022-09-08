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

/*
Token ID    | Vault
0           | 0xba9e59afaee607782245bb78f6b93c89b070e855
*/

const Home: NextPage<{ url: string }> = ({ url }) => {
  const { setBidModalOpen, isBidModalOpen } = useAppStore()
  const { isLive } = useVaultStore()

  const { isLatestNounlet } = useDisplayedNounlet()

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
        className="md:w-[600px] !max-w-[600px]"
        onClose={() => setBidModalOpen(false)}
        isShown={isBidModalOpen}
      >
        <BidHistoryModal />
      </SimpleModalWrapper>
      <div className="space-y-16">
        <HomeHero />
        {isLive && (isLatestNounlet ? <HomeLeaderboard /> : <HomeVotesFromNounlet />)}
        {isLive && isLatestNounlet && <HomeCollectiveOwnership />}
        <HomeWTF />
      </div>
    </div>
  )
}

export const getServerSideProps = (context: any) => {
  return {
    props: {
      url: context?.req?.headers?.host
    }
  }
}

export default Home
