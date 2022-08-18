import Button from 'components/buttons/button'
import CountdownTimer from 'components/countdown-timer'
import IconEth from 'components/icons/icon-eth'
import IconLinkOffsite from 'components/icons/icon-link-offsite'
import IconQuestionCircle from 'components/icons/icon-question-circle'
import CongratulationsModal from 'components/modals/congratulations-modal'
import SimpleAddress from 'components/simple-address'
import { BigNumberish, ethers, FixedNumber } from 'ethers'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import Image from 'next/image'

import userIcon from 'public/img/user-icon.jpg'
import { useMemo, useState } from 'react'
import BidHistoryModal from '../modals/bid-history-modal'
import SimpleModal from '../simple-modal'
import IconLock from '../icons/icon-lock'
import IconHeart from '../icons/icon-heart'
import IconBidHistory from '../icons/icon-bid-history'
import IconVerified from '../icons/icon-verified'
import { buildEtherscanAddressLink } from '../../lib/utils/etherscan'
import { useAppStore } from '../../store/application'
import dayjs from 'dayjs'
import useOnDisplayAuction, { useAuctionBids } from '../../lib/wrappers/onDisplayAuction'
import { Auction } from '../../lib/wrappers/nounsAuction'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import { BID_DECIMALS } from 'config'
import { useEthers } from '@usedapp/core'

export default function HomeHeroAuctionCompleted(): JSX.Element {
  const { account } = useEthers()
  const { setBidModalOpen } = useAppStore()
  const { endedAuctionInfo, settleAuction } = useDisplayedNounlet()

  const formattedData = useMemo(() => {
    const isLoading = endedAuctionInfo == null
    const winningBid = FixedNumber.from(formatEther(endedAuctionInfo?.winningBid ?? 0))
      .round(BID_DECIMALS)
      .toString()
    const heldByAddress = endedAuctionInfo?.heldByAddress || ethers.constants.AddressZero
    const endedOn = dayjs((endedAuctionInfo?.endedOn ?? 0) * 1000).format('h:mmA, MMMM D, YYYY')
    const wonByAddress = endedAuctionInfo?.wonByAddress || ethers.constants.AddressZero

    return {
      isLoading,
      isSettled: !!endedAuctionInfo?.isSettled,
      winningBid,
      heldByAddress,
      endedOn,
      wonByAddress
    }
  }, [endedAuctionInfo])

  const [isCongratulationsModalShown, setIsCongratulationsModalShown] = useState(false)
  const [isSettlingAuction, setIsSettlingAuction] = useState(false)
  const handleSettleAuction = async () => {
    console.log('handle settle!')
    setIsSettlingAuction(true)

    try {
      const result = await settleAuction()
      console.log('result of settling', result)
      if (formattedData.heldByAddress.toLowerCase() === account?.toLowerCase()) {
        setIsCongratulationsModalShown(true)
      }
    } catch (error) {
      console.error('settling auction failed', error)
    }

    setIsSettlingAuction(false)
  }

  return (
    <div className="home-hero-auction lg:min-h-[21.875rem]">
      {/* <pre>{JSON.stringify(endedAuctionInfo, null, 2)}</pre> */}

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-x-14 lg:space-x-10 xl:space-x-14 sm:space-y-0">
        <div className="flex flex-col space-y-3">
          <p className="text-px18 leading-px22 font-500 text-gray-4">Winning bid</p>
          <div className="flex items-center space-x-3">
            <IconEth className="flex-shrink-0" />
            <p className="text-px32 leading-[38px] font-700">{formattedData.winningBid}</p>
          </div>
        </div>
        <div className="sm:border-r-2 border-gray-2"></div>
        <div className="flex flex-col space-y-3 cursor-pointer">
          <p className="text-px18 leading-px22 font-500 text-gray-4">Nounlet held by</p>
          <div className="flex items-center">
            <SimpleAddress
              avatarSize={32}
              address={formattedData.heldByAddress}
              className="text-px32 leading-[38px] font-700 gap-2 flex-1"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center !mt-6">
        <IconLock />
        <p className="text-px18 font-500 ml-1.5">
          Ended on <span className="font-700 text-gray-3">{formattedData.endedOn}</span>
        </p>
      </div>
      <div className="flex items-center mt-3">
        <IconHeart />
        <div className="text-px18 font-500 ml-1.5">
          Won by{' '}
          <SimpleAddress
            address={formattedData.wonByAddress}
            className="font-700 gap-2 flex-1 text-secondary-blue inline-flex"
          />
        </div>
      </div>

      <div className="flex space-x-4 !mt-8">
        {formattedData.isSettled ? (
          <>
            <Button
              key={0}
              className="text-px18 leading-px26 basic default !h-11"
              onClick={() => setBidModalOpen(true)}
            >
              <IconBidHistory className="mr-2.5" /> Bid history
            </Button>
            <a
              href={buildEtherscanAddressLink('0x0000000000000000000000000000000000000000 ')}
              target="_blank"
              rel="noreferrer"
            >
              <Button className="text-px18 leading-px26 basic default !h-11">
                <IconVerified className="mr-2.5" /> Etherscan
              </Button>
            </a>
          </>
        ) : (
          <>
            <Button
              key={1}
              className="primary !h-[52px] w-full"
              loading={isSettlingAuction}
              onClick={() => handleSettleAuction()}
            >
              Settle & start next auction
            </Button>
            <CongratulationsModal
              isShown={isCongratulationsModalShown}
              onClose={() => {
                setIsCongratulationsModalShown(false)
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
