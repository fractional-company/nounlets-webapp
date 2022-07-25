import Button from 'components/buttons/button'
import CountdownTimer from 'components/countdown-timer'
import IconEth from 'components/icons/icon-eth'
import IconLinkOffsite from 'components/icons/icon-link-offsite'
import IconQuestionCircle from 'components/icons/icon-question-circle'
import CongratulationsModal from 'components/modals/congratulations-modal'
import SimpleAddress from 'components/simple-address'
import { BigNumber, BigNumberish, ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { NounletAuction } from 'hooks/useDisplayedNounlet'
import Image from 'next/image'

import userIcon from 'public/img/user-icon.jpg'
import { useMemo, useState } from 'react'
import BidHistoryModal from '../modals/bid-history-modal'
import SimpleModal from '../simple-modal'

type ComponentProps = {
  auction: NounletAuction
}

export default function HomeHeroAuctionProgress(props: ComponentProps): JSX.Element {
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false)
  const [showEndTime, setShowEndTime] = useState(false)
  const currentBidEth = useMemo(() => formatUnits(props.auction.amount), [props.auction.amount])
  const minNextBidEth = useMemo(
    () => formatUnits(props.auction.amount.add('10000000000000000')),
    [props.auction.amount]
  )

  // console.log(ethers, props.auction.amount)
  // formatUnits(props.currentBid, 18)

  const showBidModalHandler = () => {
    setShowBidHistoryModal(true)
  }
  const dismissBidModalHandler = () => {
    setShowBidHistoryModal(false)
  }

  const [isCongratulationsModalShown, setIsCongratulationsModalShown] = useState(false)
  const latestBidsList: JSX.Element[] = useMemo(() => {
    return [1, 2, 3].map((bid) => {
      return (
        <div key={bid} className="flex items-center flex-1 py-2 overflow-hidden">
          {/* <Image
            src={userIcon}
            alt="icon"
            width="24"
            height="24"
            className="overflow-hidden rounded-full flex-shrink-0"
          />
          <p className="ml-2 text-px18 leading-px28 font-700 flex-1 truncate">0x497F...72E0</p> */}
          <SimpleAddress
            avatarSize={24}
            address="0x497F34f8A6EaB10652f846fD82201938e58d72E0"
            className="text-px18 leading-px28 font-700 gap-2 flex-1"
          />
          <IconEth className="flex-shrink-0 h-[12px]" />
          <p className="ml-1 text-px18 leading-px28 font-700">0.12</p>
          <IconLinkOffsite className="ml-3 flex-shrink-0 h-[12px]" />
        </div>
      )
    })
  }, [])

  return (
    <div className="home-hero-auction space-y-3">
      <SimpleModal onClose={dismissBidModalHandler} isShown={showBidHistoryModal}>
        <BidHistoryModal />
      </SimpleModal>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-x-14 lg:space-x-10 xl:space-x-14 sm:space-y-0">
        <div className="flex flex-col space-y-3">
          <p className="text-px18 leading-px22 font-500 text-gray-4">Current bid</p>
          <div className="flex items-center space-x-3">
            <IconEth className="flex-shrink-0" />
            <p className="text-px32 leading-[38px] font-700">{currentBidEth}</p>
          </div>
        </div>
        <div className="sm:border-r-2 border-gray-2"></div>
        <div
          className="flex flex-col space-y-3 cursor-pointer"
          onClick={() => setShowEndTime(!showEndTime)}
        >
          <p className="text-px18 leading-px22 font-500 text-gray-4">
            {showEndTime ? 'Auction ends at' : 'Auction ends in'}
          </p>
          <div className="flex items-center">
            <CountdownTimer
              showEndTime={showEndTime}
              auctionStart={props.auction.startTime}
              auctionEnd={props.auction.endTime}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-gray-4 text-px14 leading-px24 font-500">
        <IconQuestionCircle className="flex-shrink-0" />
        <p>
          You are bidding for 1% ownership of the Noun.{' '}
          <span className="font-700 text-secondary-blue">Read more</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="bid-input flex items-center space-x-1 bg-gray-1 lg:bg-white rounded-px10 px-4 leading-[52px] focus-within:outline-dashed flex-1">
          <IconEth className="flex-shrink-0 h-[12px] text-gray-3" />
          <input
            className="text-[25px] font-700 placeholder:text-gray-3 bg-transparent outline-none w-full"
            type="text"
            placeholder={`${minNextBidEth} or more`}
          />
        </div>

        <Button className="primary !h-[52px]">Place bid</Button>
      </div>

      <div className="latest-bids space-y-2 pt-5 lg:pt-0">
        <div className="flex flex-col divide-y divide-gray-2">{latestBidsList}</div>
        <p
          className="text-center text-gray-4 text-px16 leading-px24 font-500 cursor-pointer"
          onClick={showBidModalHandler}
        >
          View all bids
        </p>
      </div>

      <Button
        className="primary !h-[52px] w-full"
        onClick={() => setIsCongratulationsModalShown(true)}
      >
        Settle auction
      </Button>

      <CongratulationsModal
        isShown={isCongratulationsModalShown}
        onClose={() => {
          setIsCongratulationsModalShown(false)
        }}
      />
    </div>
  )
}
