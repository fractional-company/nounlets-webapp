import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import Button from 'src/components/common/buttons/Button'
import IconUpdateDelegate from 'src/components/common/icons/IconUpdateDelegate'
import SimpleAddress from 'src/components/common/simple/SimpleAddress'
import { ethers } from 'ethers'
import useLeaderboard from 'src/hooks/useLeaderboard'
import useSdk from 'src/hooks/utils/useSdk'
import useToasts from 'src/hooks/utils/useToasts'
import { WrappedTransactionReceiptState } from 'src/lib/utils/txWithErrorHandling'
import { useMemo, useState } from 'react'
import { useAppStore } from 'src/store/application.store'
import { useBlockNumberCheckpointStore } from 'src/store/blockNumberCheckpointStore.store'
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
        className={classNames('rounded-px16 border-2 px-4 py-4', {
          'border-gray-2': !isDelegate,
          'border-transparent outline-dashed outline-[3px] outline-secondary-green': isDelegate
        })}
      >
        <div
          className="flex min-h-[40px] flex-col space-y-4 lg:-mx-4 lg:grid lg:space-y-0"
          style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
        >
          <div className="flex-grow-1 flex items-center overflow-hidden lg:flex-grow-0 lg:pl-4">
            <div
              className={classNames(
                'mr-4 hidden text-px26 font-700 leading-px32 lg:block',
                isDelegate ? 'text-secondary-green' : 'text-gray-3'
              )}
            >
              {percentageString}
            </div>
            <SimpleAddress
              avatarSize={32}
              address={walletAddress}
              className="gap-4 text-px18 font-700 leading-px28"
            />
            {isMe && (
              <p className="ml-4 rounded-px8 border-2 border-t-secondary-blue px-3 text-px14 font-700 leading-px26 text-secondary-blue">
                You
              </p>
            )}
            {isDelegate && (
              <p className="ml-4 rounded-px8 bg-secondary-green px-3 text-px14 font-700 leading-px30 text-white">
                Delegate
              </p>
            )}
            {isUpdateDelegateActionShown && (
              <Button
                loading={isClaiming}
                onClick={() => handleClaimDelegate(walletAddress)}
                className="ml-4 hidden h-10 items-center justify-center rounded-px10 border-2 border-transparent text-px18 font-700 text-secondary-blue hover:text-secondary-green lg:flex"
              >
                <IconUpdateDelegate />
                <span className="ml-2">Update delegate</span>
              </Button>
            )}
          </div>

          {/* Display on mobile */}
          <div className="grid grid-cols-3 items-center lg:hidden">
            <div
              className={classNames(
                'mr-2 text-px26  font-700 leading-px32',
                isDelegate ? 'text-secondary-green' : 'text-gray-3'
              )}
            >
              {percentageString}
            </div>
            <div className="text-right">
              <p className="text-px16 font-500 text-gray-4">Nounlets</p>
              <p className="text-px18 font-700">{numberOfOwnedNounlets}</p>
            </div>

            <div className="text-right">
              <p className="text-px16 font-500 text-gray-4">Votes</p>
              <div className="flex items-center justify-end">
                <LeaderboardVotesDots votes={numberOfMyVotes} />
                <p className="text-px18 font-700">{numberOfVotes}</p>
              </div>
            </div>
          </div>

          {/* Display on desktop */}
          <div className="hidden items-center justify-end lg:flex">
            <p className="text-px18 font-700">{numberOfOwnedNounlets}</p>
          </div>

          <div className="hidden items-center justify-end lg:flex">
            <LeaderboardVotesDots votes={numberOfMyVotes} />
            <p className="text-px18 font-700">{numberOfVotes}</p>
          </div>

          {isUpdateDelegateActionShown && (
            <Button
              loading={isClaiming}
              onClick={() => handleClaimDelegate(walletAddress)}
              className="flex h-10 items-center justify-center rounded-px10 border-2 border-secondary-blue px-2 text-px18 font-700 text-secondary-blue lg:hidden"
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
        className={classNames('rounded-px16 border-2 px-4 py-4', {
          'border-transparent outline-dashed outline-[3px] outline-secondary-red': true
        })}
      >
        <div
          className="flex min-h-[40px] flex-col space-y-4 lg:-mx-4 lg:grid lg:space-y-0"
          style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
        >
          <div className="flex-grow-1 flex items-center overflow-hidden lg:flex-grow-0 lg:pl-4">
            <div
              className={classNames(
                'mr-4 hidden text-px26 font-700 leading-px32 text-secondary-red lg:block'
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
          <div className="grid grid-cols-3 items-center lg:hidden">
            <div className={classNames('mr-2 text-px26  font-700 leading-px32 text-secondary-red')}>
              {props.percentageString}
            </div>
            <div className="text-right">
              <p className="text-px16 font-500 text-gray-4">Nounlets</p>
              <p className="text-px18 font-700">{props.numberOfOwnedNounlets}</p>
            </div>

            <div className="text-right">
              <p className="text-px16 font-500 text-gray-4">Votes</p>
              <div className="flex items-center justify-end">
                <p className="text-px18 font-700">🔥</p>
              </div>
            </div>
          </div>

          {/* Display on desktop */}
          <div className="hidden items-center justify-end lg:flex">
            <p className="text-px18 font-700">{props.numberOfOwnedNounlets}</p>
          </div>

          <div className="hidden items-center justify-end lg:flex">
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
        className={classNames('rounded-px16 border-2 px-4 py-4', {
          'border-transparent outline-dashed outline-[3px] outline-secondary-oranger': true
        })}
      >
        <div
          className="flex min-h-[40px] flex-col space-y-4 lg:-mx-4 lg:grid lg:space-y-0"
          style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
        >
          <div className="flex-grow-1 flex items-center overflow-hidden lg:flex-grow-0 lg:pl-4">
            <div
              className={classNames(
                'mr-4 hidden text-px26 font-700 leading-px32 text-secondary-oranger lg:block'
              )}
            >
              {props.percentageString}
            </div>
            <div className="text-px26 font-700 text-secondary-oranger">Chillin in offer ⛱</div>
          </div>

          {/* Display on mobile */}
          <div className="grid grid-cols-3 items-center lg:hidden">
            <div
              className={classNames('mr-2 text-px26  font-700 leading-px32 text-secondary-oranger')}
            >
              {props.percentageString}
            </div>
            <div className="text-right">
              <p className="text-px16 font-500 text-gray-4">Nounlets</p>
              <p className="text-px18 font-700">{props.numberOfOwnedNounlets}</p>
            </div>

            <div className="text-right">
              <p className="text-px16 font-500 text-gray-4">Votes</p>
              <div className="flex items-center justify-end">
                <p className="text-px18 font-700">🕶</p>
              </div>
            </div>
          </div>

          {/* Display on desktop */}
          <div className="hidden items-center justify-end lg:flex">
            <p className="text-px18 font-700">{props.numberOfOwnedNounlets}</p>
          </div>

          <div className="hidden items-center justify-end lg:flex">
            <p className="text-px18 font-700">🕶</p>
          </div>
        </div>
      </div>
    </div>
  )
}
