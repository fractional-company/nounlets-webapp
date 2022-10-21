import { useEffect } from 'react'
import NounCollectiveOwnership from 'src/components/noun/NounCollectiveOwnership'
import NounLeaderboard from 'src/components/noun/NounLeaderboard'
import NounVotesFromNounlet from 'src/components/noun/NounVotesFromNounlet'
import NounWtf from 'src/components/noun/NounWtf'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
import { useNounStore } from 'src/store/noun.store'

export default function NounTabGeneral() {
  const { isLive, isGovernanceEnabled, wereAllNounletsAuctioned } = useNounStore()
  const { hasAuctionSettled } = useDisplayedNounlet()

  return (
    <div className="space-y-16">
      {isLive && hasAuctionSettled && !wereAllNounletsAuctioned && <NounVotesFromNounlet />}
      {isLive && isGovernanceEnabled && <NounLeaderboard />}
      {isLive && <NounCollectiveOwnership />}
      <NounWtf />
    </div>
  )
}
