import SimpleProgressIndicator from 'components/simple-progress-indicator'
import SimpleXImage from 'components/simple-x-image'
import useBuyoutNoun from 'hooks/useBuyoutNoun'
import Image from 'next/image'
import nounImage from 'public/img/noun.png'
import { BuyoutState } from 'store/buyout/buyout.store'

export default function BuyoutLiveRejectionsCard(): JSX.Element {
  const {
    buyoutInfo,
    nounletsOffered,
    nounletsOfferedCount,
    nounletsRemainingCount,
    nounletPercentage
  } = useBuyoutNoun()

  return (
    <div className="buyout-live-rejections-card">
      <div className="bg-gray-2 rounded-px16 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <p className="font-londrina text-px24 text-secondary-red">Rejections</p>

          <div className="flex items-center space-x-3">
            <p className="text-px14 font-700 pt-1">Nounlets remaining</p>
            <p className="text-px24 font-700">
              {nounletsRemainingCount}
              <span className="text-px14">/{nounletsOfferedCount}</span>
            </p>
          </div>
        </div>
        <p className="text-gray-4 text-px14 font-500 leading-px20">
          If at least 1 Nounlet is remaining in the pool by the end of the time period, the offer
          will succeed.
        </p>
        <SimpleProgressIndicator percentage={nounletPercentage} />

        {buyoutInfo.state !== BuyoutState.SUCCESS && (
          <div className="flex flex-wrap gap-2">
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
  )
}
