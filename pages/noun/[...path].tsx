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
  const routerParams = parseRouteParams(router)
  const {
    setNounTokenId,
    isLive,
    isLoading,
    latestNounletTokenId,
    wereAllNounletsAuctioned,
    isGovernanceEnabled
  } = useNounStore()
  const { setNounletID } = useNounletStore()

  useEffect(() => {
    if (routerParams.redirect != null) {
      const shallowRedirect = routerParams.redirect !== '/'
      router.replace(routerParams.redirect, undefined, { shallow: shallowRedirect }).then()
      return
    }

    setNounTokenId(routerParams.nounId)

    if (isLive && !isLoading) {
      if (routerParams.nounletId != null) {
        if (+routerParams.nounletId > +latestNounletTokenId) {
          console.log('Nounlet id too big, goto root')
          router.replace(`/noun/${routerParams.nounId}`, undefined, { shallow: true }).then()
          return
        }
      }

      if (!wereAllNounletsAuctioned && routerParams.nounletId == null) {
        setNounletID(latestNounletTokenId)
        return
      }

      setNounletID(routerParams.nounletId)
    } else {
      setNounletID(null)
    }
  }, [routerParams, isLive, isLoading, latestNounletTokenId, wereAllNounletsAuctioned])

  useNounData((data) => {
    console.log('Noun data', data)
  })

  useNounletData((data) => {
    console.log('Nounlet data', data)
  })

  useLeaderboardData((data) => {
    console.log('Leaderboard data', data)
  })

  useNounBuyoutData((data) => {
    console.log('Buyout data', data)
  })

  const { setBidModalOpen, isBidModalOpen } = useAppStore()
  const { initialFullPriceOffer, isBuyoutOfferModalShown, closeBuyoutOfferModal } =
    useBuyoutOfferModalStore()
  const { isBuyoutHowDoesItWorkModalShown, closeBuyoutHowDoesItWorkModal } =
    useBuyoutHowDoesItWorkModalStore()

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  useEffect(() => {
    if (wereAllNounletsAuctioned) {
      if (routerParams.nounletId != null) {
        console.log('open nounlets tab!')
        setSelectedTabIndex(2)
      }
    }
  }, [wereAllNounletsAuctioned, routerParams.nounletId])

  const handleChangeTabIndex = (index: number) => {
    // console.log('handleChangeTabIndex', index)
    if (index === 2) {
      if (routerParams.nounletId == null) {
        router.replace(`/noun/${routerParams.nounId}/nounlet/1`, undefined, { shallow: true })
        setSelectedTabIndex(index)
      }
    }
    setSelectedTabIndex(index)
  }

  return (
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
          className="md:!w-[600px] !max-w-[600px]"
          onClose={() => setBidModalOpen(false)}
          isShown={isBidModalOpen}
        >
          <ModalBidHistory />
        </SimpleModalWrapper>
      </>

      <div className="space-y-16 min-h-screen">
        {wereAllNounletsAuctioned ? <BuyoutHero /> : <NounHero />}

        <div className="flex flex-col">
          <div className="lg:container lg:mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-12">
              <div
                className={classNames(
                  'font-londrina text-[56px] cursor-pointer',
                  selectedTabIndex === 0 ? 'text-black' : 'text-gray-3'
                )}
                onClick={() => handleChangeTabIndex(0)}
              >
                General
              </div>
              {isGovernanceEnabled && (
                <div
                  className={classNames(
                    'font-londrina text-[56px] cursor-pointer',
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
                    'font-londrina text-[56px] cursor-pointer',
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
      </div>
    </OnMounted>
  )
}

export default NounHome
