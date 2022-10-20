import Button from 'src/components/common/buttons/Button'
import IconEth from 'src/components/common/icons/IconEth'
import SimpleAddress from 'src/components/common/simple/SimpleAddress'
import { ethers, FixedNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'

import { useEthers } from '@usedapp/core'
import IconSpinner from 'src/components/common/icons/IconSpinner'
import { NEXT_PUBLIC_BID_DECIMALS } from 'config'
import dayjs from 'dayjs'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
import useToasts from 'src/hooks/useToasts'
import { getCurrentChainExplorerTransactionLink } from 'src/lib/utils/common'
import { WrappedTransactionReceiptState } from 'src/lib/utils/tx-with-error-handling'
import { useMemo, useState } from 'react'
import { unstable_serialize, useSWRConfig } from 'swr'
import { useAppStore } from '../../store/application'
import IconBidHistory from '../common/icons/IconBidHistory'
import IconHeart from '../common/icons/IconHeart'
import IconLock from '../common/icons/IconLock'
import IconVerified from '../common/icons/IconVerified'

export default function NounHeroAuctionCompleted(): JSX.Element {
  const { account } = useEthers()
  const { mutate: globalMutate } = useSWRConfig()
  const { setBidModalOpen, setCongratulationsModalForNounletId, setConnectModalOpen } =
    useAppStore()
  const { toastSuccess, toastError } = useToasts()
  const { nid, vaultAddress, endedAuctionInfo, settleAuction, historicBids, nounTokenId } =
    useDisplayedNounlet()

  const formattedData = useMemo(() => {
    const isLoading = endedAuctionInfo == null
    const winningBid = FixedNumber.from(formatEther(endedAuctionInfo?.winningBid ?? 0))
      .round(NEXT_PUBLIC_BID_DECIMALS)
      .toString()
    const hasBids = endedAuctionInfo?.winningBid !== '0'
    const heldByAddress = endedAuctionInfo?.heldByAddress
    const endedOn = dayjs((endedAuctionInfo?.endedOn ?? 0) * 1000).format('h:mmA, MMMM D, YYYY')
    const wonByAddress = endedAuctionInfo?.wonByAddress || ethers.constants.AddressZero

    return {
      isLoading,
      isSettled: !!endedAuctionInfo?.isSettled,
      settledTransactionHash:
        endedAuctionInfo?.settledTransactionHash || ethers.constants.AddressZero,
      winningBid,
      heldByAddress,
      endedOn,
      hasBids,
      wonByAddress
    }
  }, [endedAuctionInfo])

  const [isSettlingAuction, setIsSettlingAuction] = useState(false)
  const handleSettleAuction = async () => {
    if (account == null) {
      setConnectModalOpen(true)
      return
    }
    setIsSettlingAuction(true)

    try {
      const nounTokenIdTmp = nounTokenId
      const nounletId = '' + nid
      const response = await settleAuction()

      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        if (formattedData.wonByAddress.toLowerCase() === account?.toLowerCase()) {
          setCongratulationsModalForNounletId(true, nounletId)
          // setIsCongratulationsModalShown(true)
        }
        console.log('settle mutate')
        await globalMutate(
          // unstable_serialize({
          //   name: 'VaultMetadata',
          //   vaultAddress: vaultAddress
          // })
          `noun/${nounTokenIdTmp}`
        )
        const message = nounletId === '100' ? "Aaaaaand we're done!" : 'On to the next one!'
        toastSuccess('Auction settled 🎊', message)
        // await mutateDisplayedNounletAuctionInfo() // not needed since there is no new events
      } else {
        throw response
      }
    } catch (error) {
      console.error('settling auction failed', error)
      toastError('Settling failed', 'Please try again.')
      // Only stop the spinner if it errors, since if it succedes
      // the vault refresh will update the UI
      setIsSettlingAuction(false)
    }
  }

  const isLoadingHeldByAddress = useMemo(() => {
    return formattedData.heldByAddress == null
  }, [formattedData.heldByAddress])

  const isSettledTransactionIndexing = useMemo(() => {
    return formattedData.settledTransactionHash === ethers.constants.AddressZero
  }, [formattedData.settledTransactionHash])

  const test = () => {
    setCongratulationsModalForNounletId(true, '10')
  }
  return (
    <div className="home-hero-auction lg:min-h-[21.875rem]">
      {/* <pre
        onClick={() => {
          test()
        }}
      >
        {JSON.stringify(endedAuctionInfo, null, 2)}
      </pre> */}

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-x-14 lg:space-x-10 xl:space-x-14 sm:space-y-0">
        <div className="flex flex-col space-y-3">
          <p className="text-px18 leading-px22 font-500 text-gray-4">Winning bid</p>
          <div className="flex items-center space-x-3">
            <IconEth className="flex-shrink-0" />
            <p className="text-px32 leading-[38px] font-700">
              {formattedData.hasBids ? formattedData.winningBid : 'n/a'}
            </p>
          </div>
        </div>
        <div className="sm:border-r-2 border-black/20"></div>
        <div className="flex flex-col space-y-3 cursor-pointer">
          {formattedData.heldByAddress === ethers.constants.AddressZero ? (
            <>
              <p className="text-px18 leading-px22 font-500 text-gray-4">Nounlet held by</p>
              <div className="flex items-center">
                <p className="text-px32 leading-[38px] font-700 text-secondary-red">🔥🔥🔥</p>
              </div>
            </>
          ) : (
            <>
              <p className="text-px18 leading-px22 font-500 text-gray-4">Nounlet held by</p>
              <div className="flex items-center">
                {isLoadingHeldByAddress ? (
                  <IconSpinner className="animate-spin text-gray-3" />
                ) : (
                  <SimpleAddress
                    avatarSize={32}
                    address={formattedData.heldByAddress!}
                    className="text-px32 leading-[38px] font-700 gap-2 flex-1"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center !mt-6">
        <IconLock className="mb-1" />
        <p className="text-px18 font-500 ml-2">
          Ended on <span className="font-700 text-black/60">{formattedData.endedOn}</span>
        </p>
      </div>
      <div className="flex items-center mt-3">
        <IconHeart />
        <div className="text-px18 font-500 ml-2">
          {formattedData.hasBids ? 'Won by ' : 'No bids: Nounlet transferred to curator '}
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
              disabled={historicBids.length === 0}
            >
              <IconBidHistory className="mr-2.5" /> Bid history
            </Button>
            <a
              href={getCurrentChainExplorerTransactionLink(formattedData.settledTransactionHash)}
              target="_blank"
              rel="noreferrer"
              className={isSettledTransactionIndexing ? 'pointer-events-none' : ''}
            >
              <Button
                className="text-px18 leading-px26 basic default !h-11"
                disabled={isSettledTransactionIndexing}
              >
                {isSettledTransactionIndexing ? (
                  <span>Indexing...</span>
                ) : (
                  <>
                    <IconVerified className="mr-2.5" /> <span>Etherscan</span>
                  </>
                )}
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
              Settle{'' + nid !== '100' ? ' & start next auction' : ''}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
