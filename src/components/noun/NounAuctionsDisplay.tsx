import SimpleModalWrapper from 'src/components/common/simple/SimpleModalWrapper'
import ModalBidHistory from 'src/components/modals/ModalBidHistory'
import NounCollectiveOwnership from 'src/components/noun/NounCollectiveOwnership'
import NounHero from 'src/components/noun/NounHero'
import NounLeaderboard from 'src/components/noun/NounLeaderboard'
import NounVotesFromNounlet from 'src/components/noun/NounVotesFromNounlet'
import NounWtf from 'src/components/noun/NounWtf'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
import { useAppStore } from 'src/store/application'
import { useNounStore } from 'src/store/noun.store'

export function NounAuctionsDisplay() {
  const { setBidModalOpen, isBidModalOpen } = useAppStore()
  const { isLive, isGovernanceEnabled } = useNounStore()
  const { hasAuctionSettled } = useDisplayedNounlet()

  return (
    <>
      <SimpleModalWrapper
        className="md:!w-[600px] !max-w-[600px]"
        onClose={() => setBidModalOpen(false)}
        isShown={isBidModalOpen}
      >
        <ModalBidHistory />
      </SimpleModalWrapper>

      <NounHero />
      {isLive && hasAuctionSettled && <NounVotesFromNounlet />}
      {isLive && isGovernanceEnabled && <NounLeaderboard />}
      {isLive && <NounCollectiveOwnership />}
      <NounWtf />
    </>
  )
}
