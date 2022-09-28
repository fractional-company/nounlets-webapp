import Button from 'components/buttons/button'
import CountdownTimer from 'components/countdown-timer'
import { BigNumber, FixedNumber } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { useMemo, useState } from 'react'
import { useBuyoutStore } from 'store/buyout/buyout.store'
import { OfferDetails } from './buyout-offer-modal'

type ComponentProps = {}

export default function StepOfferLive(): JSX.Element {
  const { buyoutInfo } = useBuyoutStore()

  const [showEndTime, setShowEndTime] = useState(false)
  const startTime = useMemo(() => buyoutInfo.startTime, [buyoutInfo])
  const endTime = useMemo(() => startTime.add(60 * 60 * 5), [startTime])

  return (
    <div className="step-offer-live">
      <div className="flex flex-col gap-8">
        <p className="text-px24 font-londrina text-gray-4">Your offer is now live!</p>

        <div className="grid gap-4 sm:gap-8 justify-center sm:grid-cols-[1fr,2px,1fr]">
          <div className="text-center sm:text-left">
            <p className="text-px18 font-500 text-gray-4">Nounlets Offered</p>
            <p className="text-px32 font-700">{buyoutInfo.formatted.fractionsOfferedCount}</p>
          </div>
          <div className="hidden sm:block bg-gray-2 h-full"></div>
          <div className="text-center sm:text-left">
            <p className="text-px18 font-500 text-gray-4">ETH Offered</p>
            <p className="text-px32 font-700">{buyoutInfo.formatted.initialEthBalance}</p>
          </div>
        </div>
        <div className="text-center">
          <p className="font-londrina text-px24 text-gray-4 leading-px36">
            Total offer for full Noun
          </p>
          <p className="font-londrina text-px36 mt-2 leading-px42">
            {buyoutInfo.formatted.fullPrice} ETH
          </p>
        </div>
        <div className="bg-gray-2 rounded-px16 p-4">
          <div className="text-center flex flex-col gap-3">
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
              offered Nounlets for ETH.
            </p>
            <Button className="primary w-full">See offer page</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
