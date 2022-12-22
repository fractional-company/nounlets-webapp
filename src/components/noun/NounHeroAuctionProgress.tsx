import Button from 'src/components/common/buttons/Button'
import CountdownTimer from 'src/components/common/CountdownTimer'
import IconEth from 'src/components/common/icons/IconEth'
import IconQuestionCircle from 'src/components/common/icons/IconQuestionCircle'
import { formatEther, parseEther } from 'ethers/lib/utils'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'

import { Goerli, Mainnet, Rinkeby, useEthers } from '@usedapp/core'
import IconLinkOffsite from 'src/components/common/icons/IconLinkOffsite'
import SimpleAddress from 'src/components/common/simple/SimpleAddress'
import OnMounted from 'src/components/OnMounted'
import { CHAIN_ID, NEXT_PUBLIC_BID_DECIMALS } from 'config'
import { BigNumber, ethers, FixedNumber } from 'ethers'
import useSdk from 'src/hooks/utils/useSdk'
import { calculateNextBid } from 'src/lib/utils/nextBidCalculator'
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '../../store/application.store'
import SimpleModalWrapper from '../common/simple/SimpleModalWrapper'
import { debounce } from 'lodash'
import useToasts from 'src/hooks/utils/useToasts'
import { WrappedTransactionReceiptState } from 'src/lib/utils/txWithErrorHandling'
import { getCurrentChainExplorerTransactionLink } from 'src/lib/utils/common'
import { useNounStore } from 'src/store/noun.store'

