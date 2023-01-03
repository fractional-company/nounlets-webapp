import classNames from 'classnames'
import { GetServerSideProps, NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import BuyoutHero from 'src/components/buyout/BuyoutHero'
import BuyoutHowDoesItWorkModal from 'src/components/buyout/BuyoutHowDoesItWorkModal'
import BuyoutOfferModal from 'src/components/buyout/BuyoutOfferModal'
import SimpleModalWrapper from 'src/components/common/simple/SimpleModalWrapper'
import ModalBidHistory from 'src/components/modals/ModalBidHistory'
import { NounAuctionsDisplay } from 'src/components/noun/NounAuctionsDisplay'
import { NounBuyoutDisplay } from 'src/components/noun/NounBuyoutDisplay'
import NounCollectiveOwnership from 'src/components/noun/NounCollectiveOwnership'
import NounHero from 'src/components/noun/NounHero'
import NounLeaderboard from 'src/components/noun/NounLeaderboard'
import NounTabGeneral from 'src/components/noun/NounTab/NounTabGeneral'
import NounTabNounlets from 'src/components/noun/NounTab/NounTabNounlets'
import NounTabVote from 'src/components/noun/NounTab/NounTabVote'
import NounVotesFromNounlet from 'src/components/noun/NounVotesFromNounlet'
import NounWtf from 'src/components/noun/NounWtf'
import OnMounted from 'src/components/OnMounted'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'
import useLeaderboardData from 'src/hooks/useLeaderboardData'
import { useNounBuyoutData } from 'src/hooks/useNounBuyoutData'
import { useNounData } from 'src/hooks/useNounData'
import { useNounletData } from 'src/hooks/useNounletData'
import { ONLY_NUMBERS_REGEX } from 'src/lib/utils/nextBidCalculator'
import { useAppStore } from 'src/store/application.store'
import { useBuyoutHowDoesItWorkModalStore } from 'src/store/buyout/buyoutHowDoesItWorkModal.store'
import { useBuyoutOfferModalStore } from 'src/store/buyout/buyoutOfferModal.store'
import { useNounStore } from 'src/store/noun.store'
import { useNounletStore } from 'src/store/nounlet.store'
import { getVaultData } from '../../graphql/src/queries'
import { Tab } from '@headlessui/react'
import { useLeaderboardStore } from 'src/store/leaderboard.store'
import { useBuyoutStore } from 'src/store/buyout/buyout.store'

type NounHomeProps = {
  url: string
  nounId: string
  vaultAddress: string
}

export const getServerSideProps: GetServerSideProps<NounHomeProps> = async (context) => {
  const queryPath = context.query.path as string[]
  const [nounId, subdirectory, nounletId] = queryPath
  console.log([nounId, subdirectory, nounletId])

  if (nounId == null || !ONLY_NUMBERS_REGEX.test(nounId)) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const data = await getVaultData(nounId)
  if (!data || !data.vaultAddress) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      url: 'https://' + context?.req?.headers?.host,
      nounId,
      vaultAddress: data.vaultAddress
    }
  }
}

function parseRouteParams(router: NextRouter) {
  const queryPath = router.query.path as string[]
  const [nounId, subdirectory, nounletId] = queryPath
  // console.log([nounId, subdirectory, nounletId])

  if (!nounId || !ONLY_NUMBERS_REGEX.test(nounId as string)) {
    return {
      nounId: null,
      nounletId: null,
      redirect: '/'
    }
  }

  if (subdirectory != null) {
    if (subdirectory !== 'nounlet') {
      return {
        nounId: nounId,
        nounletId: null,
        redirect: `/noun/${nounId}`
      }
    }

    if (nounletId == null || !ONLY_NUMBERS_REGEX.test(nounletId)) {
      return {
        nounId: nounId,
        nounletId: null,
        redirect: `/noun/${nounId}`
      }
    }

    if (+nounletId < 1 || +nounletId > 100) {
      return {
        nounId: nounId,
        nounletId: null,
        redirect: `/noun/${nounId}`
      }
    }
  }

  return {
    nounId: nounId,
    nounletId: nounletId,
    redirect: null
  }
}

const NounHome: NextPage<NounHomeProps> = (props) => {
  const router = useRouter()
  const {
    nounId: paramNounId,
    nounletId: paramNounletId,
    redirect: paramRedirect
  } = parseRouteParams(router)
  const { reset: resetNounStore, setNounTokenId, nounTokenId } = useNounStore()
  const { reset: resetNounletStore } = useNounletStore()
  const { reset: resetLeaderboardStore } = useLeaderboardStore()
  const { reset: resetBuyoutStore } = useBuyoutStore()
  const [isPageReady, setIsPageReady] = useState(false)

  useEffect(() => {
    if (paramRedirect != null) {
      const shallowRedirect = paramRedirect !== '/'
      router.replace(paramRedirect, undefined, { shallow: shallowRedirect }).then()
      return
    }

    if (nounTokenId !== paramNounId) {
      resetNounStore()
      resetNounletStore()
      resetLeaderboardStore()
      resetBuyoutStore()
    }

    setNounTokenId(paramNounId)
    setIsPageReady(true)
  }, [
    router,
    resetNounStore,
    resetNounletStore,
    resetLeaderboardStore,
    resetBuyoutStore,
    setNounTokenId,
    nounTokenId,
    paramNounId,
    paramRedirect
  ])

  return <PageContent isPageReady={isPageReady} />
}

