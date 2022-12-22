import dayjs from 'dayjs'
import { BigNumber } from 'ethers'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import Button from 'src/components/common/buttons/Button'
import CountdownTimer from 'src/components/common/CountdownTimer'
import { NounImage } from 'src/components/common/NounletImage'
import SimpleProgressIndicator from 'src/components/common/simple/SimpleProgressIndicator'
import { VaultData } from 'src/hooks/useExistingVaults'

export default function NounletsPastAuctionCard(props: { vault: VaultData }) {
  const { noun, buyoutInfo } = props.vault
  console.log({ noun })

  if (noun == null) return null

  const lastAuction = noun!.nounlets.at(-1)!.auction
  const lastAuctionEnded = lastAuction.endTime

  if (buyoutInfo.state === 0) {
    return <BuyoutIdle nounId={noun.id} auctionEnded={lastAuctionEnded} />
  }

  if (buyoutInfo.state === 2) {
    return <BuyoutFinished nounId={noun.id} />
  }

  return <BuyoutInProgress nounId={noun.id} lastAuction={lastAuction} />
}

function BuyoutIdle(props: { nounId: string; auctionEnded: string }) {
  const { nounId, auctionEnded } = props

  const formattedTime = useMemo(() => {
    const endTime = dayjs.unix(BigNumber.from(auctionEnded).toNumber()).local()
    return endTime.format('MM/D/YY')
  }, [auctionEnded])

  return (
    <Link href={`/noun/${nounId}`}>
      <div className="vault-list-tile flex w-full max-w-[300px] cursor-pointer flex-col gap-6">
        <div className="max-w-[300px] overflow-hidden rounded-2xl">
          <NounImage id={nounId} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-londrina text-px32 font-900 leading-px36 text-black">
              NOUN {nounId}
            </p>
            <p className="text-px14 font-500 text-gray-4">Finished on {formattedTime}</p>
          </div>
          <Button className="primary w-full">Offer to buy Noun</Button>
        </div>
      </div>
    </Link>
  )
}

function BuyoutInProgress(props: {
  nounId: string
  lastAuction: NonNullable<VaultData['noun']>['nounlets'][0]['auction']
}) {
  const { nounId, lastAuction } = props

  const startTime = ~~(Date.now() / 1000 - 600) + ''
  const endTime = ~~(Date.now() / 1000 + 600) + ''
  const isOver = false // Todo calculate

  return (
    <Link href={`/noun/${nounId}`}>
      <div className="vault-list-tile flex w-full max-w-[300px] cursor-pointer flex-col gap-6">
        <div className="max-w-[300px] overflow-hidden rounded-2xl">
          <NounImage id={nounId} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-londrina text-px32 font-900 leading-px36 text-black">
              NOUN {nounId}
            </p>
            <p className="text-px14 font-500 leading-px20">🔥 Buyout</p>
          </div>
          <div className="space-y-4 rounded-2xl bg-black p-4 text-white">
            <div className="space-y-2 text-px14 font-500 leading-[20px]">
              {/* <p className="text-px18 font-700 leading-px24 text-secondary-red">Buyout</p> */}
              {/* <CountdownWithBar startTime={startTime} endTime={endTime} /> */}
              <div className="flex items-center space-x-1">
                <p>Offer accepted in:</p>
                <CountdownTimer
                  className="!text-px14 !font-700 !leading-[20px]"
                  auctionEnd={endTime}
                />
              </div>
            </div>
            <Button className="primary-danger w-full !text-white">Review offer</Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

function BuyoutFinished(props: { nounId: string }) {
  const { nounId } = props

  return (
    <Link href={`/noun/${nounId}`}>
      <div className="vault-list-tile flex w-full max-w-[300px] cursor-pointer flex-col gap-6">
        <div className="max-w-[300px] overflow-hidden rounded-2xl">
          <NounImage id={nounId} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-londrina text-px32 font-900 leading-px36 text-black">
              NOUN {nounId}
            </p>
            <p className="text-px14 font-500 leading-px20">🎉 Offer accepted</p>
          </div>
          <div className="space-y-4 rounded-2xl bg-black p-4">
            <Button className="primary w-full">View & Claim</Button>
          </div>
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

  return (
    <div className="space-y-2">
      <SimpleProgressIndicator percentage={percentage} className="!h-2" />

      <div className="flex items-center space-x-1">
        <p>Offer accepted in:</p>
        <CountdownTimer
          className="!text-px14 !font-700 !leading-[20px]"
          auctionEnd={endTime}
          onTimerTick={calculatePercentage}
        />
      </div>
    </div>
  )
}