export default function NounHeroAuctionProgress(): JSX.Element {
  const { account } = useEthers()
  const sdk = useSdk()
  const { toastSuccess, toastError } = useToasts()

  const { vaultAddress, nounletTokenAddress, minBidIncrease } = useNounStore()
  const {
    nid: nounletId,
    auctionData,
    auctionEndTime,
    historicBids,
    mutateAuctionInfo,
    bid
  } = useDisplayedNounlet(false)
  const { setBidModalOpen, setConnectModalOpen } = useAppStore()
  const [showEndTime, setShowEndTime] = useState(false)
  const bidInputRef = useRef<HTMLInputElement>(null)
  const [bidInputValue, setBidInputValue] = useState('')
  const [showWrongBidModal, setShowWrongBidModal] = useState(false)

  const currentBid = useMemo(() => {
    return BigNumber.from(auctionData?.auction!.highestBidAmount ?? 0)
  }, [auctionData])

  const currentBidFX = useMemo(() => FixedNumber.from(formatEther(currentBid)), [currentBid])

  const minNextBidFX = useMemo(
    () => calculateNextBid(currentBidFX.toString(), minBidIncrease),
    [currentBidFX, minBidIncrease]
  )

  const formattedValues = useMemo(() => {
    return {
      currentBid: currentBidFX.round(NEXT_PUBLIC_BID_DECIMALS).toString(),
      minNextBid: minNextBidFX.round(NEXT_PUBLIC_BID_DECIMALS).toString()
    }
  }, [currentBidFX, minNextBidFX])

  const isBidButtonEnabled = useMemo(() => {
    if (bidInputValue === '') return false
    return true
  }, [bidInputValue])

  const latestBidsList: JSX.Element[] = useMemo(() => {
    return historicBids.slice(0, 3).map((bid) => {
      const ethValue = FixedNumber.from(formatEther(bid.amount.toString()))
        .round(NEXT_PUBLIC_BID_DECIMALS)
        .toString()

      return (
        <div key={bid.id.toString()} className="flex flex-1 items-center overflow-hidden py-3">
          <SimpleAddress
            avatarSize={24}
            address={bid.bidder?.id || ethers.constants.AddressZero}
            className="flex-1 gap-2 text-px18 font-700 leading-px28"
          />
          <IconEth className="h-[12px] flex-shrink-0" />
          <p className="ml-1 text-px18 font-700 leading-px28">{ethValue}</p>
          <a href={getCurrentChainExplorerTransactionLink(bid.id)} target="_blank" rel="noreferrer">
            <IconLinkOffsite className="ml-3 h-[12px] flex-shrink-0" />
          </a>
        </div>
      )
    })
  }, [historicBids])

  const debouncedMutateAuctionInfo = useMemo(() => {
    return debounce(() => {
      return mutateAuctionInfo()
    }, 1000)
  }, [mutateAuctionInfo])

  useEffect(() => {
    if (sdk == null) return
    if (nounletId === '0') return

    // console.log('👍 setting bid listener for ', nounletId)
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
      event: any // IDK why this isn't BidEvent
    ) => {
      // console.log('🖐 bid event!', vault, token, id, bidder, amount, extendedTime, event)
      debouncedMutateAuctionInfo()
    }
    nounletAuction.on(bidFilter, listener)

    return () => {
      // console.log('👎 removing listener for', nounletId)
      nounletAuction.off(bidFilter, listener)
    }
  }, [vaultAddress, nounletTokenAddress, nounletId, sdk, debouncedMutateAuctionInfo])

  const handleTimerFinished = useCallback(() => {
    debouncedMutateAuctionInfo()
  }, [debouncedMutateAuctionInfo])

  // Currently unused
  const handleTimerTick = useCallback(() => {
    // debouncedMutateAuctionInfo()
  }, [debouncedMutateAuctionInfo])

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
    if (account == null) {
      setConnectModalOpen(true)
      return
    }
    if (bidInputValue === '') return

    setIsBidding(true)
    try {
      const bidAmount = parseEther(bidInputValue)
      if (bidAmount.gte(parseEther(formattedValues.minNextBid))) {
        const response = await bid(bidAmount)
        if (
          response.status === WrappedTransactionReceiptState.SUCCESS ||
          response.status === WrappedTransactionReceiptState.SPEDUP
        ) {
          await mutateAuctionInfo() // TODO maybe remove this
          toastSuccess('Bid accepted 🎉', 'woohooooo!')
          setBidInputValue('')
        } else if (response.status === WrappedTransactionReceiptState.ERROR) {
          throw response.data
        } else if (response.status === WrappedTransactionReceiptState.CANCELLED) {
          toastError('Transaction canceled', 'Please try again.')
        }
      } else {
        setShowWrongBidModal(true)
      }
    } catch (error) {
      toastError('Bid failed', 'Please try again.')
    }
    setIsBidding(false)
  }

  return (
    <div className="home-hero-auction space-y-3">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-14 sm:space-y-0 lg:space-x-10 xl:space-x-14">
        <div className="flex flex-col space-y-3">
          <p className="text-px18 font-500 leading-px22 text-gray-4">Current bid</p>
          <div className="flex items-center space-x-3">
            <IconEth className="flex-shrink-0" />
            <p className="text-px32 font-700 leading-[38px]">{formattedValues.currentBid}</p>
          </div>
        </div>
        <div className="border-black/20 sm:border-r-2"></div>
        <div
          className="flex cursor-pointer flex-col space-y-3"
          onClick={() => setShowEndTime(!showEndTime)}
        >
          <p className="text-px18 font-500 leading-px22 text-gray-4">
            {showEndTime ? 'Auction ends at' : 'Auction ends in'}
          </p>
          <div className="flex items-center">
            <CountdownTimer
              showEndTime={showEndTime}
              auctionEnd={auctionEndTime}
              onTimerFinished={handleTimerFinished}
              onTimerTick={handleTimerTick}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-px14 font-500 leading-px24 text-gray-4">
        <IconQuestionCircle className="flex-shrink-0" />
        <p>
          You are bidding for 1% ownership of the Noun.{' '}
          <a
            href="https://medium.com/tessera-nft/nounlets-explained-faq-57e9bc537d93"
            target="_blank"
            className="font-700 text-secondary-blue"
            rel="noreferrer"
          >
            Read more
          </a>
        </p>
      </div>

      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
        <div className="bid-input flex flex-1 items-center space-x-1 rounded-px10 bg-gray-1 px-4 leading-[52px] focus-within:outline-dashed focus-within:outline-[3px] lg:bg-white">
          <IconEth className="h-[12px] flex-shrink-0 text-gray-3" />
          <input
            value={bidInputValue}
            onChange={handleBidInputValue}
            ref={bidInputRef}
            className="w-full bg-transparent text-[25px] font-700 outline-none placeholder:text-gray-3"
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
        <div className="flex flex-col divide-y divide-black/10">{latestBidsList}</div>
        {latestBidsList.length === 0 ? (
          <p className="text-center text-px16 font-500 leading-px24 text-gray-4">
            No bids yet. Be the first!
          </p>
        ) : (
          <p
            className="cursor-pointer text-center text-px16 font-500 leading-px24 text-gray-4"
            onClick={() => setBidModalOpen(true)}
          >
            View all bids
          </p>
        )}
      </div>

      <SimpleModalWrapper
        className="vote-for-custom-wallet-modal !max-w-[600px]"
        isShown={showWrongBidModal}
        onClose={() => setShowWrongBidModal(false)}
      >
        <h2 className="-mt-3 -mb-4 font-londrina text-px42">
          Insufficient bid <span className="hidden sm:inline">amount</span>{' '}
          <span className="hidden xs:inline">🤏</span>
        </h2>
        <div className="mt-8 flex flex-col gap-3">
          <p className="text-center text-px20 font-500 leading-px30 text-gray-4">
            Please place a bid higher than or equal to the minimum bid amount of{' '}
            <span className="text-px22 font-900 text-black">{formattedValues.minNextBid} ETH</span>
          </p>
        </div>
      </SimpleModalWrapper>
    </div>
  )
}