export default NounHome

function PageContent(props: { isPageReady: boolean }) {
  const { isPageReady } = props
  const router = useRouter()
  const { nounId: paramNounId, nounletId: paramNounletId } = parseRouteParams(router)

  const {
    setNounTokenId,
    nounTokenId,
    isLive,
    isReady,
    isLoading,
    latestNounletTokenId,
    wereAllNounletsAuctioned,
    isGovernanceEnabled,
    setIsReady
  } = useNounStore()
  const { setNounletID, reset: resetNounletStore } = useNounletStore()

  useEffect(() => {
    if (!isPageReady) return
    if (!isLive) return

    console.log({ isLive })
    if (paramNounletId != null) {
      if (+paramNounletId > +latestNounletTokenId) {
        console.log('Nounlet id too big, goto root')
        router.replace(`/noun/${paramNounId}`, undefined, { shallow: true }).then()
        return
      }
    }

    if (!wereAllNounletsAuctioned && paramNounletId == null) {
      setNounletID(latestNounletTokenId)
      return
    }

    setNounletID(paramNounletId)
  }, [
    isPageReady,
    router,
    isLive,
    latestNounletTokenId,
    wereAllNounletsAuctioned,
    paramNounId,
    paramNounletId,
    setNounletID,
    resetNounletStore
  ])

  useNounData(isPageReady && paramNounId === nounTokenId, (data) => {
    console.log('Noun data', data)
    if (!(data as { wereAllNounletsAuctioned: boolean }).wereAllNounletsAuctioned) {
      setIsReady(true)
    }
  })

  useNounletData((data) => {
    console.log('Nounlet data', data)
  })

  useLeaderboardData((data) => {
    console.log('Leaderboard data', data)
  })

  useNounBuyoutData((data) => {
    console.log('Buyout data', data)
    if (data != null) {
      setIsReady(true)
    }
  })

  const { setBidModalOpen, isBidModalOpen } = useAppStore()
  const { initialFullPriceOffer, isBuyoutOfferModalShown, closeBuyoutOfferModal } =
    useBuyoutOfferModalStore()
  const { isBuyoutHowDoesItWorkModalShown, closeBuyoutHowDoesItWorkModal } =
    useBuyoutHowDoesItWorkModalStore()

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  useEffect(() => {
    if (wereAllNounletsAuctioned) {
      if (paramNounletId != null) {
        console.log('open nounlets tab!')
        setSelectedTabIndex(2)
      }
    }
  }, [wereAllNounletsAuctioned, paramNounletId])

  const handleChangeTabIndex = (index: number) => {
    // console.log('handleChangeTabIndex', index)
    if (index === 2) {
      if (paramNounletId == null) {
        router.replace(`/noun/${paramNounId}/nounlet/1`, undefined, { shallow: true })
        setSelectedTabIndex(index)
      }
    }
    setSelectedTabIndex(index)
  }

  return (
    <>
      <OnMounted>
        <>
          <SimpleModalWrapper
            className="md:!max-w-[512px]"
            isShown={isBuyoutOfferModalShown}
            onClose={() => closeBuyoutOfferModal()}
            preventCloseOnBackdrop
          >
            <BuyoutOfferModal initialFullPriceOffer={initialFullPriceOffer} />
          </SimpleModalWrapper>

          <SimpleModalWrapper
            className="!max-w-[680px]"
            isShown={isBuyoutHowDoesItWorkModalShown}
            onClose={() => closeBuyoutHowDoesItWorkModal()}
          >
            <BuyoutHowDoesItWorkModal />
          </SimpleModalWrapper>

          <SimpleModalWrapper
            className="!max-w-[600px] md:!w-[600px]"
            onClose={() => setBidModalOpen(false)}
            isShown={isBidModalOpen}
          >
            <ModalBidHistory />
          </SimpleModalWrapper>
        </>
      </OnMounted>

      <div className="min-h-screen space-y-16 bg-white">
        {isReady && wereAllNounletsAuctioned ? <BuyoutHero /> : <NounHero />}

        {isReady && (
          <div className="flex flex-col">
            <div className="px-4 lg:container lg:mx-auto">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-12">
                <div
                  className={classNames(
                    'cursor-pointer font-londrina text-[56px]',
                    selectedTabIndex === 0 ? 'text-black' : 'text-gray-3'
                  )}
                  onClick={() => handleChangeTabIndex(0)}
                >
                  General
                </div>
                {isGovernanceEnabled && (
                  <div
                    className={classNames(
                      'cursor-pointer font-londrina text-[56px]',
                      selectedTabIndex === 1 ? 'text-black' : 'text-gray-3'
                    )}
                    onClick={() => handleChangeTabIndex(1)}
                  >
                    Vote
                  </div>
                )}
                {wereAllNounletsAuctioned && (
                  <div
                    className={classNames(
                      'cursor-pointer font-londrina text-[56px]',
                      selectedTabIndex === 2 ? 'text-black' : 'text-gray-3'
                    )}
                    onClick={() => handleChangeTabIndex(2)}
                  >
                    Nounlets
                  </div>
                )}
              </div>
            </div>

            <div className={'mt-12'}>
              {selectedTabIndex === 0 && <NounTabGeneral />}
              {selectedTabIndex === 1 && isGovernanceEnabled && <NounTabVote />}
              {selectedTabIndex === 2 && wereAllNounletsAuctioned && <NounTabNounlets />}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
