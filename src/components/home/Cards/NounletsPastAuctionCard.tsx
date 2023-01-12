import dayjs from 'dayjs'
import { BigNumber } from 'ethers'
import Link from 'next/link'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import Button from 'src/components/common/buttons/Button'
import CountdownTimer from 'src/components/common/CountdownTimer'
import { NounImage } from 'src/components/common/NounletImage'
import SimpleProgressIndicator from 'src/components/common/simple/SimpleProgressIndicator'
import { VaultData } from 'src/hooks/useExistingVaults'

export default function NounletsPastAuctionCard(props: { vault: VaultData }) {
  const { noun, buyoutInfo } = props.vault
  // console.log({ noun })

  if (noun == null) return null

  const lastAuction = noun!.nounlets.at(-1)!.auction
  const lastAuctionEnded = lastAuction.endTime

  if (buyoutInfo.state === 0) {
    return <BuyoutIdle nounId={noun.id} auctionEnded={lastAuctionEnded} />
  }

  // if (buyoutInfo.state === 2) {
  //   return <BuyoutFinished nounId={noun.id} />
  // }

  return <BuyoutInProgress nounId={noun.id} buyoutInfo={buyoutInfo} />
}

NounletsPastAuctionCard.Skeleton = function NounletsPastAuctionCardSkeleton() {
  return (
    <div className="vault-list-tile flex w-full max-w-[300px] cursor-pointer flex-col gap-4">
      <div className="max-w-[300px] overflow-hidden rounded-2xl bg-gray-1">
        <NounImage />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="font-londrina text-px32 font-900 leading-px36 text-black">NOUN ???</p>
        </div>
        <div className="h-[48px] w-full rounded-px10 bg-gray-1"></div>
      </div>
    </div>
  )
}

function BuyoutIdle(props: { nounId: string; auctionEnded: string }) {
  const { nounId, auctionEnded } = props

  const formattedTime = useMemo(() => {
    const endTime = dayjs.unix(BigNumber.from(auctionEnded).toNumber()).local()
    return endTime.format('MM/D/YY')
  }, [auctionEnded])

  return (
    <NounCardWrapper nounId={nounId}>
      <div className="flex items-center justify-between">
        <p className="font-londrina text-px32 font-900 leading-px36 text-black">NOUN {nounId}</p>
        <p className="text-px14 font-500 text-gray-4">Finished on {formattedTime}</p>
      </div>
      <Button className="primary w-full">Offer to buy Noun</Button>
    </NounCardWrapper>
  )
}

function BuyoutInProgress(props: {
  nounId: string
  buyoutInfo: NonNullable<VaultData['buyoutInfo']>
}) {
  const { nounId, buyoutInfo } = props
  const timeLeft = Math.max(
    0,
    Math.floor(BigNumber.from(buyoutInfo.endTime).toNumber()) - dayjs().unix()
  )
  const isOver = timeLeft === 0
  const isInProgress = buyoutInfo.state === 1

  return (
    <NounCardWrapper nounId={nounId}>
      <div className="flex items-center justify-between">
        <p className="font-londrina text-px32 font-900 leading-px36 text-black">NOUN {nounId}</p>
        <p className="text-px14 font-500 leading-px20">
          {isInProgress ? '🔥 Buyout' : '🎉 Offer accepted'}
        </p>
      </div>
      <div className="space-y-4 rounded-2xl bg-black p-4 text-white">
        <div className="space-y-2 text-px14 font-500 leading-[20px]">
          <div className="flex items-center space-x-1">
            <p>Accepted {isOver ? 'on' : 'in'}:</p>
            <CountdownTimer
              className="!text-px14 !font-700 !leading-[20px]"
              auctionEnd={buyoutInfo.endTime}
              showEndTime={isOver}
            />
          </div>
        </div>
        {isInProgress ? (
          <Button className="primary-danger w-full !text-white">
            {isOver ? 'Settle offer' : 'Review offer'}
          </Button>
        ) : (
          <Button className="primary w-full">View & claim</Button>
        )}
      </div>
    </NounCardWrapper>
  )
}

function BuyoutFinished(props: { nounId: string }) {
  const { nounId } = props

  return (
    <NounCardWrapper nounId={nounId}>
      <div className="flex items-center justify-between">
        <p className="font-londrina text-px32 font-900 leading-px36 text-black">NOUN {nounId}</p>
        <p className="text-px14 font-500 leading-px20">🎉 Offer accepted</p>
      </div>
      <div className="space-y-4 rounded-2xl bg-black p-4">
        <Button className="primary w-full">View & claim</Button>
      </div>
    </NounCardWrapper>
  )
}

function NounCardWrapper(props: { nounId: string; children: ReactNode }) {
  return (
    <Link href={`/noun/${props.nounId}`}>
      <div className="vault-list-tile flex w-full max-w-[300px] cursor-pointer flex-col gap-4">
        <div className="max-w-[300px] overflow-hidden rounded-2xl">
          <NounImage id={props.nounId} />
        </div>
        <div className="flex flex-col gap-4">{props.children}</div>
      </div>
    </Link>
  )
}
