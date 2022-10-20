import debounce from 'lodash/debounce'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import BuyoutHero from 'src/components/buyout/BuyoutHero'
import BuyoutHowDoesItWorkModal from 'src/components/buyout/BuyoutHowDoesItWorkModal'
import BuyoutOfferModal from 'src/components/buyout/BuyoutOfferModal'
import SimpleModalWrapper from 'src/components/common/simple/SimpleModalWrapper'
import HomeHero from 'src/components/home/HomeHero'
import HomeLeaderboard from 'src/components/home/HomeLeaderboard'
import HomeVotesFromNounlet from 'src/components/home/HomeVotesFromNounlet'
import ModalBidHistory from 'src/components/modals/ModalBidHistory'
import { NounAuctionsDisplay } from 'src/components/noun/NounAuctionsDisplay'
import NounHero from 'src/components/noun/NounHero'
import NounLeaderboard from 'src/components/noun/NounLeaderboard'
import OnMounted from 'src/components/OnMounted'
import useLeaderboardData from 'src/hooks/useLeaderboardData'
import { useNounBuyoutData } from 'src/hooks/useNounBuyoutData'
import { useNounData } from 'src/hooks/useNounData'
import { useNounletData } from 'src/hooks/useNounletData'
import useSdk from 'src/hooks/useSdk'
import { ONLY_NUMBERS_REGEX } from 'src/lib/utils/nextBidCalculator'
import { useBlockNumberCheckpointStore } from 'src/store/blockNumberCheckpointStore'
import { useLeaderboardStore } from 'src/store/leaderboard.store'
import { useNounStore } from 'src/store/noun.store'
import { useNounletStore } from 'src/store/nounlet.store'
import { useSWRConfig } from 'swr'
import { getVaultData } from '../../../graphql/src/queries'

type NounHomeProps = {
  url: string
  nounId: string
  vaultAddress: string
}

export const getServerSideProps: GetServerSideProps<NounHomeProps> = async (context) => {
  const nounId = context.query['nounId'] as string
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
  const query = router.query

  const nounId = query['nounId']
  const subtree = query['subtree']

  if (!nounId || !ONLY_NUMBERS_REGEX.test(nounId as string)) {
    return {
      nounId: null,
      nounletId: null,
      redirect: '/'
    }
  }

  if (subtree == null) {
    return {
      nounId: nounId as string,
      nounletId: null,
      redirect: null
    }
  }

  if (subtree.length != 2) {
    return {
      nounId: nounId as string,
      nounletId: null,
      redirect: `/noun/${nounId}`
    }
  }

  if (subtree[0] !== 'nounlets' || !ONLY_NUMBERS_REGEX.test(subtree[1] as string)) {
    return {
      nounId: nounId as string,
      nounletId: null,
      redirect: `/noun/${nounId}`
    }
  }

  if (+subtree[1] < 1 || +subtree[1] > 100) {
    return {
      nounId: nounId as string,
      nounletId: null,
      redirect: `/noun/${nounId}`
    }
  }

  return {
    nounId: nounId as string,
    nounletId: subtree[1] as string,
    redirect: null
  }
}

