import type { GetServerSideProps, NextPage } from 'next'
import { useEthers } from '@usedapp/core'
import { BigNumber, ethers, Signer } from 'ethers'
import OnMounted from '../components/utils/on-mounted'
import nounletAuctionABI from '../typechain/abis/nounletAuction.abi.json'

import HomeHero from 'components/home/home-hero'
import HomeLeaderboard from 'components/home/home-leaderboard'
import HomeWTF from 'components/home/home-wtf'
import HomeCollectiveOwnership from 'components/home/home-collective-ownership'
import HomeVotesFromNounlet from 'components/home/home-votes-from-nounlet'
import { Contract } from '@ethersproject/contracts'
import { useEffect } from 'react'
import BidHistoryModal from '../components/modals/bid-history-modal'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import SimpleModal from "../components/simple-modal";
import {useAppState} from "../store/application";
import {getVault} from "../lib/graphql/queries";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      vault: await getVault('0x0000000000000000000000000000000000000000')
    }
  }
}

// @ts-ignore
const Home: NextPage = ({ vault }) => {
  const { account, library } = useEthers()
  const { nid, auctionData } = useDisplayedNounlet()
  const { setBidModalOpen, isBidModalOpen } = useAppState()

  // const router = useRouter()
  // const { nid } = router.query
  useEffect(() => {
    return () => console.log('unsub')
  }, [nid])

  const getLeaves = async () => {
    const nounletAuction = new Contract(
      '0xc7500c1fe21BCEdd62A2953BE9dCb05911394027',
      nounletAuctionABI,
      library
    )
    return await nounletAuction.getLeafNodes()
  }

  const getProofs = async (hashes: any) => {
    const nounletAuction = new Contract(
      '0xc7500c1fe21BCEdd62A2953BE9dCb05911394027',
      nounletAuctionABI,
      library
    )
    return await Promise.all(
      hashes.map((hash: any, key: any) => nounletAuction.getProof(hashes, key))
    )
  }

  const placeBid = async () => {
    // await router.push(`/nounlet/${ Math.ceil(Math.random()*100)}`)
    const nounletAuction = new Contract(
      '0xc7500c1fe21BCEdd62A2953BE9dCb05911394027',
      nounletAuctionABI,
      library?.getSigner(account as string)
    )
    const leaves = await getLeaves()
    const proofs = await getProofs(leaves)
    const tx = await nounletAuction.deployVault(
      ['0xc7500c1fe21BCEdd62A2953BE9dCb05911394027'],
      [],
      [],
      proofs[0],
      '0x7aA6e56B7CDFC51835CAC9ca7CC05c39b21A4251',
      1
    )
    return tx
      .wait()
      .then((res: any) => {
        console.log(res)
      })
      .catch((e: any) => {
        console.log(e)
      })
    console.log(proofs)
  }

  return (
    <div className="page-home w-screen">
      <p onClick={placeBid} className="text-px24 m-4 font-500 cursor-pointer">
        GET PROOFS
      </p>
      <SimpleModal onClose={() => setBidModalOpen(false)} isShown={isBidModalOpen}>
        <BidHistoryModal bids={auctionData?.bids || []}/>
      </SimpleModal>
      <HomeHero />
      <HomeVotesFromNounlet />
      <HomeLeaderboard />
      <HomeCollectiveOwnership />
      <HomeWTF />
      <OnMounted>
        Mounted account: <p>{account}</p>
      </OnMounted>
    </div>
  )
}

export default Home
