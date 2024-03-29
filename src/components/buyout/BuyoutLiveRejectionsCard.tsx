import { NounletImage } from 'src/components/common/NounletImage'
import SimpleProgressIndicator from 'src/components/common/simple/SimpleProgressIndicator'
import SimpleXImage from 'src/components/common/simple/SimpleXImage'
import useNounBuyout from 'src/hooks/useNounBuyout'
import Image from 'next/image'
import nounImage from 'public/img/noun.png'
import { BuyoutState } from 'src/store/buyout/buyout.store'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'

export default function BuyoutLiveRejectionsCard(): JSX.Element {
  const {
    buyoutInfo,
    nounletsOffered,
    nounletsOfferedCount,
    nounletsRemainingCount,
    nounletPercentage
  } = useNounBuyout()
  const { nounTokenId, nounletTokenAddress } = useDisplayedNounlet()

  return (
    <div className="buyout-live-rejections-card">
      <div className="space-y-3 rounded-px16 bg-gray-2 p-4">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <p className="font-londrina text-px24 text-secondary-red">Rejections</p>

          <div className="flex items-center space-x-3">
            <p className="pt-1 text-px14 font-700">Nounlets remaining</p>
            <p className="text-px24 font-700">
              {nounletsRemainingCount}
              <span className="text-px14">/{nounletsOfferedCount}</span>
            </p>
          </div>
        </div>
        <p className="text-px16 font-500 leading-px20 text-gray-4">
          If at least 1 Nounlet is remaining in the pool by the end of the time period, the offer
          will succeed.
        </p>
        <SimpleProgressIndicator percentage={nounletPercentage} />

        {buyoutInfo.state !== BuyoutState.SUCCESS && (
          <div className="flex flex-wrap gap-2">
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
  )
}
