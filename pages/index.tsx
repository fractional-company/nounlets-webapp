import type { GetServerSideProps, NextPage } from 'next'
import { useEthers } from '@usedapp/core'
import { BigNumber, ethers, Signer } from 'ethers'
import OnMounted from '../components/utils/on-mounted'
import nounletAuctionABI from '../typechain/abis/nounletAuction.abi.json'
import nounletProtoformABI from '../typechain/abis/nounletProtoform.abi.json'

import HomeHero from 'components/home/home-hero'
import HomeLeaderboard from 'components/home/home-leaderboard'
import HomeWTF from 'components/home/home-wtf'
import HomeCollectiveOwnership from 'components/home/home-collective-ownership'
import HomeVotesFromNounlet from 'components/home/home-votes-from-nounlet'
import { Contract } from '@ethersproject/contracts'
import { useEffect } from 'react'
import BidHistoryModal from '../components/modals/bid-history-modal'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import SimpleModal from '../components/simple-modal'
import { useAppState } from '../store/application'
import { getVault } from '../lib/graphql/queries'

export const getServerSideProps: GetServerSideProps = async () => {
  console.log('Getting SSP')
  return {
    props: {
      // vault: await getVault('0x88645a6d84830311e4090107b106f5c75a3feab8')
      vault: null // await getVault('0x332f26aa917d20806954e8facce349b5c3ba0fdc')
    }
  }
}

// @ts-ignore
const Home: NextPage = ({ vault }) => {
  console.log('Vault page', vault)
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
      '0x6d7B5aD50c21c72844Da477f7D08c04829Bf1852',
      nounletAuctionABI,
      library
    )
    return await nounletAuction.getLeafNodes()
  }

  const getProofs = async (hashes: any) => {
    const nounletProtoform = new Contract(
      '0x023f4dfea21d5DE04D9421073a0ede6DF13E8800',
      nounletProtoformABI,
      library
    )
    return nounletProtoform.generateMerkleTree([
      '0x6d7B5aD50c21c72844Da477f7D08c04829Bf1852',
      '0xeEb28759aF7ec93f0678d7Ce294cF3F75b697355'
    ])
    // return await Promise.all(
    //     hashes.map((hash: any, key: any) => nounletProtoform.getProof(hashes, key))
    // )
  }

  const placeBid = async () => {
    // await router.push(`/nounlet/${ Math.ceil(Math.random()*100)}`)
    const nounletProtoform = new Contract(
      '0x023f4dfea21d5DE04D9421073a0ede6DF13E8800',
      nounletProtoformABI,
      library?.getSigner(account as string)
    )
    const nounletAuction = new Contract(
      '0x6d7B5aD50c21c72844Da477f7D08c04829Bf1852',
      nounletAuctionABI,
      library?.getSigner(account as string)
    )
    const leaves = await getLeaves()
    const proofs = await getProofs(leaves)
    const finalProofs = [proofs[1], proofs[2]]
    const tx = await nounletProtoform.deployVault(
      ['0x6d7B5aD50c21c72844Da477f7D08c04829Bf1852', '0xeEb28759aF7ec93f0678d7Ce294cF3F75b697355'],
      [],
      [],
      finalProofs,
      '0x7aA6e56B7CDFC51835CAC9ca7CC05c39b21A4251',
      1
    )
    return tx
      .wait()
      .then((res: any) => {
        debugger
        nounletAuction.createAuction()
      })
      .catch((e: any) => {
        console.log(e)
      })
    console.log(proofs)
    if (account) {
      // const signer = library?.getSigner(account)
      // const { nounletAuction } = getRinkebySdk(signer as Signer)
    }
  }

  return (
    <div className="page-home w-screen">
      <p onClick={placeBid} className="text-px24 m-4 font-500 cursor-pointer">
        GET PROOFS
      </p>
      <SimpleModal onClose={() => setBidModalOpen(false)} isShown={isBidModalOpen}>
        <BidHistoryModal bids={auctionData?.bids || []} />
      </SimpleModal>
      <HomeHero />
      <HomeVotesFromNounlet />
      <HomeLeaderboard />
      <HomeCollectiveOwnership />
      <HomeWTF />
    </div>
  )
}

export default Home
