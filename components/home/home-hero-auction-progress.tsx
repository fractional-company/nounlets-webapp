import Button from 'components/buttons/button'
import CountdownTimer from 'components/countdown-timer'
import IconEth from 'components/icons/icon-eth'
import IconQuestionCircle from 'components/icons/icon-question-circle'
import { formatEther, parseEther } from 'ethers/lib/utils'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'

import { useEthers } from '@usedapp/core'
import IconLinkOffsite from 'components/icons/icon-link-offsite'
import SimpleAddress from 'components/simple-address'
import OnMounted from 'components/utils/on-mounted'
import { NEXT_PUBLIC_BID_DECIMALS } from 'config'
import { BigNumber, FixedNumber } from 'ethers'
import useSdk from 'hooks/useSdk'
import { calculateNextBid } from 'lib/utils/nextBidCalculator'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useVaultStore } from 'store/vaultStore'
import { Auction } from '../../lib/wrappers/nounsAuction'
import { useAppStore } from '../../store/application'
import SimpleModal from '../simple-modal'

type ComponentProps = {
  auction?: Auction
}

export default function HomeHeroAuctionProgress(props: ComponentProps): JSX.Element {
  const { account } = useEthers()
  const sdk = useSdk()

  const { isLoading, vaultAddress, nounletTokenAddress, latestNounletTokenId, minBidIncrease } =
    useVaultStore()
  const {
    nid: nounletId,
    auctionInfo,
    auctionEndTime,
    historicBids,
    mutateDisplayedNounletAuctionInfo,
    bid
  } = useDisplayedNounlet(false)
  const { setBidModalOpen } = useAppStore()
  const [showEndTime, setShowEndTime] = useState(false)
  const bidInputRef = useRef<HTMLInputElement>(null)
  const [bidInputValue, setBidInputValue] = useState('')
  const [showWrongBidModal, setShowWrongBidModal] = useState(false)

  const currentBid = useMemo(() => {
    return BigNumber.from(auctionInfo?.auction!.amount ?? 0)
  }, [auctionInfo])

  const currentBidFX = useMemo(() => FixedNumber.from(formatEther(currentBid)), [currentBid])

  const minNextBidFX = useMemo(
    () => calculateNextBid(currentBidFX.toString(), minBidIncrease),
    [currentBidFX, minBidIncrease]
  )

  const formattedValues = useMemo(() => {
    return {
      currrentBid: currentBidFX.round(NEXT_PUBLIC_BID_DECIMALS).toString(),
      minNextBid: minNextBidFX.round(NEXT_PUBLIC_BID_DECIMALS).toString()
    }
  }, [currentBidFX, minNextBidFX])

  const isBidButtonEnabled = useMemo(() => {
    if (bidInputValue === '') return false
    if (account == null) return false
    return true
  }, [bidInputValue, account])

  const latestBidsList: JSX.Element[] = useMemo(() => {
    console.log('latestbits', historicBids)
    return historicBids.slice(0, 3).map((bid) => {
      const ethValue = FixedNumber.from(formatEther(bid.amount.toString()))
        .round(NEXT_PUBLIC_BID_DECIMALS)
        .toString()
      return (
        <div key={bid.id.toString()} className="flex items-center flex-1 py-2 overflow-hidden">
          <SimpleAddress
            avatarSize={24}
            address={bid.bidder?.id || '0x0'}
            className="text-px18 leading-px28 font-700 gap-2 flex-1"
          />
          <IconEth className="flex-shrink-0 h-[12px]" />
          <p className="ml-1 text-px18 leading-px28 font-700">{ethValue}</p>
          <a href={''} target="_blank" rel="noreferrer">
            <IconLinkOffsite className="ml-3 flex-shrink-0 h-[12px]" />
          </a>
        </div>
      )
    })
  }, [historicBids])

  useEffect(() => {
    if (sdk == null) return
    if (nounletId === '0') return

    console.log('👍 setting bid listener for ', nounletId)
    const nounletAuction = sdk.NounletAuction
    const bidFilter = nounletAuction.filters.Bid(
      vaultAddress,
      nounletTokenAddress,
      nounletId,
      null,
      null
    )

    const listener = (
      vault: string,
      token: string,
      id: BigNumber,
      bidder: string,
      amount: BigNumber,
      extendedTime: BigNumber,
      event: any // IDK why this isnt BidEvent
    ) => {
      console.log('🖐 bid event!', vault, token, id, bidder, amount, extendedTime, event)
      mutateDisplayedNounletAuctionInfo()
    }
    nounletAuction.on(bidFilter, listener)

    return () => {
      console.log('👎 removing listener for', nounletId)
      nounletAuction.off(bidFilter, listener)
    }
  }, [vaultAddress, nounletTokenAddress, nounletId, sdk, mutateDisplayedNounletAuctionInfo])

  const handleTimerFinished = () => {
    mutateDisplayedNounletAuctionInfo()
    console.log('finished timer!')
  }

  const handleBidInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = new RegExp(`^\\d+\\.?\\d{0,${NEXT_PUBLIC_BID_DECIMALS}}$`)
    try {
      if (event.target.value === '' || onlyNumbers.test(event.target.value)) {
        setBidInputValue(event.target.value)
      }
    } catch (error) {
      console.error('handleBidInputValue error', error)
    }
  }

  const [isBidding, setIsBidding] = useState(false)
  const handleBid = async () => {
    if (bidInputValue === '') return
    setIsBidding(true)
    try {
      const bidAmount = parseEther(bidInputValue)
      if (bidAmount.gte(parseEther(formattedValues.minNextBid))) {
        console.log('Proceed with bid!', bidAmount)
        const result = await bid(bidAmount)
        console.log('yas bid!', result)
        setBidInputValue('')
      } else {
        setShowWrongBidModal(true)
      }
    } catch (error) {
      console.error(error)
    }
    setIsBidding(false)
  }

  return (
    <div className="home-hero-auction space-y-3">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-x-14 lg:space-x-10 xl:space-x-14 sm:space-y-0">
        <div className="flex flex-col space-y-3">
          <p className="text-px18 leading-px22 font-500 text-gray-4">Current bid</p>
          <div className="flex items-center space-x-3">
            <IconEth className="flex-shrink-0" />
            <p className="text-px32 leading-[38px] font-700">{formattedValues.currrentBid}</p>
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
              auctionEnd={auctionEndTime}
              onTimerFinished={handleTimerFinished}
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
            value={bidInputValue}
            onChange={handleBidInputValue}
            ref={bidInputRef}
            className="text-[25px] font-700 placeholder:text-gray-3 bg-transparent outline-none w-full"
            type="text"
            placeholder={`${formattedValues.minNextBid} or more`}
          />
        </div>

        <OnMounted>
          <Button
            className="primary !h-[52px]"
            onClick={handleBid}
            disabled={!isBidButtonEnabled}
            loading={isBidding}
          >
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
            <span className="font-900 text-black text-px22">{formattedValues.minNextBid} ETH</span>
          </p>
        </div>
      </SimpleModal>
    </div>
  )
}
