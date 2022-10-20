import { GetServerSideProps, NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { NounAuctionsDisplay } from 'src/components/noun/NounAuctionsDisplay'
import { NounBuyoutDisplay } from 'src/components/noun/NounBuyoutDisplay'
import OnMounted from 'src/components/OnMounted'
import useLeaderboardData from 'src/hooks/useLeaderboardData'
import { useNounBuyoutData } from 'src/hooks/useNounBuyoutData'
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

  useLeaderboardData((data) => {
    console.log('Leaderboard data', data)
  })

  useNounBuyoutData((data) => {
    console.log('Buyout data', data)
  })

  return wereAllNounletsAuctioned ? <NounBuyoutDisplay /> : <NounAuctionsDisplay />
}

export default NounHome
