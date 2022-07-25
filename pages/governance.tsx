import SimplePopover from 'components/simple-popover'
import { NextPage } from 'next'
import Image from 'next/image'
import userIcon from 'public/img/user-icon.jpg'
import nounletIcon from 'public/img/nounlet.png'
import Button from 'components/buttons/button'
import LeaderboardListTile, {
  LeaderboardListTileProps
} from 'components/leaderboard/leaderboard-list-tile'
import IconMagnify from 'components/icons/icon-magnify'
import IconQuestionCircle from 'components/icons/icon-question-circle'
import { useState } from 'react'
import VoteForDelegateModal from 'components/modals/vote-for-delegate-modal'
import VoteForCustomWalletModal from 'components/modals/vote-for-custom-wallet.modal'

const Governance: NextPage = () => {
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

  const [isVoteForDelegateModalShown, setIsVoteForDelegateModalShown] = useState(false)

  return (
    <div className="page-governance lg:container mx-auto w-screen">
      <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16">
        <h4 className="font-londrina text-px24 leading-px36 text-gray-4">Governance</h4>
        <h1 className="font-londrina text-[56px] leading-[68px] mt-3">Vote for a delegate</h1>
        <p className="font-500 text-px20 leading-px28 text-gray-4 mt-6">
          All Nounlet owners will be able to vote on a delegate. The delegate will be elected
          on-chain in the Nouns contract. The active delegate will be able to join the official
          nouns-private discord channel, vote in governance and submit governance proposals. Each
          Nounlet has 1 vote on the delegate.
        </p>

        <div className="mt-10 border rounded-px16 p-4 lg:p-8 border-gray-2">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col flex-1">
              <div className="flex flex-col xs:flex-row items-center xs:gap-3">
                <p className="font-londrina text-px24 text-gray-4 leading-px36">Current delegate</p>

                <div className="flex items-center">
                  <SimplePopover>
                    <h1 className="font-700 text-px18 text-gray-4">
                      <span className="text-secondary-orange">⚠</span> Out of sync
                    </h1>
                    <div>
                      This delegate is currently out of sync. There is another wallet with more
                      votes. You can update the delegate with a transaction.
                    </div>
                  </SimplePopover>

                  <p className="font-700 text-px18 text-secondary-blue ml-2">Update</p>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <div className="overflow-hidden rounded-full flex-shrink-0 w-10 h-10">
                  <Image src={userIcon} alt="icon" width="40" height="40" />
                </div>
                <p className="text-px36 font-londrina leading-px42 ml-3 truncate">
                  hot.gabrielayusogabrielayuso.eth
                </p>
              </div>
            </div>

            <div className="hidden lg:block lg:-my-8 border-r border-gray-2"></div>

            <div className="flex flex-col lg:max-w-[300px]">
              <div className="flex flex-col xs:flex-row items-center xs:gap-3">
                <p className="font-londrina text-px24 text-gray-4 leading-px36">My nounlets</p>

                <div className="flex items-center">
                  <SimplePopover>
                    <h1 className="font-700 text-px18 text-gray-4">
                      <span className="text-secondary-orange">⚠</span> Multiple votes
                    </h1>
                    <div>
                      Your nounlets are voting for multiple addresses. We recommend you update your
                      votes to only be for one address.
                    </div>
                  </SimplePopover>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <p className="text-px36 font-londrina leading-px42 mr-3 truncate w-10 text-center flex-shrink-0">
                  8
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="overflow-hidden rounded-sm flex-shrink-0 w-10 h-10">
                    <Image src={nounletIcon} alt="icon" width="40" height="40" />
                  </div>
                  <div className="overflow-hidden rounded-sm flex-shrink-0 w-10 h-10">
                    <Image src={nounletIcon} alt="icon" width="40" height="40" />
                  </div>
                  <div className="overflow-hidden rounded-sm flex-shrink-0 w-10 h-10">
                    <Image src={nounletIcon} alt="icon" width="40" height="40" />
                  </div>
                  <div className="overflow-hidden rounded-sm flex-shrink-0 w-10 h-10">
                    <Image src={nounletIcon} alt="icon" width="40" height="40" />
                  </div>
                  <div className="overflow-hidden rounded-sm flex-shrink-0 w-10 h-10">
                    <Image src={nounletIcon} alt="icon" width="40" height="40" />
                  </div>
                  <div className="overflow-hidden rounded-sm flex-shrink-0 w-10 h-10">
                    <Image src={nounletIcon} alt="icon" width="40" height="40" />
                  </div>
                  <div className="overflow-hidden rounded-sm flex-shrink-0 w-10 h-10">
                    <Image src={nounletIcon} alt="icon" width="40" height="40" />
                  </div>
                  <div className="overflow-hidden rounded-sm flex-shrink-0 w-10 h-10">
                    <Image src={nounletIcon} alt="icon" width="40" height="40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="leaderboard mt-14">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <h2 className="font-londrina text-[40px] leading-[47px] flex-1">Leaderboard</h2>
            <div className="flex flex-col xs:flex-row items-center gap-2">
              <p className="font-500 text-px14 text-gray-3">Connect wallet to cast a vote</p>
              <Button className="primary --sm">Connect wallet</Button>
            </div>
          </div>

          <div
            className="lg:grid leading-[38px] mt-10"
            style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
          >
            <div className="flex">
              <div className="flex items-center focus-within:outline-dashed rounded-px10 px-2 gap-2 w-full lg:w-10/12">
                <IconMagnify className="w-5 h-5 flex-shrink-0" />
                <input
                  className="outline-none font-500 text-px20 flex-1"
                  type="text"
                  placeholder="Search by wallet or ENS"
                />
              </div>
            </div>
            <h4 className="hidden lg:block text-right text-px18 text-gray-4 font-500">Nounlets</h4>
            <div className="hidden lg:flex items-center justify-end text-px18 text-gray-4 font-500">
              <span className="mr-1">Votes</span>
              <SimplePopover>
                <IconQuestionCircle className="text-gray-3" />
                <div>Total power that this wallet has.</div>
              </SimplePopover>
            </div>
            <div className="hidden lg:block"></div>
          </div>

          <div className="leaderboard-list mt-8 space-y-2">
            {leaderboardMocks.map((data, index) => (
              <LeaderboardListTile key={index} data={data} />
            ))}

            <Button
              onClick={() => setIsVoteForDelegateModalShown(true)}
              className="border border-gray-2 hover:border-secondary-blue h-12 sm:h-[74px] rounded-px16 text-secondary-blue w-full text-px20 font-700"
            >
              Vote for a custom wallet
            </Button>
          </div>
        </div>
      </div>
      <>
        <VoteForCustomWalletModal
          isShown={isVoteForDelegateModalShown}
          onClose={() => setIsVoteForDelegateModalShown(false)}
        />
      </>
    </div>
  )
}

export default Governance
