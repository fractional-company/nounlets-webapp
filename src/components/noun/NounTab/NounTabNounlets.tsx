import { NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import Button from 'src/components/common/buttons/Button'
import IconArrow from 'src/components/common/icons/IconArrow'
import { NounletImage } from 'src/components/common/NounletImage'
import NounHeroAuctionCompleted from 'src/components/noun/NounHeroAuctionCompleted'
import NounHeroAuctionProgress from 'src/components/noun/NounHeroAuctionProgress'
import NounVotesFromNounlet from 'src/components/noun/NounVotesFromNounlet'
import useCurrentBackground from 'src/hooks/utils/useCurrentBackground'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
import { useNounStore } from 'src/store/noun.store'
import { useNounletStore } from 'src/store/nounlet.store'

export default function NounTabNounlets() {
  const router = useRouter()
  const { isLoading, nounTokenId, latestNounletTokenId, nounletTokenAddress } = useNounStore()
  const { nounletId, auctionData } = useNounletStore()

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
      .push(`/noun/${nounTokenId}/nounlet/${+nounletId + direction}`, undefined, {
        shallow: true
      })
      .then()
  }

  return (
    <div className="space-y-6 lg:space-y-16">
      <div className="nounlet-hero">
        <div className="mx-auto px-4 lg:container">
          <div className="lg:grid lg:grid-cols-2">
            <div className="flex flex-col justify-end lg:order-2 lg:min-h-[544px] lg:pr-4">
              <div className="mx-auto aspect-square w-full max-w-[512px]">
                <NounletImage
                  noundId={nounTokenId}
                  nounletTokenAddress={nounletTokenAddress}
                  id={nounletId}
                />
              </div>
            </div>

            <div className="-mx-4 space-y-3 bg-white px-4 py-12 md:p-12 lg:-mx-0 lg:bg-transparent lg:pb-0 lg:pt-4 lg:pl-6 lg:pr-10">
              {/*<pre>{JSON.stringify(auctionData, null, 4)}</pre>*/}
              <div className="navigation flex items-center space-x-1">
                <Button
                  disabled={isButtonPreviousDisabled}
                  onClick={() => moveToNounletDirection(-1)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-2 hover:bg-gray-2 lg:bg-white"
                >
                  <IconArrow />
                </Button>

                <Button
                  onClick={() => moveToNounletDirection(+1)}
                  disabled={isButtonNextDisabled}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-2 hover:bg-gray-2 lg:bg-white"
                >
                  <IconArrow className="rotate-180" />
                </Button>

                <p className="pl-2 text-px18 font-700">
                  {nounletNumberString}
                  <span className="text-gray-4">/{NEXT_PUBLIC_MAX_NOUNLETS}</span>
                </p>
              </div>

              <h1 className="font-londrina text-px64 leading-[82px]">
                Nounlet {nounletNumberString}
              </h1>

              {auctionData == null || isLoading ? (
                <></>
              ) : (
                <NounHeroAuctionCompleted key={'completed-' + nounletId} isReversed />
              )}
            </div>
          </div>
        </div>
      </div>
      <NounVotesFromNounlet />
    </div>
  )
}
