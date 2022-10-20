import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import NounHero from 'src/components/noun/NounHero'
import OnMounted from 'src/components/OnMounted'
import { useNounData } from 'src/hooks/useNounData'
import { useNounletData } from 'src/hooks/useNounletData'
import { ONLY_NUMBERS_REGEX } from 'src/lib/utils/nextBidCalculator'
import { useNounStore } from 'src/store/noun.store'
import { useNounletStore } from 'src/store/nounlet.store'
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

  const { setNounTokenId, isLive, isLoading, latestNounletTokenId, wereAllNounletsAuctioned } =
    useNounStore()
  const { setNounletID } = useNounletStore()

  useNounData((data) => {
    console.log('Noun data', data)
  })

  useNounletData((data) => {
    console.log('Nounlet data', data)
  })

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

  return (
    <>
      {/*<NounChainUpdater nounId={nounId} />*/}
      <div className="space-y-16">
        <OnMounted>
          <NounHero />
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
