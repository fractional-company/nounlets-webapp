import Link from 'next/link'
import Button from 'src/components/common/buttons/Button'
import GovernanceCurrentDelegate from 'src/components/governance/GovernanceCurrentDelegate'
import GovernanceLeaderboard from 'src/components/governance/GovernanceLeaderboard'
import { useNounStore } from 'src/store/noun.store'

export default function NounTabVote() {
  const { isLive, latestNounletTokenId } = useNounStore()

  return (
    <div className="page-governance lg:container mx-auto w-screen">
      <div className="px-4 md:px-12 lg:px-4">
        <h1 className="text-px32 font-londrina leading-[38px]">Vote for a delegate</h1>

        {!isLive || latestNounletTokenId === '1' ? (
          <>
            <p className="font-500 text-px20 leading-px28 text-gray-4 mt-6">
              The governance page has no activity yet, since the auction for the first Nounlet did
              not finish yet. Check back soon!
            </p>
            <Link href={'/'}>
              <Button className="primary mt-6">Go to auction</Button>
            </Link>
          </>
        ) : (
          <>
            <p className="font-500 text-px20 leading-px28 text-gray-4 mt-6">
              All Nounlet owners will be able to vote on a delegate. The delegate will be elected
              on-chain in the Nouns contract. The selected delegate is the official representative
              to the NounsDAO on behalf of the underlying Noun. Each Nounlet has 1 vote on the
              delegate.
            </p>

            <GovernanceCurrentDelegate />

            <GovernanceLeaderboard />
          </>
        )}
      </div>
    </div>
  )
}