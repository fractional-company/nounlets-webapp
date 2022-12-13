import Button from 'src/components/common/buttons/Button'
import CountdownTimer from 'src/components/common/CountdownTimer'
import IconEth from 'src/components/common/icons/IconEth'
import { BigNumber, FixedNumber } from 'ethers'
import { useMemo, useState } from 'react'
import { useBuyoutHowDoesItWorkModalStore } from 'src/store/buyout/buyoutHowDoesItWorkModal.store'
import { BuyoutState, useBuyoutStore } from 'src/store/buyout/buyout.store'
import BuyoutAcceptRejectOfferModal from './BuyoutAcceptRejectOfferModal'
import SimpleModalWrapper from '../common/simple/SimpleModalWrapper'
import useNounBuyout from 'src/hooks/useNounBuyout'
import useToasts from 'src/hooks/utils/useToasts'
import { WrappedTransactionReceiptState } from 'src/lib/utils/txWithErrorHandling'
import { useSWRConfig } from 'swr'
import { formatEther } from 'ethers/lib/utils'
import { useEthers } from '@usedapp/core'
import { useAppStore } from 'src/store/application.store'

export default function BuyoutOfferLiveCard(): JSX.Element {
  const { account, library } = useEthers()
  const { cache, mutate: globalMutate } = useSWRConfig()
  const { setConnectModalOpen } = useAppStore()
  const { openBuyoutHowDoesItWorkModal } = useBuyoutHowDoesItWorkModalStore()
  const {
    buyoutInfo,
    hasEnded,
    settleOffer,
    cashOut,
    withdrawNoun,
    myNounlets,
    nounTokenId,
    getIsApprovedToStartBuyoutOrCashOut,
    approveBuyoutOffer
  } = useNounBuyout()
  const { toastSuccess, toastError } = useToasts()

  const [isRejectingModalMode, setIsRejectingModalMode] = useState(true)
  const [showAcceptRejectModal, setShowAcceptRejectModal] = useState(false)

  const [showEndTime, setShowEndTime] = useState(false)
  const startTime = useMemo(() => buyoutInfo.startTime, [buyoutInfo])
  const endTime = useMemo(() => buyoutInfo.endTime, [buyoutInfo])

  const canWithdrawNoun = useMemo(() => {
    return (
      buyoutInfo.state === BuyoutState.SUCCESS &&
      buyoutInfo.proposer.toLowerCase() === account?.toLowerCase() &&
      !buyoutInfo.wasNounWithdrawn
    )
  }, [account, buyoutInfo])

  const canWithdrawEth = useMemo(() => {
    return buyoutInfo.state === BuyoutState.SUCCESS && myNounlets.length > 0
  }, [buyoutInfo, myNounlets])

  const handleShowAcceptRejectOfferModal = (isRejectingMode = true) => {
    setIsRejectingModalMode(isRejectingMode)
    setShowAcceptRejectModal(true)
  }

  const [isSettlingOffer, setIsSettlingOffer] = useState(false)
  const handleSettleOffer = async () => {
    if (account == null) {
      setConnectModalOpen(true)
      return
    }

    try {
      setIsSettlingOffer(true)
      const response = await settleOffer()

      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        await globalMutate('VaultBuyout') // TODO maybe remove this
        toastSuccess(
          'Buyout SETTLED! 🎉',
          'Now I rest and watch the sun rise on a grateful universe'
        )
      } else if (response.status === WrappedTransactionReceiptState.ERROR) {
        throw response.data
      } else if (response.status === WrappedTransactionReceiptState.CANCELLED) {
        toastError('Transaction canceled', 'Please try again.')
      }
    } catch (error) {
      console.log(error)
      toastError('Settling buyout failed :(', 'Please try again.')
    } finally {
      setIsSettlingOffer(false)
    }
  }

  const [isCashingOut, setIsCashingOut] = useState(false)
  const [isApproveModalShown, setIsApproveModalShown] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const handleCashOut = async () => {
    try {
      setIsCashingOut(true)

      // const isApproved = await getIsApprovedToStartBuyoutOrCashOut()

      // if (!isApproved) {
      //   setIsApproveModalShown(true)
      //   setIsCashingOut(false)
      //   return
      // }

      const response = await cashOut()

      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        await globalMutate('VaultBuyout')
        toastSuccess('Cashed out! 💰', 'Cha-Ching')
      } else if (response.status === WrappedTransactionReceiptState.ERROR) {
        throw response.data
      } else if (response.status === WrappedTransactionReceiptState.CANCELLED) {
        toastError('Transaction canceled', 'Please try again.')
      }
    } catch (error) {
      console.log(error)
      setIsCashingOut(false)
      toastError('Cash out failed :(', 'Please try again.')
    } finally {
    }
  }

  const cashOutAmount = useMemo(() => {
    if (myNounlets.length === 0) return '0'
    return formatEther(buyoutInfo.fractionPrice.mul(myNounlets.length))
  }, [buyoutInfo, myNounlets])

  const handleApprove = async () => {
    try {
      setIsApproving(true)
      const response = await approveBuyoutOffer()
      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        toastSuccess('Approved!', 'Now try it again!')
        setIsApproveModalShown(false)
      } else if (response.status === WrappedTransactionReceiptState.ERROR) {
        throw response.data
      } else if (response.status === WrappedTransactionReceiptState.CANCELLED) {
        toastError('Transaction canceled', 'Please try again.')
      }
    } catch (error) {
      toastError('Approving failed', 'Please try again.')
    } finally {
      setIsApproving(false)
    }
  }

  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const handleWithdrawNoun = async () => {
    try {
      setIsWithdrawing(true)
      const response = await withdrawNoun()

      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        await globalMutate('VaultBuyout')
        toastSuccess('Nounlets ASSEMBLE! 🎊', 'Congratulations 🎉🎉🎉')
      } else if (response.status === WrappedTransactionReceiptState.ERROR) {
        throw response.data
      } else if (response.status === WrappedTransactionReceiptState.CANCELLED) {
        toastError('Transaction canceled', 'Please try again.')
      }
    } catch (error) {
      console.log(error)
      setIsWithdrawing(false)
      toastError('Withdraw failed :(', 'Please try again.')
    } finally {
    }
  }

  return (
    <div className="buyout-offer-live-card">
      <div className="bg-gray-2 rounded-px16">
        {buyoutInfo.state === BuyoutState.LIVE && !hasEnded && (
          <>
            <div className="text-center flex flex-col p-4 gap-4">
              <p className="font-londrina text-px24 text-gray-4 leading-px36">
                Offer accepted {showEndTime ? 'at' : 'in'}
              </p>
              <div onClick={() => setShowEndTime(!showEndTime)}>
                <CountdownTimer
                  auctionEnd={endTime}
                  showEndTime={showEndTime}
                  className="cursor-pointer font-londrina !text-px36 !space-x-3 !font-400 justify-center"
                />
              </div>
              <p className="text-px16 font-500 text-gray-4">
                Current and future Nounlet owners have 7 days to reject the offer by buying all
                offered Nounlets for ETH.{' '}
                <Button
                  onClick={openBuyoutHowDoesItWorkModal}
                  className="link text-secondary-blue hover:text-secondary-green"
                >
                  How does it work?
                </Button>
              </p>
            </div>

            <div className="bg-black text-white rounded-b-px16 p-4 pt-6 text-center">
              <div className="flex flex-col sm:flex-row grid-rows-2 gap-4 items-center sm:justify-around">
                <div className="flex flex-col gap-3 flex-1 w-full">
                  <p className="text-px15 font-500">Total offer for full Noun</p>
                  <div className="flex items-center space-x-2 justify-center">
                    <IconEth className="flex-shrink-0" />
                    <p className="text-px24 leading-[38px] font-700 truncate">
                      {buyoutInfo.formatted.fullPrice}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button
                      className="primary w-full"
                      onClick={() => handleShowAcceptRejectOfferModal(false)}
                    >
                      👍 Accept offer
                    </Button>
                    <p className="font-500 text-px12 leading-px18 text-gray-3 truncate">
                      Wait till the time runs out
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 flex-1 w-full">
                  <p className="text-px15 font-500">Value per nounlet</p>
                  <div className="flex items-center space-x-2 justify-center">
                    <IconEth className="flex-shrink-0" />
                    <p className="text-px24 leading-[38px] font-700 truncate">
                      {buyoutInfo.formatted.fractionPrice}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button
                      className="primary-danger w-full"
                      onClick={() => handleShowAcceptRejectOfferModal(true)}
                    >
                      👎 Reject offer
                    </Button>
                    <p className="font-500 text-px12 leading-px18 text-gray-3 truncate">
                      Buy remaining Nounlets
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <SimpleModalWrapper
              className="!max-w-[454px]"
              isShown={showAcceptRejectModal}
              onClose={() => setShowAcceptRejectModal(false)}
            >
              <BuyoutAcceptRejectOfferModal isRejecting={isRejectingModalMode} />
            </SimpleModalWrapper>
          </>
        )}

        {(hasEnded || buyoutInfo.state === BuyoutState.SUCCESS) && (
          <>
            <div className="text-center flex flex-col p-4">
              <p className="font-londrina text-px24 text-gray-4 leading-px36">
                🎉 Offer accepted 🎉
              </p>
            </div>
            <div className="bg-black text-white rounded-b-px16 p-4 pt-6 text-center space-y-4">
              <div className="flex flex-col sm:flex-row grid-rows-2 gap-4 items-center sm:justify-around">
                <div className="flex flex-col gap-3 flex-1 w-full">
                  <p className="text-px15 font-500">Total offer for full Noun</p>
                  <div className="flex items-center space-x-2 justify-center">
                    <IconEth className="flex-shrink-0" />
                    <p className="text-px24 leading-[38px] font-700 truncate">
                      {buyoutInfo.formatted.fullPrice}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 flex-1 w-full">
                  <p className="text-px15 font-500">Value per nounlet</p>
                  <div className="flex items-center space-x-2 justify-center">
                    <IconEth className="flex-shrink-0" />
                    <p className="text-px24 leading-[38px] font-700 truncate">
                      {buyoutInfo.formatted.fractionPrice}
                    </p>
                  </div>
                </div>
              </div>

              {buyoutInfo.state === BuyoutState.SUCCESS ? (
                <>
                  {canWithdrawNoun && (
                    <div className="space-y-2">
                      <Button
                        className="primary w-full"
                        onClick={handleWithdrawNoun}
                        loading={isWithdrawing}
                      >
                        Claim Noun {nounTokenId}
                      </Button>
                    </div>
                  )}

                  {canWithdrawEth && (
                    <div className="space-y-2">
                      <Button
                        className="primary w-full"
                        onClick={handleCashOut}
                        loading={isCashingOut}
                      >
                        Claim {cashOutAmount} ETH
                      </Button>
                      <p className="font-500 text-px12 leading-px18 text-gray-3 truncate">
                        Claiming ETH will burn your existing Nounlet(s)
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Button
                      className="primary w-full"
                      onClick={handleSettleOffer}
                      loading={isSettlingOffer}
                    >
                      Settle Offer
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <SimpleModalWrapper
        isShown={isApproveModalShown}
        onClose={() => setIsApproveModalShown(false)}
        className="md:min-w-[400px] !max-w-[400px]"
      >
        <h2 className="font-londrina text-px42 -mt-3 -mb-4 pr-4">Approval</h2>
        <div className="mt-8 flex flex-col gap-6">
          <p className="font-500 text-px20 leading-px30 text-gray-4">
            The contract needs your approval to take your Nounlet(s) and give you back some ETH.
          </p>
          <Button
            className="primary"
            onClick={() => {
              handleApprove()
            }}
            loading={isApproving}
          >
            <div className="flex flex-col items-center">
              <span>Gimmie the ETH!</span>
              <span className="text-px10">(I really like ETH)</span>
            </div>
          </Button>
        </div>
      </SimpleModalWrapper>
    </div>
  )
}