const NounHome: NextPage<NounHomeProps> = (props) => {
  const router = useRouter()
  const routerParams = parseRouteParams(router)
  const sdk = useSdk()
  const { cache, mutate: globalMutate } = useSWRConfig()

  const {
    setNounTokenId,
    isLive,
    isLoading,
    latestNounletTokenId,
    wereAllNounletsAuctioned,
    nounletTokenAddress,
    vaultAddress,
    nounTokenId
  } = useNounStore()
  const { setNounletID } = useNounletStore()
  const { leaderboardBlockNumber, setLeaderboardBlockNumber } = useBlockNumberCheckpointStore()
  const { leaderboardData } = useLeaderboardStore()

  useEffect(() => {
    // console.log('effect ran', routerParams)
    if (routerParams.redirect != null) {
      router.replace(routerParams.redirect).then()
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

  useNounBuyoutData((data) => {
    console.log('Buyout data', data)
  })

  useLeaderboardData((data) => {
    console.log('Leaderboard data', data)
  })

  useEffect(() => {
    if (!isLive || sdk == null) return

    // TODO Maybe be more specific with the events?
    console.log('🍉 listen to any event on NounletToken', vaultAddress, nounletTokenAddress)
    const nounletToken = sdk.NounletToken.attach(nounletTokenAddress)
    const nounletAuction = sdk.NounletAuction
    const nounletGovernance = sdk.NounletGovernance

    const debouncedMutate = debounce(() => {
      globalMutate(`noun/${nounTokenId}/leaderboard`).then()
      globalMutate(`noun/${nounTokenId}/leaderboard/delegate`).then()
    }, 1000)

    const listener = (...eventData: any) => {
      const event = eventData.at(-1)
      // console.groupCollapsed('🍉🍉🍉 any event', event?.blockNumber, eventData)
      // console.log('event data', event)
      // console.groupEnd()

      setLeaderboardBlockNumber(event?.blockNumber || 0)
      debouncedMutate()
    }

    nounletToken.on(nounletToken, listener)
    nounletAuction.on(nounletAuction, listener)
    nounletGovernance.on(nounletGovernance, listener)

    return () => {
      console.log('🍉 stop listening to any event on NounletToken')
      nounletToken.off(nounletToken, listener)
      nounletAuction.off(nounletAuction, listener)
      nounletGovernance.off(nounletGovernance, listener)
    }
  }, [isLive, sdk, vaultAddress, nounletTokenAddress, setLeaderboardBlockNumber])

  return (
    <>
      {/*<NounChainUpdater nounId={nounId} />*/}
      <div className="space-y-16">
        <OnMounted>
          {wereAllNounletsAuctioned ? (
            <>
              <BuyoutHero />
              {/*<SimpleModalWrapper*/}
              {/*  className="md:!max-w-[512px]"*/}
              {/*  isShown={isBuyoutOfferModalShown}*/}
              {/*  onClose={() => closeBuyoutOfferModal()}*/}
              {/*  preventCloseOnBackdrop*/}
              {/*>*/}
              {/*  <BuyoutOfferModal initialFullPriceOffer={initialFullPriceOffer} />*/}
              {/*</SimpleModalWrapper>*/}

              {/*<SimpleModalWrapper*/}
              {/*  className="!max-w-[680px]"*/}
              {/*  isShown={isBuyoutHowDoesItWorkModalShown}*/}
              {/*  onClose={() => closeBuyoutHowDoesItWorkModal()}*/}
              {/*>*/}
              {/*  <BuyoutHowDoesItWorkModal />*/}
              {/*</SimpleModalWrapper>*/}
            </>
          ) : (
            <NounAuctionsDisplay />
          )}

          {/*<NounHero />*/}
          {/*<HomeHero />*/}
          {/*{isLive && hasAuctionSettled && <HomeVotesFromNounlet />}*/}
          {/*{isLive && isGovernanceEnabled && <HomeLeaderboard />}*/}
          {/*{isLive && <HomeCollectiveOwnership />}*/}
          {/*<HomeWtf />*/}
          <div className="flex flex-col gap-3 p-4">
            <Link href={'/noun/5'}>GOTO 5</Link>
            <Link href={'/noun/3'}>GOTO 3</Link>
            <Link href={'/noun/3/nounlets/1'}>GOTO 3/1</Link>
            <Link href={'/noun/3/nounlets/2'}>GOTO 3/2</Link>
          </div>

          {/*<pre className="p-4">{JSON.stringify(nounInfo, null, 4)}</pre>*/}
          {/*<pre className="p-4">{JSON.stringify(nounletInfo, null, 4)}</pre>*/}
        </OnMounted>
      </div>
    </>
  )
}

export default NounHome

// function NounChainUpdater(props: { nounId: string }) {
//   return (
//     <>
//       <div>Chain Update</div>
//       <pre>{JSON.stringify(data || {}, null, 4)}</pre>
//       <Link href={'/noun/5'}>GOTO 5</Link>
//       <Link href={'/noun/3'}>GOTO 3</Link>
//       <Link href={'/noun/3/nounlets/1'}>GOTO 3/1</Link>
//       <Link href={'/noun/3/nounlets/2'}>GOTO 3/2</Link>
//     </>
//   )
// }
