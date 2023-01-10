import Button from 'src/components/common/buttons/Button'
import IconSpinner from 'src/components/common/icons/IconSpinner'
import LeaderboardListTile from 'src/components/leaderboard/LeaderboardListTile'
import SimplePopover from 'src/components/common/simple/SimplePopover'
import useLeaderboard from 'src/hooks/useLeaderboard'
import Link from 'next/link'
import { useMemo } from 'react'
import { useNounStore } from 'src/store/noun.store'

export default function NounLeaderboard(): JSX.Element {
  const { latestNounletTokenId, setTabIndex } = useNounStore()
  const { isOutOfSync, leaderboardData } = useLeaderboard()

  const leaderboardListData = useMemo(() => {
    return leaderboardData.list.slice(0, 3)
  }, [leaderboardData])

  const hasFirstAuctionSettled = latestNounletTokenId !== '0' && latestNounletTokenId !== '1'
  return (
    <div className="noun-leaderboard mx-auto lg:container">
      <div className="px-4 md:px-12 lg:px-4">
        <div
          className="leading-[38px] lg:grid"
          style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
        >
          <div className="flex items-center gap-3">
            <h3 className="font-londrina text-[24px] leading-[38px] lg:text-[32px]">Leaderboard</h3>
            {isOutOfSync && (
              <SimplePopover>
                <IconSpinner className="h-6 animate-spin" />
                <div>Leaderboard is syncing.</div>
              </SimplePopover>
            )}
          </div>
          {hasFirstAuctionSettled && (
            <>
              <h4 className="hidden text-right text-px18 font-500 text-gray-4 lg:block">
                Nounlets
              </h4>
              <h4 className="hidden text-right text-px18 font-500 text-gray-4 lg:block">Votes</h4>
              <div className="hidden lg:block"></div>
            </>
          )}
        </div>
        {hasFirstAuctionSettled ? (
          <div className="leaderboard-list mt-8 space-y-2">
            {leaderboardListData.map((data, index) => (
              <LeaderboardListTile key={index} data={data} />
            ))}

            <Button
              className="h-12 w-full rounded-px16 border-2 border-gray-2 text-px20 font-700 text-secondary-blue hover:border-secondary-blue sm:h-[74px]"
              onClick={() => {
                setTabIndex(1)
              }}
            >
              See full leaderboard
            </Button>
          </div>
        ) : (
          <div>
            <p className="mt-6 text-px20 font-500 leading-px28 text-gray-4">
              The leaderboard has no activity yet, since the auction for the first Nounlet did not
              finish yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
