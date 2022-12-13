import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import Button from 'src/components/common/buttons/Button'
import { NounletImage } from 'src/components/common/NounletImage'
import SimpleAddress from 'src/components/common/simple/SimpleAddress'
import SimplePopover from 'src/components/common/simple/SimplePopover'
import useLeaderboard from 'src/hooks/useLeaderboard'
import useToasts from 'src/hooks/utils/useToasts'
import { WrappedTransactionReceiptState } from 'src/lib/utils/txWithErrorHandling'
import { useAppStore } from 'src/store/application.store'
import { useBlockNumberCheckpointStore } from 'src/store/blockNumberCheckpointStore.store'
import { useNounStore } from 'src/store/noun.store'

export default function GovernanceCurrentDelegate() {
  const { account } = useEthers()
  const { setConnectModalOpen } = useAppStore()
  const {
    currentDelegate,
    currentNounDelegate,
    isCurrentDelegateOutOfSyncOnVaultContract,
    isCurrentDelegateOutOfSyncOnNounContract
  } = useNounStore()
  const { myNounlets, myNounletsVotes, mostVotesAcc, claimNounsDelegate, claimVaultDelegate } =
    useLeaderboard()
  const { toastSuccess, toastError, toastInfo } = useToasts()
  const [isClaiming, setIsClaiming] = useState(false)
  const { setLeaderboardBlockNumber } = useBlockNumberCheckpointStore()

  const areMyVotesSplit = useMemo(() => {
    return Object.keys(myNounletsVotes).length > 1
  }, [myNounletsVotes])

  const currentDelegateRC = useMemo(() => {
    return currentDelegate === ethers.constants.AddressZero ? (
      <p className="text-px36 font-londrina leading-px42">no one :(</p>
    ) : (
      <SimpleAddress
        avatarSize={40}
        className="text-px36 font-londrina leading-px42 space-x-3"
        address={currentDelegate}
      />
    )
  }, [currentDelegate])

  const handleUpdateDelegate = async () => {
    if (account == null) {
      setConnectModalOpen(true)
      return
    }

    if (mostVotesAcc.address !== ethers.constants.AddressZero) setIsClaiming(true)
    try {
      if (
        mostVotesAcc.address === currentDelegate &&
        mostVotesAcc.address === currentNounDelegate
      ) {
        return
      }
      if (mostVotesAcc.address !== currentDelegate) {
        const response = await claimVaultDelegate(mostVotesAcc.address)

        if (
          response.status === WrappedTransactionReceiptState.SUCCESS ||
          response.status === WrappedTransactionReceiptState.SPEDUP
        ) {
          if (response?.receipt?.blockNumber != null) {
            setLeaderboardBlockNumber(response.receipt.blockNumber)
          }
          toastSuccess('Delegate updated 👑', 'Leaderboard will refresh momentarily.')
          if (account.toLowerCase() === mostVotesAcc.address) {
            toastInfo(
              'Hey delegate!',
              'Please sign the next transaction in order to vote in NounsDao.',
              10000
            )
          }
        } else if (response.status === WrappedTransactionReceiptState.ERROR) {
          throw response.data
        } else if (response.status === WrappedTransactionReceiptState.CANCELLED) {
          toastError('Transaction canceled', 'Please try again.')
        }
      }
      if (
        mostVotesAcc.address !== currentNounDelegate &&
        account.toLowerCase() === mostVotesAcc.address
      ) {
        await handleClaimNounsDelegate()
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

  const isMostVotesAddressZero = mostVotesAcc.address === ethers.constants.AddressZero

  return (
    <div className="mt-10 border-2 rounded-px16 p-4 lg:p-8 border-gray-2">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col xs:flex-row items-center xs:gap-3">
            <p className="font-londrina text-px24 text-gray-4 leading-[40px]">Current delegate</p>

            {!isMostVotesAddressZero && (
              <>
                {isCurrentDelegateOutOfSyncOnVaultContract && (
                  <div className="flex items-center">
                    <SimplePopover>
                      <h1 className="font-700 text-px18 text-gray-4">
                        <span className="text-secondary-orange">⚠</span> Out of sync
                      </h1>
                      <div>
                        This vault delegate is currently out of sync. There is another wallet with
                        more votes. You can update the vault delegate with a transaction.
                        <br />
                        <br />
                        To claim delegate on Nouns contract, the new delegate will have to perform
                        another transaction, available after this one.
                      </div>
                    </SimplePopover>

                    <Button
                      loading={isClaiming}
                      onClick={() => handleUpdateDelegate()}
                      className="flex ml-4 items-center justify-center text-secondary-blue hover:text-secondary-green text-px18 font-700 border-2 border-transparent h-10 rounded-px10"
                    >
                      <span>Update</span>
                    </Button>
                  </div>
                )}
                {!isCurrentDelegateOutOfSyncOnVaultContract &&
                  isCurrentDelegateOutOfSyncOnNounContract && (
                    <div className="flex items-center">
                      <SimplePopover>
                        <h1 className="font-700 text-px18 text-gray-4">
                          <span className="text-secondary-orange">⚠</span> Claim Noun delegate
                        </h1>
                        <div>
                          To be able to vote in NounsDao on behalf of this Noun the current delegate
                          must set themselves as the delegate on the Nouns contract
                        </div>
                      </SimplePopover>
                      <SimplePopover isDisabled={currentDelegate === account?.toLowerCase()}>
                        <Button
                          disabled={currentDelegate !== account?.toLowerCase()}
                          loading={isClaiming}
                          onClick={() => handleUpdateDelegate()}
                          className="flex ml-4 items-center justify-center text-secondary-blue hover:text-secondary-green text-px18 font-700 border-2 border-transparent h-10 rounded-px10"
                        >
                          <span>Update</span>
                        </Button>
                        <div>Only a vault delegate can perform this action</div>
                      </SimplePopover>
                    </div>
                  )}
              </>
            )}
          </div>

          <div className="flex items-center mt-4 justify-center xs:justify-start">
            {currentDelegateRC}
          </div>
        </div>

        {account && (
          <>
            <div className="hidden lg:block lg:-my-8 border-r-2 border-gray-2"></div>

            <div className="flex flex-col lg:max-w-[300px]">
              <div className="flex flex-col xs:flex-row items-center xs:gap-3">
                <p className="font-londrina text-px24 text-gray-4 leading-px36">My Nounlets</p>

                {areMyVotesSplit && (
                  <div className="flex items-center">
                    <SimplePopover>
                      <h1 className="font-700 text-px18 text-gray-4">
                        <span className="text-secondary-orange">⚠</span> Multiple votes
                      </h1>
                      <div>
                        Your nounlets are voting for multiple addresses. We recommend you update
                        your votes to only be for one address.
                      </div>
                    </SimplePopover>
                  </div>
                )}
              </div>

              <div className="flex items-center mt-4 justify-center xs:justify-start">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-px36 font-londrina leading-px42 w-10 h-10 flex-shrink-0 overflow-visible text-center">
                    {myNounlets.length}
                  </p>
                  {myNounlets.map((nounlet) => {
                    return (
                      <Link href={`/nounlet/${nounlet.id}`} key={nounlet.id}>
                        <div className="overflow-hidden flex-shrink-0 w-10 h-10 rounded-px8 cursor-pointer hover:scale-110 transition-transform">
                          <NounletImage id={nounlet.id} />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
