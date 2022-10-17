import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import Button from 'src/components/common/buttons/Button'
import IconUpdateDelegate from 'src/components/common/icons/IconUpdateDelegate'
import SimpleAddress from 'src/components/common/simple/SimpleAddress'
import { ethers } from 'ethers'
import useLeaderboard from 'src/hooks/useLeaderboard'
import useSdk from 'src/hooks/useSdk'
import useToasts from 'src/hooks/useToasts'
import { WrappedTransactionReceiptState } from 'src/lib/utils/tx-with-error-handling'
import { useMemo, useState } from 'react'
import { useAppStore } from 'src/store/application'
import { useBlockNumberCheckpointStore } from 'src/store/blockNumberCheckpointStore'
import LeaderboardVotesDots from './LeaderboardVotesDots'

export type LeaderboardListTileProps = {
  isMe: boolean
  isDelegate: boolean
  isDelegateCandidate: boolean
  walletAddress: string
  percentage: number
  numberOfOwnedNounlets: number
  numberOfVotes: number
  numberOfMyVotes?: number
  canIVote: boolean
}

export default function LeaderboardListTile(props: {
  data: LeaderboardListTileProps
}): JSX.Element {
  const sdk = useSdk()
  const { account } = useEthers()
  const { claimVaultDelegate, claimNounsDelegate, mostVotesAcc } = useLeaderboard()
  const { setVoteForDelegateModalForAddress, setConnectModalOpen } = useAppStore()
  const { toastSuccess, toastError, toastInfo } = useToasts()
  const { setLeaderboardBlockNumber } = useBlockNumberCheckpointStore()
  const {
    isMe,
    isDelegate,
    isDelegateCandidate,
    walletAddress,
    percentage,
    numberOfOwnedNounlets,
    numberOfVotes,
    numberOfMyVotes,
    canIVote
  } = props.data
  const [isClaiming, setIsClaiming] = useState(false)

  const percentageString = useMemo(() => {
    try {
      return parseFloat('' + percentage * 100).toFixed(0) + '%'
    } catch (e) {
      return '0%'
    }
  }, [percentage])

  const isUpdateDelegateActionShown = useMemo(() => {
    return isDelegateCandidate
  }, [isDelegateCandidate])

  const handleCastVote = (address: string) => {
    if (account == null) {
      setConnectModalOpen(true)
      return
    }
    setVoteForDelegateModalForAddress(true, address)
  }

  const handleClaimDelegate = async (address: string) => {
    if (account == null) {
      setConnectModalOpen(true)
      return
    }

    setIsClaiming(true)
    try {
      const response = await claimVaultDelegate(address)

      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        if (response?.receipt?.blockNumber != null) {
          setLeaderboardBlockNumber(response.receipt.blockNumber)
        }
        toastSuccess('Delegate updated 👑', 'Leaderboard will refresh momentarily.')
        await handleClaimNounsDelegate()
      } else if (response.status === WrappedTransactionReceiptState.ERROR) {
        throw response.data
      } else if (response.status === WrappedTransactionReceiptState.CANCELLED) {
        toastError('Transaction canceled', 'Please try again.')
      }
    } catch (error) {
      toastError('Update delegate failed', 'Please try again.')
    } finally {
      setIsClaiming(false)
    }
  }

  const handleClaimNounsDelegate = async () => {
    if (account == null) {
      setConnectModalOpen(true)
      return
    }

    try {
      if (account.toLowerCase() === mostVotesAcc.address) {
        toastInfo(
          'Hey delegate!',
          'Please sign the next transaction in order to vote in NounsDao.',
          10000
        )
        const response = await claimNounsDelegate(mostVotesAcc.address)

        if (
          response.status === WrappedTransactionReceiptState.SUCCESS ||
          response.status === WrappedTransactionReceiptState.SPEDUP
        ) {
          toastSuccess('Congrats', 'You can now vote on proposals on behalf of the Noun!')
        } else if (response.status === WrappedTransactionReceiptState.ERROR) {
          throw response.data
        } else if (response.status === WrappedTransactionReceiptState.CANCELLED) {
          toastError('Transaction canceled', 'Please try again.')
        }
      }
    } catch (error) {
      toastError('Update Nouns delegate failed', 'Please try again.')
    }
  }

  // Special cases
  // Optimistic bid holding nounlets during buyout

  const isOptimisticBidAddress = useMemo(() => {
    return walletAddress.toLowerCase() === sdk?.OptimisticBid.address.toLowerCase()
  }, [walletAddress, sdk])

  // Zero address burning nounlets

  const isZeroAddress = useMemo(() => {
    return walletAddress.toLowerCase() === ethers.constants.AddressZero.toLowerCase()
  }, [walletAddress])

  if (isZeroAddress) {
    return ZeroAddressTile({ percentageString, numberOfOwnedNounlets, numberOfVotes })
  }

  if (isOptimisticBidAddress) {
    return OptimisticBidTile({ percentageString, numberOfOwnedNounlets, numberOfVotes })
  }

  return (
    <div className="leaderboard-list-tile">
      <div
        className={classNames('border-2 rounded-px16 px-4 py-4', {
          'border-gray-2': !isDelegate,
          'border-transparent outline-[3px] outline-dashed outline-secondary-green': isDelegate
        })}
      >
        <div
          className="flex flex-col space-y-4 lg:grid lg:-mx-4 lg:space-y-0 min-h-[40px]"
          style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
        >
          <div className="flex items-center flex-grow-1 overflow-hidden lg:flex-grow-0 lg:pl-4">
            <div
              className={classNames(
                'hidden lg:block text-px26 font-700 mr-4 leading-px32',
                isDelegate ? 'text-secondary-green' : 'text-gray-3'
              )}
            >
              {percentageString}
            </div>
            <SimpleAddress
              avatarSize={32}
              address={walletAddress}
              className="text-px18 leading-px28 font-700 gap-4"
            />
            {isMe && (
              <p className="text-px14 leading-px26 font-700 ml-4 border-2 border-t-secondary-blue text-secondary-blue px-3 rounded-px8">
                You
              </p>
            )}
            {isDelegate && (
              <p className="text-px14 leading-px30 font-700 ml-4 bg-secondary-green text-white px-3 rounded-px8">
                Delegate
              </p>
            )}
            {isUpdateDelegateActionShown && (
              <Button
                loading={isClaiming}
                onClick={() => handleClaimDelegate(walletAddress)}
                className="hidden lg:flex ml-4 items-center justify-center text-secondary-blue hover:text-secondary-green text-px18 font-700 border-2 border-transparent h-10 rounded-px10"
              >
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
            <Button
              loading={isClaiming}
              onClick={() => handleClaimDelegate(walletAddress)}
              className="flex lg:hidden items-center justify-center text-secondary-blue text-px18 font-700 border-2 border-secondary-blue px-2 h-10 rounded-px10"
            >
              <IconUpdateDelegate />
              <span className="ml-2">Update delegate</span>
            </Button>
          )}

          {canIVote && (
            <div className="flex lg:justify-end lg:pr-4">
              <Button
                className="primary --sm flex-auto lg:flex-none"
                onClick={() => handleCastVote(walletAddress)}
              >
                <span>Cast Votes</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ZeroAddressTile(props: {
  percentageString: string
  numberOfOwnedNounlets: number
  numberOfVotes: number
}) {
  return (
    <div className="leaderboard-list-tile">
      <div
        className={classNames('border-2 rounded-px16 px-4 py-4', {
          'border-transparent outline-[3px] outline-dashed outline-secondary-red': true
        })}
      >
        <div
          className="flex flex-col space-y-4 lg:grid lg:-mx-4 lg:space-y-0 min-h-[40px]"
          style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
        >
          <div className="flex items-center flex-grow-1 overflow-hidden lg:flex-grow-0 lg:pl-4">
            <div
              className={classNames(
                'hidden lg:block text-px26 font-700 mr-4 leading-px32 text-secondary-red'
              )}
            >
              {props.percentageString}
            </div>
            <div className="flex flex-col items-start text-secondary-red">
              <p className="text-px26 font-700 leading-px20">
                BUUUUUURN<span className="text-px14">ed</span>
                <span className="text-px20">🔥</span>
              </p>
              <p className="text-px12 font-700">(for the greater good)</p>
            </div>
          </div>

          {/* Display on mobile */}
          <div className="grid lg:hidden items-center grid-cols-3">
            <div className={classNames('text-px26 font-700  mr-2 leading-px32 text-secondary-red')}>
              {props.percentageString}
            </div>
            <div className="text-right">
              <p className="text-px16 text-gray-4 font-500">Nounlets</p>
              <p className="text-px18 font-700">{props.numberOfOwnedNounlets}</p>
            </div>

            <div className="text-right">
              <p className="text-px16 text-gray-4 font-500">Votes</p>
              <div className="flex items-center justify-end">
                <p className="text-px18 font-700">🔥</p>
              </div>
            </div>
          </div>

          {/* Display on desktop */}
          <div className="hidden lg:flex items-center justify-end">
            <p className="text-px18 font-700">{props.numberOfOwnedNounlets}</p>
          </div>

          <div className="hidden lg:flex items-center justify-end">
            <p className="text-px18 font-700">🔥</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function OptimisticBidTile(props: {
  percentageString: string
  numberOfOwnedNounlets: number
  numberOfVotes: number
}) {
  return (
    <div className="leaderboard-list-tile">
      <div
        className={classNames('border-2 rounded-px16 px-4 py-4', {
          'border-transparent outline-[3px] outline-dashed outline-secondary-oranger': true
        })}
      >
        <div
          className="flex flex-col space-y-4 lg:grid lg:-mx-4 lg:space-y-0 min-h-[40px]"
          style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
        >
          <div className="flex items-center flex-grow-1 overflow-hidden lg:flex-grow-0 lg:pl-4">
            <div
              className={classNames(
                'hidden lg:block text-px26 font-700 mr-4 leading-px32 text-secondary-oranger'
              )}
            >
              {props.percentageString}
            </div>
            <div className="text-px26 font-700 text-secondary-oranger">Chillin in offer ⛱</div>
          </div>

          {/* Display on mobile */}
          <div className="grid lg:hidden items-center grid-cols-3">
            <div
              className={classNames('text-px26 font-700  mr-2 leading-px32 text-secondary-oranger')}
            >
              {props.percentageString}
            </div>
            <div className="text-right">
              <p className="text-px16 text-gray-4 font-500">Nounlets</p>
              <p className="text-px18 font-700">{props.numberOfOwnedNounlets}</p>
            </div>

            <div className="text-right">
              <p className="text-px16 text-gray-4 font-500">Votes</p>
              <div className="flex items-center justify-end">
                <p className="text-px18 font-700">🕶</p>
              </div>
            </div>
          </div>

          {/* Display on desktop */}
          <div className="hidden lg:flex items-center justify-end">
            <p className="text-px18 font-700">{props.numberOfOwnedNounlets}</p>
          </div>

          <div className="hidden lg:flex items-center justify-end">
            <p className="text-px18 font-700">🕶</p>
          </div>
        </div>
      </div>
    </div>
  )
}
