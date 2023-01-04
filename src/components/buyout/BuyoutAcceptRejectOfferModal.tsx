import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import Button from 'src/components/common/buttons/Button'
import CountdownTimer from 'src/components/common/CountdownTimer'
import { NounletImage } from 'src/components/common/NounletImage'
import SimpleProgressIndicator from 'src/components/common/simple/SimpleProgressIndicator'
import SimpleXImage from 'src/components/common/simple/SimpleXImage'
import { BigNumber, FixedNumber } from 'ethers'
import useNounBuyout from 'src/hooks/useNounBuyout'
import useToasts from 'src/hooks/utils/useToasts'
import { WrappedTransactionReceiptState } from 'src/lib/utils/txWithErrorHandling'
import Image from 'next/image'
import nounImage from 'public/img/noun.png'
import { useMemo, useState } from 'react'
import { useAppStore } from 'src/store/application.store'
import { useBuyoutHowDoesItWorkModalStore } from 'src/store/buyout/buyoutHowDoesItWorkModal.store'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'

type ComponentProps = {
  isRejecting: boolean
}

export default function BuyoutAcceptRejectOfferModal(props: ComponentProps): JSX.Element {
  const { account } = useEthers()
  const { openBuyoutHowDoesItWorkModal } = useBuyoutHowDoesItWorkModalStore()
  const {
    buyoutInfo,
    nounletsOffered,
    nounletsOfferedCount,
    nounletsRemaining,
    nounletsRemainingCount,
    nounletPercentage,
    buyNounlet,
    mutate
  } = useNounBuyout()
  const { toastSuccess, toastError } = useToasts()
  const [isBuyingNounlet, setIsBuyingNounlet] = useState(false)
  const { setConnectModalOpen } = useAppStore()
  const { nounTokenId, nounletTokenAddress } = useDisplayedNounlet()

  const [showEndTime, setShowEndTime] = useState(false)
  const endTime = useMemo(() => buyoutInfo.endTime, [buyoutInfo])

  const handleBuyNounlet = async (nounletId: number) => {
    if (account == null) {
      setConnectModalOpen(true)
      return
    }

    try {
      setIsBuyingNounlet(true)
      const response = await buyNounlet([nounletId])
      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        toastSuccess('Snatched one! 💫', "Bam, it's yours!")
        await mutate()
      } else if (response.status === WrappedTransactionReceiptState.ERROR) {
        throw response.data
      } else if (response.status === WrappedTransactionReceiptState.CANCELLED) {
        toastError('Transaction canceled', 'Please try again.')
      }
    } catch (error) {
      console.log(error)
      toastError('Buying failed :(', 'Please try again.')
    } finally {
      setIsBuyingNounlet(false)
    }
  }

  const handleBuyAllRemainingNounlets = async () => {
    if (account == null) {
      setConnectModalOpen(true)
      return
    }

    try {
      setIsBuyingNounlet(true)
      const response = await buyNounlet(nounletsRemaining.map((nounlet) => nounlet.id))
      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        toastSuccess("Gotta catch 'em all ⭐️", 'Nounlet...mons?')
        await mutate()
      } else if (response.status === WrappedTransactionReceiptState.ERROR) {
        throw response.data
      } else if (response.status === WrappedTransactionReceiptState.CANCELLED) {
        toastError('Transaction canceled', 'Please try again.')
      }
    } catch (error) {
      console.log(error)
      toastError('Buying all failed :(', 'Please try again.')
    } finally {
      setIsBuyingNounlet(false)
    }
  }

  return (
    <div className="buyout-accept-reject-offer-modal">
      <div className="flex flex-col gap-4">
        {props.isRejecting ? (
          <p className="font-londrina text-px24 text-gray-4">👎 Rejecting the offer</p>
        ) : (
          <p className="font-londrina text-px24 text-gray-4">👍 Accepting the offer</p>
        )}

        <div className="rounded-px16 bg-gray-2 p-4">
          {!props.isRejecting && (
            <div className="-mx-4 mb-4 -mt-4 rounded-t-px16 bg-black px-4 py-3 text-center text-white">
              <p className="text-px14 font-500">No action is required to accept the offer 😊</p>
            </div>
          )}
          <div className="space-y-4 text-center">
            <p className="font-londrina text-px24 leading-px36 text-gray-4">
              Offer accepted {showEndTime ? 'at' : 'in'}
            </p>
            <div onClick={() => setShowEndTime(!showEndTime)}>
              <CountdownTimer
                auctionEnd={endTime}
                showEndTime={showEndTime}
                className="cursor-pointer justify-center !space-x-3 font-londrina !text-px36 !font-400"
              />
            </div>
            <p className="text-px16 font-500 text-gray-4">
              Current and future Nounlet owners have 7 days to reject the offer by buying all
              offered Nounlets for ETH.{' '}
              <Button
                onClick={openBuyoutHowDoesItWorkModal}
                className="link text-secondary-blue hover:text-secondary-green"
              >
                How does it work?
              </Button>
            </p>
          </div>
        </div>

        <div className="rounded-px16 bg-gray-2 p-4">
          <div className="space-y-3 text-center">
            <p className="font-londrina text-px24 leading-px36 text-gray-4">Nounlets remaining</p>
            <p className="font-londrina text-px42">
              {nounletsRemainingCount}
              <span className="text-px20">/{nounletsOfferedCount}</span>
            </p>
            <SimpleProgressIndicator percentage={nounletPercentage} />
            {!props.isRejecting && (
              <div className="flex flex-wrap justify-center gap-2">
                {nounletsOffered.map((nounlet) => {
                  return (
                    <SimpleXImage key={nounlet.id} isXed={!nounlet.isAvailable}>
                      <NounletImage
                        noundId={nounTokenId}
                        nounletTokenAddress={nounletTokenAddress}
                        id={nounlet.id + ''}
                      />
                    </SimpleXImage>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {props.isRejecting && (
          <div className="rounded-px16 bg-gray-2 p-4">
            <div className="space-y-3 text-center">
              <p className="font-londrina text-px24 leading-px36 text-secondary-red">
                Buy a Nounlet to reject the offer
              </p>
              <div className="rounded-px10 bg-white p-2">
                <Button
                  className="default-outline --sm w-full"
                  onClick={handleBuyAllRemainingNounlets}
                  loading={isBuyingNounlet}
                >
                  Buy all ({nounletsRemainingCount}) Nounlets
                </Button>
              </div>
              <div className="flex flex-col justify-center gap-2">
                {nounletsOffered.map((nounlet) => {
                  return (
                    <div
                      key={nounlet.id}
                      className={classNames(
                        'flex items-center gap-3 rounded-px10 bg-white p-2',
                        nounlet.isAvailable ? '' : 'opacity-50'
                      )}
                    >
                      <div className="flex-shrink-0">
                        <SimpleXImage isXed={!nounlet.isAvailable}>
                          <NounletImage
                            noundId={nounTokenId}
                            nounletTokenAddress={nounletTokenAddress}
                            id={'' + nounlet.id}
                          />
                        </SimpleXImage>
                      </div>
                      <div className="flex flex-1 flex-col text-start">
                        <p className="text-px16 font-700 leading-px24">Nounlet {nounlet.id}</p>
                        <p className="text-[13px] font-500 leading-px20 text-gray-4">
                          {buyoutInfo.formatted.fractionPrice} ETH
                        </p>
                      </div>
                      {nounlet.isAvailable ? (
                        <Button
                          className="primary --sm"
                          onClick={() => handleBuyNounlet(nounlet.id)}
                          loading={isBuyingNounlet}
                        >
                          Buy
                        </Button>
                      ) : (
                        <div className="inline-flex h-10 items-center justify-center rounded-px10 bg-gray-4 px-4 text-px16 font-700 leading-px16 text-white">
                          Sold
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
