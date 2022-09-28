import classNames from 'classnames'
import Button from 'components/buttons/button'
import CountdownTimer from 'components/countdown-timer'
import SimpleProgressIndicator from 'components/simple-progress-indicator'
import SimpleXImage from 'components/simple-x-image'
import { BigNumber, FixedNumber } from 'ethers'
import useNounBuyout from 'hooks/useNounBuyout'
import Image from 'next/image'
import nounImage from 'public/img/noun.png'
import { useMemo, useState } from 'react'
import { useBuyoutHowDoesItWorkModalStore } from 'store/buyout/buyout-how-does-it-work-modal.store'

type ComponentProps = {
  isRejecting: boolean
}

export default function BuyoutAcceptRejectOfferModal(props: ComponentProps): JSX.Element {
  const { openBuyoutHowDoesItWorkModal } = useBuyoutHowDoesItWorkModalStore()
  const {
    buyoutInfo,
    nounletsOffered,
    nounletsOfferedCount,
    nounletsRemainingCount,
    nounletPercentage,
    buyNounlet
  } = useNounBuyout()

  const [showEndTime, setShowEndTime] = useState(false)
  const startTime = useMemo(() => buyoutInfo.startTime, [buyoutInfo])
  const endTime = useMemo(() => startTime.add(60 * 60 * 5), [startTime])

  const handleBuyNounlet = async (nounletId: number) => {
    console.log('buyign nounlet with id', nounletId)
    const result = await buyNounlet([nounletId])

    console.log('result?', { result })
  }

  return (
    <div className="buyout-accept-reject-offer-modal">
      <div className="flex flex-col gap-4 -mt-6">
        {props.isRejecting ? (
          <p className="text-px24 font-londrina text-gray-4">👎 Rejecting the offer</p>
        ) : (
          <p className="text-px24 font-londrina text-gray-4">👍 Accepting the offer</p>
        )}

        <div className="bg-gray-2 rounded-px16 p-4">
          {!props.isRejecting && (
            <div className="mb-4 -mt-4 -mx-4 rounded-t-px16 px-4 py-3 bg-black text-white text-center">
              <p className="font-500 text-px14">No action is required to accept the offer 😊</p>
            </div>
          )}
          <div className="text-center space-y-4">
            <p className="font-londrina text-px24 text-gray-4 leading-px36">
              Offer accepted {showEndTime ? 'at' : 'in'}
            </p>
            <div onClick={() => setShowEndTime(!showEndTime)}>
              <CountdownTimer
                auctionEnd={endTime}
                showEndTime={showEndTime}
                className="cursor-pointer font-londrina !text-px36 !space-x-3 !font-400 justify-center"
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

        <div className="bg-gray-2 rounded-px16 p-4">
          <div className="text-center space-y-3">
            <p className="font-londrina text-px24 text-gray-4 leading-px36">Nounlets remaining</p>
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
                      <Image src={nounImage} layout="responsive" alt="Noun" />
                    </SimpleXImage>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {props.isRejecting && (
          <div className="bg-gray-2 rounded-px16 p-4">
            <div className="text-center space-y-3">
              <p className="font-londrina text-px24 text-secondary-red leading-px36">
                Buy a Nounlet to reject the offer
              </p>
              <div className="bg-white rounded-px10 p-2">
                <Button className="default-outline --sm w-full">
                  Buy all ({nounletsRemainingCount}) Nounlets
                </Button>
              </div>
              <div className="flex flex-col justify-center gap-2">
                {nounletsOffered.map((nounlet) => {
                  return (
                    <div
                      key={nounlet.id}
                      className={classNames(
                        'bg-white rounded-px10 p-2 flex items-center gap-3',
                        nounlet.isAvailable ? '' : 'opacity-50'
                      )}
                    >
                      <div className="flex-shrink-0">
                        <SimpleXImage isXed={!nounlet.isAvailable}>
                          <Image src={nounImage} layout="responsive" alt="Noun" />
                        </SimpleXImage>
                      </div>
                      <div className="flex flex-col flex-1 text-start">
                        <p className="text-px16 leading-px24 font-700">Nounlet {nounlet.id}</p>
                        <p className="text-[13px] leading-px20 text-gray-4 font-500">
                          {buyoutInfo.formatted.fractionPrice} ETH
                        </p>
                      </div>
                      {nounlet.isAvailable ? (
                        <Button
                          className="primary --sm"
                          onClick={() => handleBuyNounlet(nounlet.id)}
                        >
                          Buy
                        </Button>
                      ) : (
                        <div className="inline-flex items-center justify-center h-10 px-4 rounded-px10 text-white bg-gray-4 font-700 text-px16 leading-px16">
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
