import { useEthers } from '@usedapp/core'
import { NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import { BigNumber } from 'ethers'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import HomeCollectiveOwnership from 'src/components/home/HomeCollectiveOwnership'
import HomeHero from 'src/components/home/HomeHero'
import HomeLeaderboard from 'src/components/home/HomeLeaderboard'
import HomeVotesFromNounlet from 'src/components/home/HomeVotesFromNounlet'
import HomeWtf from 'src/components/home/HomeWtf'
import { useNounData } from 'src/hooks/useNounData'
import { useNounletData } from 'src/hooks/useNounletData'
import useSdk from 'src/hooks/useSdk'
import { ONLY_NUMBERS_REGEX } from 'src/lib/utils/nextBidCalculator'
import { useNounStore } from 'src/store/noun.store'
import { useNounletStore } from 'src/store/nounlet.store'
import { useVaultStore } from 'src/store/vaultStore'
import useSWR from 'swr'
import { getVaultByNounGQL, getVaultGQL } from '../../../graphql/src/nounlets'
import { getVaultData } from '../../../graphql/src/queries'

type NounHomeProps = {
  url: string
  nounID: string
  nounletID: string | null
  data: Awaited<ReturnType<typeof getVaultData>>
}

export const getServerSideProps: GetServerSideProps<NounHomeProps> = async (context) => {
  const nounID = context.query['nounID'] as string
  const subpage = context.query['subtree']?.[0] || null
  const nounletID = context.query['subtree']?.[1] || null

  if (nounID == null || !ONLY_NUMBERS_REGEX.test(nounID)) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const data = await getVaultData(nounID)
  if (!data) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  if (subpage != null) {
    if (subpage !== 'nounlets') {
      return {
        redirect: {
          destination: `/noun/${nounID}`,
          permanent: false
        }
      }
    } else {
      if (nounletID == null || !ONLY_NUMBERS_REGEX.test(nounletID as string)) {
        return {
          redirect: {
            destination: `/noun/${nounID}`,
            permanent: false
          }
        }
      } else {
        if (context.query['subtree']!.length > 2) {
          return {
            redirect: {
              destination: `/noun/${nounID}/nounlets/${nounletID}`,
              permanent: false
            }
          }
        }
      }
    }
  }

  return {
    props: {
      url: 'https://' + context?.req?.headers?.host,
      nounID,
      nounletID,
      data
    }
  }
}

const NounHome: NextPage<NounHomeProps> = (props) => {
  const { nounID, nounletID } = props

  const { isLoading, nounletTokenAddress, vaultAddress } = useNounStore()
  const { isLoading: isLoadingNounlet, auctionData } = useNounletStore()

  const nounInfo = {
    isLoading,
    vaultAddress,
    nounletTokenAddress
  }

  const nounletInfo = {
    isLoadingNounlet,
    nounletID,
    auctionData
  }

  // useNounData(nounID, (data) => {
  //   console.log('Noun data', data)
  // })
  // useNounletData(nounletID, (data) => {
  //   console.log('Nounlet data', data)
  // })

  return (
    <>
      {/*<NounChainUpdater nounID={nounID} />*/}
      <div className="space-y-16">
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
      </div>
    </>
  )
}

export default NounHome

// function NounChainUpdater(props: { nounID: string }) {
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
