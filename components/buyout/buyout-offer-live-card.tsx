import Button from 'components/buttons/button'
import CountdownTimer from 'components/countdown-timer'
import IconEth from 'components/icons/icon-eth'
import { BigNumber, FixedNumber } from 'ethers'
import { useMemo, useState } from 'react'
import { useBuyoutHowDoesItWorkModalStore } from 'store/buyout/buyout-how-does-it-work-modal.store'
import { BuyoutState, useBuyoutStore } from 'store/buyout/buyout.store'
import BuyoutAcceptRejectOfferModal from './buyout-accept-reject-offer-modal'
import SimpleModalWrapper from '../SimpleModalWrapper'
import useNounBuyout from 'hooks/useNounBuyout'
import useToasts from 'hooks/useToasts'
import { WrappedTransactionReceiptState } from 'lib/utils/tx-with-error-handling'
import { useSWRConfig } from 'swr'
import { formatEther } from 'ethers/lib/utils'
import { useEthers } from '@usedapp/core'
import { useAppStore } from 'store/application'

export default function BuyoutOfferLiveCard(): JSX.Element {
  const { account, library } = useEthers()
  const { cache, mutate: globalMutate } = useSWRConfig()
  const { setConnectModalOpen } = useAppStore()
  const { openBuyoutHowDoesItWorkModal } = useBuyoutHowDoesItWorkModalStore()
  const { buyoutInfo, hasEnded, settleOffer, cashOut, withdrawNoun, myNounlets, nounTokenId } =
    useNounBuyout()
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
  const handleCashOut = async () => {
    try {
      setIsCashingOut(true)
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
    </div>
  )
}
