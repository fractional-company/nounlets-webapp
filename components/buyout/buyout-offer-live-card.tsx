import Button from 'components/buttons/button'
import CountdownTimer from 'components/countdown-timer'
import IconEth from 'components/icons/icon-eth'
import { BigNumber } from 'ethers'
import useBuyoutNoun from 'hooks/useBuyoutNoun'
import { useMemo, useState } from 'react'
import { useBuyoutHowDoesItWorkModalStore } from 'store/buyout/buyout-how-does-it-work-modal.store'
import { BuyoutState, useBuyoutStore } from 'store/buyout/buyout.store'
import BuyoutAcceptRejectOfferModal from './buyout-accept-reject-offer-modal'
import SimpleModalWrapper from '../SimpleModalWrapper'

export default function BuyoutOfferLiveCard(): JSX.Element {
  const { openBuyoutHowDoesItWorkModal } = useBuyoutHowDoesItWorkModalStore()
  const { buyoutInfo } = useBuyoutNoun()

  const [isRejectingModalMode, setIsRejectingModalMode] = useState(true)
  const [showAcceptRejectModal, setShowAcceptRejectModal] = useState(false)

  const [showEndTime, setShowEndTime] = useState(false)
  const startTime = useMemo(() => buyoutInfo.startTime, [buyoutInfo])
  const endTime = useMemo(() => startTime.add(60 * 60 * 5), [startTime])

  const canWithdrawNoun = true
  const canWithdrawEth = true

  const handleShowAcceptRejectOfferModal = (isRejectingMode = true) => {
    setIsRejectingModalMode(isRejectingMode)
    setShowAcceptRejectModal(true)
  }

  return (
    <div className="buyout-offer-live-card">
      <div className="bg-gray-2 rounded-px16">
        {buyoutInfo.state === BuyoutState.LIVE && (
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
                      Wait till time runs out
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
                      Buy remaining nounlets
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

        {buyoutInfo.state === BuyoutState.SUCCESS && (
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

              {canWithdrawNoun && (
                <div className="space-y-2">
                  <Button className="primary w-full">Claim Noun 1337</Button>
                </div>
              )}

              {canWithdrawEth && (
                <div className="space-y-2">
                  <Button className="primary w-full">Claim 0.23425 ETH</Button>
                  <p className="font-500 text-px12 leading-px18 text-gray-3 truncate">
                    Claiming ETH will burn your existing Nounlet(s)
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
