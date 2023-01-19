import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import Button from 'src/components/common/buttons/Button'
import { NounletImage } from 'src/components/common/NounletImage'
import SimpleAddress from 'src/components/common/simple/SimpleAddress'
import SimplePopover from 'src/components/common/simple/SimplePopover'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
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
  const { nounTokenId, nounletTokenAddress } = useDisplayedNounlet()

  const areMyVotesSplit = useMemo(() => {
    return Object.keys(myNounletsVotes).length > 1
  }, [myNounletsVotes])

  const currentDelegateRC = useMemo(() => {
    return currentDelegate === ethers.constants.AddressZero ? (
      <p className="font-londrina text-px36 leading-px42">no one :(</p>
    ) : (
      <SimpleAddress
        avatarSize={40}
        className="space-x-3 font-londrina text-px36 leading-px42"
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
    <div className="mt-10 rounded-px16 border-2 border-gray-2 p-4 lg:p-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col items-center xs:flex-row xs:gap-3">
            <p className="font-londrina text-px24 leading-[40px] text-gray-4">Current delegate</p>

            {!isMostVotesAddressZero && (
              <>
                {isCurrentDelegateOutOfSyncOnVaultContract && (
                  <div className="flex items-center">
                    <SimplePopover>
                      <h1 className="text-px18 font-700 text-gray-4">
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
                      className="ml-4 flex h-10 items-center justify-center rounded-px10 border-2 border-transparent text-px18 font-700 text-secondary-blue hover:text-secondary-green"
                    >
                      <span>Update</span>
                    </Button>
                  </div>
                )}
                {!isCurrentDelegateOutOfSyncOnVaultContract &&
                  isCurrentDelegateOutOfSyncOnNounContract && (
                    <div className="flex items-center">
                      <SimplePopover>
                        <h1 className="text-px18 font-700 text-gray-4">
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
                          className="ml-4 flex h-10 items-center justify-center rounded-px10 border-2 border-transparent text-px18 font-700 text-secondary-blue hover:text-secondary-green"
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

          <div className="mt-4 flex items-center justify-center xs:justify-start">
            {currentDelegateRC}
          </div>
        </div>

        {account && (
          <>
            <div className="hidden border-r-2 border-gray-2 lg:-my-8 lg:block"></div>

            <div className="flex flex-col lg:max-w-[300px]">
              <div className="flex flex-col items-center xs:flex-row xs:gap-3">
                <p className="font-londrina text-px24 leading-px36 text-gray-4">My Nounlets</p>

                {areMyVotesSplit && (
                  <div className="flex items-center">
                    <SimplePopover>
                      <h1 className="text-px18 font-700 text-gray-4">
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

              <div className="mt-4 flex items-center justify-center xs:justify-start">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="h-10 w-10 flex-shrink-0 overflow-visible text-center font-londrina text-px36 leading-px42">
                    {myNounlets.length}
                  </p>
                  {myNounlets.map((nounlet) => {
                    return (
                      <Link href={`/nounlet/${nounlet.id}`} key={nounlet.id}>
                        <div className="h-10 w-10 flex-shrink-0 cursor-pointer overflow-hidden rounded-px8 transition-transform hover:scale-110">
                          <NounletImage
                            noundId={nounTokenId}
                            id={nounlet.id}
                            nounletTokenAddress={nounletTokenAddress}
                          />
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
