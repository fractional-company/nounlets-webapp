import Button from 'src/components/common/buttons/Button'
import IconSpinner from 'src/components/common/icons/IconSpinner'
import LeaderboardListTile from 'src/components/leaderboard/LeaderboardListTile'
import SimplePopover from 'src/components/common/simple/SimplePopover'
import useLeaderboard from 'src/hooks/useLeaderboard'
import Link from 'next/link'
import { useMemo } from 'react'
import { useNounStore } from 'src/store/noun.store'
import { useVaultStore } from 'src/store/vaultStore'

export default function NounLeaderboard(): JSX.Element {
  const { latestNounletTokenId } = useNounStore()
  const { isOutOfSync, leaderboardData } = useLeaderboard()

  const leaderboardListData = useMemo(() => {
    return leaderboardData.list.slice(0, 3)
  }, [leaderboardData])

  const hasFirstAuctionSettled = latestNounletTokenId !== '0' && latestNounletTokenId !== '1'
  return (
    <div className="home-leaderboard lg:container mx-auto">
      <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16">
        <div
          className="lg:grid leading-[38px]"
          style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
        >
          <div className="flex items-center gap-3">
            <h3 className="text-px32 font-londrina">Leaderboard</h3>
            {isOutOfSync && (
              <SimplePopover>
                <IconSpinner className="animate-spin h-6" />
                <div>Leaderboard is syncing.</div>
              </SimplePopover>
            )}
          </div>
          {hasFirstAuctionSettled && (
            <>
              <h4 className="hidden lg:block text-right text-px18 text-gray-4 font-500">
                Nounlets
              </h4>
              <h4 className="hidden lg:block text-right text-px18 text-gray-4 font-500">Votes</h4>
              <div className="hidden lg:block"></div>
            </>
          )}
        </div>
        {hasFirstAuctionSettled ? (
          <div className="leaderboard-list mt-8 space-y-2">
            {leaderboardListData.map((data, index) => (
              <LeaderboardListTile key={index} data={data} />
            ))}
            <Link href="/governance">
              <Button className="border-2 border-gray-2 hover:border-secondary-blue h-12 sm:h-[74px] rounded-px16 text-secondary-blue w-full text-px20 font-700">
                See full leaderboard
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <p className="font-500 text-px20 leading-px28 text-gray-4 mt-6">
              The leaderboard has no activity yet, since the auction for the first Nounlet did not
              finish yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
