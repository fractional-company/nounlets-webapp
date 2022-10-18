import Button from 'src/components/common/buttons/Button'
import IconArrow from 'src/components/common/icons/IconArrow'
import ModalCongratulations from 'src/components/modals/ModalCongratulations'
import { NounletImage } from 'src/components/common/NounletImage'
import { NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import useCurrentBackground from 'src/hooks/useCurrentBackground'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
import Image from 'next/image'
import { useRouter } from 'next/router'
import nounLoadingImage from 'public/img/loading-skull.gif'
import nounImage from 'public/img/noun.png'
import { useMemo } from 'react'
import { useAppStore } from 'src/store/application'
import HomeHeroAuctionCompleted from './HomeHeroAuctionCompleted'
import HomeHeroAuctionProgress from './HomeHeroAuctionProgress'

export default function HomeHero(): JSX.Element {
  const router = useRouter()
  const {
    isLoading,
    nid,
    latestNounletTokenId,
    hasAuctionEnded,
    auctionInfo,
    mutateAuctionInfo: mutateDisplayedNounletAuctionInfo
  } = useDisplayedNounlet()
  const { currentBackground } = useCurrentBackground()

  const nounletNumberString = useMemo(() => {
    return nid ?? '???'
  }, [nid])

  const isButtonPreviousDisabled = useMemo(() => {
    if (nid == null) return true
    if (+nid <= 1) return true
    return false
  }, [nid])

  const isButtonNextDisabled = useMemo(() => {
    if (nid == null) return true
    if (+nid >= +latestNounletTokenId) return true
    if (+nid === NEXT_PUBLIC_MAX_NOUNLETS) return true
    return false
  }, [nid, latestNounletTokenId])

  const moveToNounletDirection = (direction: number) => {
    if (nid == null) return

    router.push(`/nounlet/${+nid + direction}`, undefined, { shallow: true })
  }

  return (
    <div className="home-hero" style={{ background: currentBackground }}>
      <div className="lg:container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-2">
          <div className="flex flex-col justify-end lg:pr-4 lg:min-h-[544px]">
            <div className="w-full aspect-square max-w-[512px] mx-auto">
              <NounletImage id={nid} />
            </div>
          </div>

          <div className="px-4 py-12 lg:pb-0 lg:pt-4 md:p-12 lg:pl-6 lg:pr-10 -mx-4 lg:-mx-0 bg-white lg:bg-transparent space-y-3">
            {/* <pre>{JSON.stringify(auctionInfo, null, 4)}</pre> */}
            <div className="navigation flex items-center space-x-1">
              <Button
                disabled={isButtonPreviousDisabled}
                onClick={() => moveToNounletDirection(-1)}
                className="flex items-center justify-center rounded-full w-10 h-10 cursor-pointer bg-gray-2 lg:bg-white hover:bg-gray-2"
              >
                <IconArrow />
              </Button>

              <Button
                onClick={() => moveToNounletDirection(+1)}
                disabled={isButtonNextDisabled}
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

            {auctionInfo == null || isLoading ? (
              <></>
            ) : (
              <>{hasAuctionEnded ? <HomeHeroAuctionCompleted /> : <HomeHeroAuctionProgress />}</>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}