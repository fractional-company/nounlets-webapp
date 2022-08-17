import Button from 'components/buttons/button'
import LeaderboardListTile, {
  LeaderboardListTileProps
} from 'components/leaderboard/leaderboard-list-tile'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuctionStateStore } from 'store/auctionStateStore'

export default function HomeLeaderboard(): JSX.Element {
  const router = useRouter()
  const { isBeforeLaunch } = useAuctionStateStore()

  const myWalletAddress = '0x497F34f8A6EaB10652f846fD82201938e58d72E0'
  const currentDelegateWalletAddress = '0x497F34f8A6EaB10652f846fD82201938e58d72E0'
  const mostVotesWalletAddress = '0x431863c96403aD96d343D87cc47D61CC1F299e51'
  const leaderboardMocks: LeaderboardListTileProps[] = [
    {
      isMe: false,
      percentage: 0.7,
      walletAddress: mostVotesWalletAddress,
      currentDelegateWalletAddress,
      mostVotesWalletAddress,
      numberOfOwnedNounlets: 40,
      numberOfVotes: 70,
      numberOfMyVotes: 25
    },
    {
      isMe: true,
      percentage: 0.24,
      walletAddress: '0x497F34f8A6EaB10652f846fD82201938e58d72E0',
      currentDelegateWalletAddress,
      mostVotesWalletAddress,
      numberOfOwnedNounlets: 30,
      numberOfVotes: 24,
      numberOfMyVotes: 5
    },
    {
      isMe: false,
      percentage: 0.06,
      walletAddress: '0x6d2343bEecEd0E805f3ccCfF870ccB974B5795E6',
      currentDelegateWalletAddress,
      mostVotesWalletAddress,
      numberOfOwnedNounlets: 30,
      numberOfVotes: 6,
      numberOfMyVotes: 0
    }
  ]

  if (isBeforeLaunch) {
    return (
      <div className="home-leaderboard lg:container mx-auto">
        <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16">
          <h3 className="text-px32 font-londrina">Leaderboard</h3>

          <p className="text-px20 leading-px28 text-gray-4 mt-6 lg:mt-16">
            The leaderboard has no activity yet, since the auction for the first Nounlet did not
            finish yet. Check back soon!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="home-leaderboard lg:container mx-auto">
      <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16">
        <div
          className="lg:grid leading-[38px]"
          style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
        >
          <h3 className="text-px32 font-londrina">Leaderboard</h3>
          <h4 className="hidden lg:block text-right text-px18 text-gray-4 font-500">Nounlets</h4>
          <h4 className="hidden lg:block text-right text-px18 text-gray-4 font-500">Votes</h4>
          <div className="hidden lg:block"></div>
        </div>
        <div className="leaderboard-list mt-8 space-y-2">
          {leaderboardMocks.map((data, index) => (
            <LeaderboardListTile key={index} data={data} />
          ))}
          <Link href="/governance">
            <Button className="border border-gray-2 hover:border-secondary-blue h-12 sm:h-[74px] rounded-px16 text-secondary-blue w-full text-px20 font-700">
              See full leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
