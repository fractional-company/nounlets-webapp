import { NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import Button from 'src/components/common/buttons/Button'
import IconArrow from 'src/components/common/icons/IconArrow'
import { NounletImage } from 'src/components/common/NounletImage'
import NounHeroAuctionCompleted from 'src/components/noun/NounHeroAuctionCompleted'
import NounHeroAuctionProgress from 'src/components/noun/NounHeroAuctionProgress'
import NounVotesFromNounlet from 'src/components/noun/NounVotesFromNounlet'
import useCurrentBackground from 'src/hooks/useCurrentBackground'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
import { useNounStore } from 'src/store/noun.store'
import { useNounletStore } from 'src/store/nounlet.store'

export default function NounTabNounlets() {
  const router = useRouter()
  const { isLoading, nounTokenId, latestNounletTokenId } = useNounStore()
  const { isLoading: isLoadingNounlet, nounletId, auctionData } = useNounletStore()
  const { nounletBackground } = useDisplayedNounlet()

  // const {
  //   isLoading,
  //   nid,
  //   latestNounletTokenId,
  //   hasAuctionEnded,
  //   auctionInfo,
  //   mutateAuctionInfo: mutateDisplayedNounletAuctionInfo
  // } = useDisplayedNounlet()
  // const { currentBackground } = useCurrentBackground()

  // const nounletId = nounletId //  isLoadingNounlet ? null : nounletId

  const nounletNumberString = nounletId || '???'
  const isButtonPreviousDisabled = useMemo(() => {
    if (nounletId == null) return true
    if (+nounletId <= 1) return true
    return false
  }, [nounletId])

  const isButtonNextDisabled = useMemo(() => {
    if (nounletId == null) return true
    if (+nounletId >= +latestNounletTokenId) return true
    if (+nounletId === NEXT_PUBLIC_MAX_NOUNLETS) return true
    return false
  }, [nounletId, latestNounletTokenId])

  const moveToNounletDirection = (direction: number) => {
    if (nounletId == null) return

    router
      .push(`/noun/${nounTokenId}/nounlets/${+nounletId + direction}`, undefined, {
        shallow: true
      })
      .then()
  }

  // TODO change color
  return (
    <div className={'space-y-16'}>
      <div className="home-hero" style={{ background: 'transparent' }}>
        <div className="lg:container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-2">
            <div className="flex flex-col justify-end lg:pr-4 lg:min-h-[544px] lg:order-2">
              <div className="w-full aspect-square max-w-[512px] mx-auto">
                <NounletImage id={nounletId} />
              </div>
            </div>

            <div className="px-4 py-12 lg:pb-0 lg:pt-4 md:p-12 lg:pl-6 lg:pr-10 -mx-4 lg:-mx-0 bg-white lg:bg-transparent space-y-3">
              {/*<pre>{JSON.stringify(auctionData, null, 4)}</pre>*/}
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

              {auctionData == null || isLoading ? (
                <></>
              ) : (
                <NounHeroAuctionCompleted key={'completed-' + nounletId} />
              )}
            </div>
          </div>
        </div>
      </div>
      <NounVotesFromNounlet />
    </div>
  )
}
