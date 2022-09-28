import { NounImage } from 'components/NounletImage'
import useCurrentBackground from 'hooks/useCurrentBackground'
import useNounBuyout from 'hooks/useNounBuyout'
import { useMemo } from 'react'
import { BuyoutState, useBuyoutStore } from 'store/buyout/buyout.store'
import { useVaultStore } from 'store/vaultStore'
import BuyoutLiveRejectionsCard from './buyout-live-rejections-card'
import BuyoutOfferCard from './buyout-offer-card'
import BuyoutOfferLiveCard from './buyout-offer-live-card'
import BuyoutOfferingDisplay from './buyout-offering-display'
import BuyoutPastOffers from './buyout-past-offers'
import BuyoutSecondaryMarketCard from './buyout-secondary-market-card'

export default function BuyoutHero() {
  const { nounTokenId, myNounlets, buyoutInfo, offers, nounBackground } = useNounBuyout()

  const myNounletsCount = myNounlets.length
  return (
    <div className="buyout-hero" style={{ background: nounBackground }}>
      <div className="lg:container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-2">
          <div className="flex flex-col justify-end lg:pr-4 lg:min-h-[544px]">
            <div className="w-full aspect-square max-w-[512px] mx-auto">
              <NounImage />
            </div>
          </div>

          <div className="px-4 py-12 lg:pb-0 lg:pt-4 md:p-12 lg:pl-6 lg:pr-10 -mx-4 lg:-mx-0 bg-white lg:bg-transparent space-y-3">
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
                  {/* <BuyoutPastOffers /> */}
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
                  <pre>{JSON.stringify(buyoutInfo, null, 4)}</pre>
                  <BuyoutOfferLiveCard />
                  <BuyoutLiveRejectionsCard />
                  <BuyoutOfferingDisplay />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
