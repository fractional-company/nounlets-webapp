import Button from 'components/buttons/button'
import CountdownTimer from 'components/countdown-timer'
import IconEth from 'components/icons/icon-eth'
import IconLinkOffsite from 'components/icons/icon-link-offsite'
import IconQuestionCircle from 'components/icons/icon-question-circle'
import CongratulationsModal from 'components/modals/congratulations-modal'
import SimpleAddress from 'components/simple-address'
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'
import useDisplayedNounlet, { NounletAuction } from 'hooks/useDisplayedNounlet'
import Image from 'next/image'

import userIcon from 'public/img/user-icon.jpg'
import { ChangeEvent, SyntheticEvent, useMemo, useRef, useState } from 'react'
import BidHistoryModal from '../modals/bid-history-modal'
import SimpleModal from '../simple-modal'
import { useAppState } from '../../store/application'
import { ChainId, getExplorerTransactionLink, useEthers } from '@usedapp/core'
import { CHAIN_ID } from '../../pages/_app'
import OnMounted from 'components/utils/on-mounted'
import { Auction } from '../../lib/wrappers/nounsAuction'
import { BigNumber, FixedNumber } from 'ethers'

type ComponentProps = {
  auction?: Auction
}

const MIN_BID_INCREASE = '0.0001'

export default function HomeHeroAuctionProgress(props: ComponentProps): JSX.Element {
  const { account } = useEthers()
  const { setBidModalOpen } = useAppState()
  const { data, auctionEndTime, bid } = useDisplayedNounlet()
  const [showEndTime, setShowEndTime] = useState(false)
  const bidInputRef = useRef<HTMLInputElement>(null)
  const [bidInputValue, setBidInputValue] = useState('')

  const currentBid = useMemo(() => {
    return BigNumber.from(data?.auctionInfo.amount ?? 0)
  }, [data])

  const currentBidEth = useMemo(
    () => FixedNumber.from(formatEther(currentBid)).round(4),
    [currentBid]
  )

  const minNextBidBN = useMemo(
    () => BigNumber.from(currentBidEth.addUnsafe(FixedNumber.from(MIN_BID_INCREASE))),
    [currentBidEth]
  )

  const minNextBidEth = useMemo(
    () => FixedNumber.from(formatEther(minNextBidBN)).round(4),
    [minNextBidBN]
  )

  const latestBidsList: JSX.Element[] = useMemo(() => {
    return []
    // return (props.auction.startTime ? [] : [{ sender: '', value: '', txHash: '', id: '' }])
    //   .slice(0, 3)
    //   .map((bid) => {
    //     const ethValue = new BigNumber(formatEther(bid.value)).toFixed(2)
    //     return (
    //       <div key={bid.id.toString()} className="flex items-center flex-1 py-2 overflow-hidden">
    //         <SimpleAddress
    //           avatarSize={24}
    //           address={bid.sender}
    //           className="text-px18 leading-px28 font-700 gap-2 flex-1"
    //         />
    //         <IconEth className="flex-shrink-0 h-[12px]" />
    //         <p className="ml-1 text-px18 leading-px28 font-700">{ethValue}</p>
    //         <a
    //           href={getExplorerTransactionLink(bid.txHash, CHAIN_ID as ChainId)}
    //           target="_blank"
    //           rel="noreferrer"
    //         >
    //           <IconLinkOffsite className="ml-3 flex-shrink-0 h-[12px]" />
    //         </a>
    //       </div>
    //     )
    //   })
  }, [])

  const handleBidInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = /^\d+\.?\d{0,4}$/
    try {
      if (event.target.value === '' || onlyNumbers.test(event.target.value)) {
        setBidInputValue(event.target.value)
      }
    } catch (error) {
      console.error('handleBidInputValue error', error)
    }
  }

  const [showWrongBidModal, setShowWrongBidModal] = useState(false)
  const handleBid = async () => {
    if (bidInputValue === '') return
    try {
      const bidAmount = parseEther(bidInputValue)
      if (bidAmount.gte(minNextBidBN)) {
        console.log('Proceed with bid!', bidAmount)
        const result = await bid(bidAmount)
        console.log('yas bid!', result)
      } else {
        setShowWrongBidModal(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const isBidButtonEnabled = useMemo(() => {
    if (bidInputValue === '') return false
    if (account == null) return false
    return true
  }, [bidInputValue, account])

  return (
    <div className="home-hero-auction space-y-3">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-x-14 lg:space-x-10 xl:space-x-14 sm:space-y-0">
        <div className="flex flex-col space-y-3">
          <p className="text-px18 leading-px22 font-500 text-gray-4">Current bid</p>
          <div className="flex items-center space-x-3">
            <IconEth className="flex-shrink-0" />
            <p className="text-px32 leading-[38px] font-700">{currentBidEth.toString()}</p>
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
            <CountdownTimer showEndTime={showEndTime} auctionEnd={auctionEndTime} />
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
            value={bidInputValue}
            onChange={handleBidInputValue}
            ref={bidInputRef}
            className="text-[25px] font-700 placeholder:text-gray-3 bg-transparent outline-none w-full"
            type="text"
            placeholder={`${minNextBidEth} or more`}
          />
        </div>

        <OnMounted>
          <Button className="primary !h-[52px]" onClick={handleBid} disabled={!isBidButtonEnabled}>
            Place bid
          </Button>
        </OnMounted>
      </div>

      <div className="latest-bids space-y-2 pt-5 lg:pt-0">
        <div className="flex flex-col divide-y divide-gray-2">{latestBidsList}</div>
        <p
          className="text-center text-gray-4 text-px16 leading-px24 font-500 cursor-pointer"
          onClick={() => setBidModalOpen(true)}
        >
          View all bids
        </p>
      </div>

      <SimpleModal
        className="vote-for-custom-wallet-modal !max-w-[472px]"
        isShown={showWrongBidModal}
        onClose={() => setShowWrongBidModal(false)}
      >
        <h2 className="font-700 text-px32 leading-px36 text-center">Insufficient bid amount 🤏</h2>
        <div className="mt-8 flex flex-col gap-3">
          <p className="font-500 text-px20 leading-px30 text-gray-4 text-center">
            Please place a bid higher than or equal to the minimum bid amount of{' '}
            <span className="font-900 text-black text-px22">{minNextBidEth.toString()} ETH</span>
          </p>
        </div>
      </SimpleModal>
    </div>
  )
}
