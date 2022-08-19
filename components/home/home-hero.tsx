import Image from 'next/image'
import nounImage from 'public/img/noun.png'
import nounLoadingImage from 'public/img/loading-skull.gif'
import Button from 'components/buttons/button'
import IconArrow from 'components/icons/icon-arrow'
import HomeHeroAuctionProgress from './home-hero-auction-progress'
import { useRouter } from 'next/router'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import HomeHeroAuctionCompleted from './home-hero-auction-completed'
import { useDisplayAuction } from '../../store/onDisplayAuction'
import useOnDisplayAuction from '../../lib/wrappers/onDisplayAuction'
import CountdownTimer from '../countdown-timer'
import { BigNumber } from 'ethers'
import { auctionStart } from '../../config'
import IconInfo from '../icons/icon-info'
import { useEffect, useMemo } from 'react'
import { useAuctionStateStore } from 'store/auctionStateStore'
import CongratulationsModal from 'components/modals/congratulations-modal'

export default function HomeHero(): JSX.Element {
  const router = useRouter()
  const {
    isLoading,
    nid,
    latestNounletTokenId,
    auctionEndTime,
    hasAuctionEnded,
    hasAuctionSettled,
    auctionInfo,
    historicVotes,
    historicBids,
    endedAuctionInfo
  } = useDisplayedNounlet()

  const moveToNounlet = (id: number) => {
    router.push(`/nounlet/${id}`)
  }

  const auctionTimer = (
    <div className="font-500">
      <p className="mb-3 text-gray-4 text-px18 leading-px22">First auction starts in</p>
      <CountdownTimer showEndTime={false} auctionEnd={auctionStart} />
      <p className="text-px14 text-gray-4 flex items-center font-500 mt-3">
        <IconInfo className="mr-2" />
        Bidding for 1% ownership of the Noun. &nbsp;
        <a
          href="https://medium.com/fractional-art"
          target="_blank"
          className="font-700 text-secondary-blue cursor-pointer"
          rel="noreferrer"
        >
          Read more
        </a>
      </p>
    </div>
  )
  const nounletNumberString = useMemo(() => {
    return nid ?? '???'
  }, [nid])

  const allBids = useMemo(() => {
    return historicBids ?? []
  }, [historicBids])

  return (
    <div className="home-hero bg-gray-1">
      <div className="lg:container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-2">
          <div className="flex flex-col justify-end lg:pr-4">
            <div className="w-full aspect-square max-w-[512px] mx-auto">
              {isLoading ? (
                <Image src={nounLoadingImage} layout="responsive" alt="nounlet loading" />
              ) : (
                <Image src={nounImage} layout="responsive" alt="nounlet 1" />
              )}
            </div>
          </div>

          <div className="px-4 py-12 md:p-12 lg:pl-6 lg:pr-10 -mx-4 lg:-mx-0 bg-white lg:bg-transparent space-y-3">
            {/* <pre>assas: {JSON.stringify(auctionInfo, null, 4)}</pre> */}
            {auctionInfo == null || isLoading ? (
              <>Ahhh Im loading</>
            ) : (
              <>
                <div className="navigation flex items-center space-x-1">
                  <Button
                    disabled={(+nid ?? 0) <= 1}
                    onClick={() => moveToNounlet((+nid ?? 2) - 1)}
                    className="flex items-center justify-center rounded-full w-10 h-10 cursor-pointer bg-gray-2 lg:bg-white hover:bg-gray-2"
                  >
                    <IconArrow />
                  </Button>

                  <Button
                    onClick={() => moveToNounlet((+nid ?? 0) + 1)}
                    disabled={(+nid ?? 101) >= +latestNounletTokenId}
                    className="flex items-center justify-center rounded-full w-10 h-10 cursor-pointer bg-gray-2 lg:bg-white hover:bg-gray-2"
                  >
                    <IconArrow className="rotate-180" />
                  </Button>

                  <p className="text-px18 font-700 pl-2">
                    {nounletNumberString}
                    <span className="text-gray-4">/100</span>
                  </p>
                </div>

                <h1 className="font-londrina text-px64 leading-[82px]">
                  Nounlet {nounletNumberString}
                </h1>

                {hasAuctionEnded ? (
                  <HomeHeroAuctionCompleted />
                ) : (
                  <>
                    {/* <h1>Porgress</h1> */}
                    <HomeHeroAuctionProgress />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* <CongratulationsModal
        isShown={isCongratulationsModalShown}
        onClose={() => {
          setIsCongratulationsModalShown(false)
        }}
      /> */}
    </div>
  )
}
