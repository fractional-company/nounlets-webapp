import type { GetServerSideProps, NextPage } from 'next'
import { useEthers } from '@usedapp/core'
import { ethers, Signer } from 'ethers'
import OnMounted from '../components/utils/on-mounted'
import nounletAuctionABI from '../eth-sdk/abis/rinkeby/nounletAuction.json'
import { gql } from '@apollo/client'
import client from '../apollo-client'

import HomeHero from 'components/home/home-hero'
import HomeLeaderboard from 'components/home/home-leaderboard'
import HomeWTF from 'components/home/home-wtf'
import HomeCollectiveOwnership from 'components/home/home-collective-ownership'
import { getRinkebySdk } from '@dethcrypto/eth-sdk-client'
import HomeVotesFromNounlet from 'components/home/home-votes-from-nounlet'
import {useRouter} from "next/router";
import {Contract} from "@ethersproject/contracts";
import {useNounletsAuction} from "../lib/utils/nounletContracts";
import {useEffect} from "react";

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await client.query({
    query: gql`
      query MyQuery {
        vault(id: "0x067b73fbc3accf78b4b8ebfb7964a03fb4554a0e") {
          id
          noun {
            id
            nounlets {
              id
            }
          }
        }
      }
    `
  })

  return {
    props: {
      vault: data.vault
    }
  }
}

// @ts-ignore
const Home: NextPage = ({ vault }) => {
  const { account, library } = useEthers()
    const router = useRouter()
    const { nid } = router.query
    const auctionContract = useNounletsAuction()
    useEffect(() => {
        console.log('neki', nid)
        return () => console.log('unsub')
    }, [nid])
    console.log(nid)
    const getLeaves = async () => {
        const nounletAuction = new Contract('0xc7500c1fe21BCEdd62A2953BE9dCb05911394027', nounletAuctionABI, library)
        return await nounletAuction.getLeafNodes();
    }

    const getProofs = async (hashes: any) => {
        const nounletAuction = new Contract('0xc7500c1fe21BCEdd62A2953BE9dCb05911394027', nounletAuctionABI, library)
        return await Promise.all(hashes.map((hash: any, key: any) => nounletAuction.getProof(hashes, key)))
    }


  const placeBid = async () => {
      await router.push(`/nounlet/${ Math.ceil(Math.random()*100)}`)
    //   const nounletAuction = new Contract('0xc7500c1fe21BCEdd62A2953BE9dCb05911394027', nounletAuctionABI, library?.getSigner(account as string))
    //   const leaves = await getLeaves()
    //   const proofs = await getProofs(leaves)
    //   const tx = await nounletAuction.deployVault(['0xc7500c1fe21BCEdd62A2953BE9dCb05911394027'], [], [], proofs[0], '0x7aA6e56B7CDFC51835CAC9ca7CC05c39b21A4251', 1)
    //   return tx.wait().then((res: any) => {
    //       console.log(res)
    //   }).catch((e: any) => {
    //       console.log(e)
    //   })
    //   console.log(proofs)
    // if (account) {
    //   // const signer = library?.getSigner(account)
    //   // const { nounletAuction } = getRinkebySdk(signer as Signer)
    // }
  }

  return (
    <div className="page-home w-screen">
      <p onClick={placeBid} className="text-px24 m-4 font-500 cursor-pointer">GET PROOFS</p>
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
