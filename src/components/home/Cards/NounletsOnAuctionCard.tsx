import { NEXT_PUBLIC_BID_DECIMALS } from 'config'
import { FixedNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import Button from 'src/components/common/buttons/Button'
import CountdownTimer from 'src/components/common/CountdownTimer'
import { NounImage } from 'src/components/common/NounletImage'
import SimpleProgressIndicator from 'src/components/common/simple/SimpleProgressIndicator'
import { VaultData } from 'src/hooks/useExistingVaults'

export default function NounletsOnAuctionCard(props: { vault: VaultData }) {
  console.log('🚀 VaultData', props.vault)
  const { id, noun } = props.vault
  if (id == null || noun == null) return null

  const nounletsCount = noun.nounlets.length
  const latestAuction = noun.nounlets.at(-1)!.auction

  // const startTime = ~~(Date.now() / 1000 - 600) + ''
  // const endTime = ~~(Date.now() / 1000 + 600) + ''
  const isOver = false // Todo calculate

  console.log({ latestAuction })

  const ethValue = FixedNumber.from(
    formatEther(noun.nounlets.at(-1)?.auction.highestBidAmount.toString())
  )
    .round(NEXT_PUBLIC_BID_DECIMALS)
    .toString()

  return (
    <Link href={`/noun/${noun.id}`}>
      <div className="vault-list-tile flex w-full max-w-[300px] cursor-pointer flex-col gap-6">
        <div className="max-w-[300px] overflow-hidden rounded-2xl">
          <NounImage id={noun.id} />
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-londrina text-px32 font-900 leading-px36 text-gray-0.5">
            NOUN {noun.id}
          </p>
          <div className="space-y-4 rounded-2xl bg-divider p-4">
            <div className="space-y-2 text-px14 font-500 leading-[20px]">
              <p className="text-px18 font-700 leading-px24">Nounlet {nounletsCount}/100</p>

              {/* <CountdownTimer auctionEnd={endTime} /> */}
              <CountdownWithBar
                startTime={latestAuction.startTime}
                endTime={latestAuction.endTime}
              />
              <p>
                Current bid: <span className="font-700">Ξ {ethValue}</span>
              </p>
            </div>
          </div>
          <Button className="primary w-full">
            {isOver ? 'Settle auction' : 'Bid for Nounlet ' + nounletsCount}
          </Button>
        </div>
      </div>
    </Link>
  )
}

function CountdownWithBar(props: { startTime: string; endTime: string }) {
  const { startTime, endTime } = props
  const length = +endTime - +startTime
  const [percentage, setPercentage] = useState(0.5)

  const calculatePercentage = useCallback(() => {
    const timeLeft = ~~((+endTime * 1000 - Date.now()) / 1000)
    const percentage = +((timeLeft * 100) / length / 100).toFixed(2)
    setPercentage(percentage)
    return percentage
  }, [endTime, length])

  const onTimerFinished = useCallback(() => {
    console.log('done?')
  }, [])

  return (
    <div className="space-y-2">
      {/* <p>{percentage}</p> */}
      <SimpleProgressIndicator percentage={percentage} className="!h-2" />

      <div className="flex items-center space-x-1">
        <p>Auction ends in:</p>
        <CountdownTimer
          className="!text-px14 !font-700 !leading-[20px]"
          auctionEnd={endTime}
          onTimerTick={calculatePercentage}
          onTimerFinished={onTimerFinished}
        />
      </div>
    </div>
  )
}
