import { NounImage } from 'src/components/common/NounletImage'
import useCurrentBackground from 'src/hooks/utils/useCurrentBackground'
import useNounBuyout from 'src/hooks/useNounBuyout'
import { useMemo } from 'react'
import { BuyoutState, useBuyoutStore } from 'src/store/buyout/buyout.store'
import BuyoutLiveRejectionsCard from './BuyoutLiveRejectionsCard'
import BuyoutOfferCard from './BuyoutOfferCard'
import BuyoutOfferLiveCard from './BuyoutOfferLiveCard'
import BuyoutOfferingDisplay from './BuyoutOfferingDisplay'
import BuyoutPastOffers from './BuyoutPastOffers'
import BuyoutSecondaryMarketCard from './BuyoutSecondaryMarketCard'

export default function BuyoutHero() {
  const { isLoading, nounTokenId, myNounlets, buyoutInfo, offers, nounBackground } = useNounBuyout()

  return (
    <div className="buyout-hero" style={{ background: nounBackground }}>
      {/*<pre>*/}
      {/*  {JSON.stringify(buyoutInfo || {}, null, 4)} -- {'' + isLoading}*/}
      {/*</pre>*/}
      <div className="mx-auto px-4 lg:container">
        <div className="lg:grid lg:grid-cols-2">
          <div className="flex flex-col justify-end lg:min-h-[544px] lg:justify-start lg:pt-8 lg:pr-4">
            <div className="mx-auto aspect-square w-full max-w-[512px] border-b-2 border-gray-3/25">
              <NounImage id={nounTokenId} />
            </div>
          </div>

          <div className="-mx-4 space-y-3 bg-gray-1 px-4 py-12 md:p-12 lg:-mx-0 lg:bg-transparent lg:pb-0 lg:pt-4 lg:pl-6 lg:pr-0">
            {isLoading ? (
              <>
                <div className="buyout-inactive space-y-4">
                  <div className="space-y-4">
                    <h1 className="font-londrina text-px42 leading-px48">
                      {myNounlets.length === 0 ? (
                        <>Nounlets of Noun {nounTokenId}</>
                      ) : (
                        <>Offer to buy Noun {nounTokenId}</>
                      )}
                    </h1>
                    <BuyoutSecondaryMarketCard />
                  </div>
                </div>
              </>
            ) : (
              <>
                {buyoutInfo.state === BuyoutState.INACTIVE && (
                  <>
                    <div className="buyout-inactive space-y-4">
                      <div className="space-y-4">
                        <h1 className="font-londrina text-px42 leading-px48">
                          {myNounlets.length === 0 ? (
                            <>Nounlets of Noun {nounTokenId}</>
                          ) : (
                            <>Offer to buy Noun {nounTokenId}</>
                          )}
                        </h1>
                        <BuyoutSecondaryMarketCard />
                      </div>
                      <div className="space-y-4">
                        {myNounlets.length === 0 && (
                          <h1 className="font-londrina text-px42 leading-px48">
                            Offer to buy Noun {nounTokenId}
                          </h1>
                        )}
                        <BuyoutOfferCard />
                      </div>
                      <BuyoutPastOffers />
                    </div>
                  </>
                )}
                {(buyoutInfo.state === BuyoutState.LIVE ||
                  buyoutInfo.state === BuyoutState.SUCCESS) && (
                  <div className="buyout-inactive space-y-4">
                    <div className="space-y-4">
                      <h1 className="font-londrina text-px42 leading-px48">
                        Offer for Noun {nounTokenId}
                      </h1>
                      {isLoading ? (
                        <></>
                      ) : (
                        <>
                          <BuyoutOfferLiveCard />
                          {buyoutInfo.state === BuyoutState.LIVE && <BuyoutLiveRejectionsCard />}
                          <BuyoutOfferingDisplay />
                        </>
                      )}
                    </div>
                    <BuyoutPastOffers />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
