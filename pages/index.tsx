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

/*
Token ID    | Vault
0           | 0xba9e59afaee607782245bb78f6b93c89b070e855
*/

const Home: NextPage<{ vault: any }> = ({ vault }: { vault: any }) => {
  const { setBidModalOpen, isBidModalOpen } = useAppStore()
  const { isLive } = useVaultStore()

  const { isLatestNounlet } = useDisplayedNounlet()

  return (
    <div className="page-home w-screen">
      <SimpleModalWrapper onClose={() => setBidModalOpen(false)} isShown={isBidModalOpen}>
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

export default Home
