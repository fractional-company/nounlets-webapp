import { NEXT_PUBLIC_BID_DECIMALS } from 'config'
import dayjs from 'dayjs'
import { BigNumber, FixedNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import Button from 'src/components/common/buttons/Button'
import CountdownTimer from 'src/components/common/CountdownTimer'
import { NounImage } from 'src/components/common/NounletImage'
import SimpleProgressIndicator from 'src/components/common/simple/SimpleProgressIndicator'
import { VaultData } from 'src/hooks/useExistingVaults'

export default function NounletsOnAuctionCard(props: { vault: VaultData }) {
  const noun = props.vault.noun!
  const nounletsCount = noun.nounlets.length
  const latestAuction = noun.nounlets.at(-1)!.auction

  const [hasAuctionEnded, setHasAuctionEnded] = useState(false)
  const handleTimerFinished = useCallback(() => {
    setHasAuctionEnded(true)
  }, [])

  const ethValue = FixedNumber.from(
    formatEther(noun.nounlets.at(-1)?.auction.highestBidAmount.toString())
  )
    .round(NEXT_PUBLIC_BID_DECIMALS)
    .toString()

  return (
    <Link href={`/noun/${noun.id}`}>
      <div className="vault-list-tile flex cursor-pointer flex-col gap-6 md:flex-row">
        <div className="w-full overflow-hidden rounded-2xl md:w-[300px]">
          <NounImage id={noun.id} />
        </div>
        <div className="flex w-[300px] flex-col gap-4 md:self-center">
          <p className="font-londrina text-px32 font-900 leading-px36 text-gray-0.5">
            NOUN {noun.id}
          </p>
          <div className="space-y-4 rounded-2xl bg-divider p-4" key={nounletsCount}>
            <div className="space-y-2 text-px14 font-500 leading-[20px]">
              <p className="text-px18 font-700 leading-px24">Nounlet {nounletsCount}/100</p>

              {/* <CountdownTimer auctionEnd={endTime} /> */}
              <CountdownWithBar
                startTime={latestAuction.startTime}
                endTime={latestAuction.endTime}
                onTimerFinished={handleTimerFinished}
                countUp
              />
              <p>
                {hasAuctionEnded ? 'Winning bid:' : 'Current bid:'}{' '}
                <span className="font-700">Ξ {ethValue}</span>
              </p>
            </div>
          </div>
          <Button className="primary w-full">
            {hasAuctionEnded ? 'Settle auction' : 'Bid for Nounlet ' + nounletsCount}
          </Button>
        </div>
      </div>
    </Link>
  )
}

NounletsOnAuctionCard.Skeleton = function NounletsOnAuctionCardSkeleton() {
  return (
    <div className="vault-list-tile flex cursor-pointer flex-col gap-6 md:flex-row">
      <div className="w-full overflow-hidden rounded-2xl bg-divider md:w-[300px]">
        <NounImage />
      </div>
      <div className="flex w-[300px] flex-col gap-4 md:self-center">
        <p className="font-londrina text-px32 font-900 leading-px36 text-gray-0.5">NOUN ???</p>
        <div className="space-y-4 rounded-2xl bg-divider p-4">
          <div className="h-24 space-y-2 text-px14 font-500 leading-[20px]">
            <p className="text-px18 font-700 leading-px24">Nounlet ???/100</p>
          </div>
        </div>
        <div className="h-12 w-full rounded-px10 bg-divider"></div>
      </div>
    </div>
  )
}

function CountdownWithBar(props: {
  startTime: string
  endTime: string
  onTimerFinished?: () => void
  countUp?: boolean
}) {
  const { startTime, endTime, onTimerFinished, countUp } = props
  const length = +endTime - +startTime
  const [percentage, setPercentage] = useState(countUp ? 1.0 : 0.0)
  const [isOver, setIsOver] = useState(false)

  const calculatePercentage = useCallback(() => {
    const timeLeft = ~~((+endTime * 1000 - Date.now()) / 1000)
    const percentage = +((timeLeft * 100) / length / 100).toFixed(2)
    const adjusedPercentage = countUp ? 1.0 - percentage : percentage
    setPercentage(adjusedPercentage)
    return adjusedPercentage
  }, [endTime, length, countUp])

  const handleTimerFinished = useCallback(() => {
    onTimerFinished?.()
    setIsOver(true)
  }, [onTimerFinished])

  return (
    <div className="space-y-2">
      {/* <p>{percentage}</p> */}
      <SimpleProgressIndicator
        percentage={percentage}
        className="!h-2"
        trackColorClassName="bg-secondary-green"
      />

      <div className="flex items-center space-x-1">
        {isOver ? <p>Auction ended on:</p> : <p>Auction ends in:</p>}
        <CountdownTimer
          className="!text-px14 !font-700 !leading-[20px]"
          auctionEnd={endTime}
          showEndTime={isOver}
          onTimerTick={calculatePercentage}
          onTimerFinished={handleTimerFinished}
        />
      </div>
    </div>
  )
}
