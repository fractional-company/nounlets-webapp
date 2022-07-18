import classNames from 'classnames'
import Button from 'components/buttons/button'
import IconUpdateDelegate from 'components/icons/icon-update-delegate'
import Image from 'next/image'
import userIcon from 'public/img/user-icon.jpg'
import { useMemo } from 'react'
import LeaderboardVotesDots from './leaderboard-votes-dots'

export type LeaderboardListTileProps = {
  isMe: boolean
  percentage: number
  walletAddress: string
  currentDelegateWalletAddress: string
  mostVotesWalletAddress: string
  numberOfOwnedNounlets: number
  numberOfVotes: number
  numberOfMyVotes?: number
}

export default function LeaderboardListTile(props: {
  data: LeaderboardListTileProps
}): JSX.Element {
  const {
    isMe,
    percentage,
    walletAddress,
    currentDelegateWalletAddress,
    mostVotesWalletAddress,
    numberOfOwnedNounlets,
    numberOfVotes,
    numberOfMyVotes
  } = props.data

  const percentageString = useMemo(() => {
    try {
      return parseFloat('' + percentage * 100).toFixed(0) + '%'
    } catch (e) {
      return '0%'
    }
  }, [percentage])

  const isDelegate = useMemo(
    () => currentDelegateWalletAddress === walletAddress,
    [currentDelegateWalletAddress, walletAddress]
  )
  const isUpdateDelegateActionShown = useMemo(() => {
    return (
      mostVotesWalletAddress === walletAddress && walletAddress !== currentDelegateWalletAddress
    )
  }, [walletAddress, currentDelegateWalletAddress, mostVotesWalletAddress])

  return (
    <div className="leaderboard-list-tile">
      <div
        className={classNames('border rounded-px16 px-4 py-4', {
          'border-gray-2': !isDelegate,
          'border-transparent outline-dashed outline-secondary-green': isDelegate
        })}
      >
        <div
          className="flex flex-col space-y-4 lg:grid lg:-mx-4 lg:space-y-0"
          style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
        >
          <div className="flex items-center flex-grow-1 overflow-hidden lg:flex-grow-0 lg:pl-4">
            <div
              className={classNames(
                'hidden lg:block text-px26 font-700 mr-2 leading-px32',
                isDelegate ? 'text-secondary-green' : 'text-gray-3'
              )}
            >
              {percentageString}
            </div>
            <Image
              src={userIcon}
              alt="icon"
              width="32"
              height="32"
              className="overflow-hidden rounded-full flex-shrink-0"
            />
            <p className="text-px20 leading-px20 font-700 ml-2 flex-1 truncate">{walletAddress}</p>
            {isMe && (
              <p className="text-px14 leading-px26 font-700 ml-2 border-2 border-t-secondary-blue text-secondary-blue px-3 rounded-px8">
                You
              </p>
            )}
            {isDelegate && (
              <p className="text-px14 leading-px30 font-700 ml-2 bg-secondary-green text-white px-3 rounded-px8">
                Delegate
              </p>
            )}
            {isUpdateDelegateActionShown && (
              <Button className="hidden lg:flex ml-2 items-center justify-center text-secondary-blue text-px18 font-700 border-2 border-transparent px-2 h-10 rounded-px10">
                <IconUpdateDelegate />
                <span className="ml-2">Update delegate</span>
              </Button>
            )}
          </div>

          {/* Display on mobile */}
          <div className="grid lg:hidden items-center grid-cols-3">
            <div
              className={classNames(
                'text-px26 font-700  mr-2 leading-px32',
                isDelegate ? 'text-secondary-green' : 'text-gray-3'
              )}
            >
              {percentageString}
            </div>
            <div className="text-right">
              <p className="text-px16 text-gray-4 font-500">Nounlets</p>
              <p className="text-px18 font-700">{numberOfOwnedNounlets}</p>
            </div>

            <div className="text-right">
              <p className="text-px16 text-gray-4 font-500">Votes</p>
              <div className="flex items-center justify-end">
                <LeaderboardVotesDots votes={numberOfMyVotes} />
                <p className="text-px18 font-700">{numberOfVotes}</p>
              </div>
            </div>
          </div>

          {/* Display on desktop */}
          <div className="hidden lg:flex items-center justify-end">
            <p className="text-px18 font-700">{numberOfOwnedNounlets}</p>
          </div>

          <div className="hidden lg:flex items-center justify-end">
            <LeaderboardVotesDots votes={numberOfMyVotes} />
            <p className="text-px18 font-700">{numberOfVotes}</p>
          </div>

          {isUpdateDelegateActionShown && (
            <Button className="flex lg:hidden items-center justify-center text-secondary-blue text-px18 font-700 border-2 border-secondary-blue px-2 h-10 rounded-px10">
              <IconUpdateDelegate />
              <span className="ml-2">Update delegate</span>
            </Button>
          )}

          <div className="flex lg:justify-end lg:pr-4">
            <Button className="primary --sm flex-auto lg:flex-none">
              <span>Cast Votes</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
