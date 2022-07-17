import LeaderboardListTile from 'components/leaderboard/leaderboard-list-tile'

export default function HomeLeaderboard(): JSX.Element {
  return (
    <div className="home-leaderboard lg:container mx-auto xl:max-w-7xl">
      <div className="p-4 md:p-12">
        <div className="grid grid-cols-3 items-end">
          <h3 className="text-px32 leading-[38px] font-londrina">Leaderboard</h3>
          <h4 className="text-px18 leading-px22 text-gray-4 font-500">Nounlets</h4>
          <h4 className="text-px18 leading-px22 text-gray-4 font-500">Votes</h4>
        </div>
        <div className="leaderboard-list mt-8">
          <LeaderboardListTile />
        </div>
      </div>
    </div>
  )
}
