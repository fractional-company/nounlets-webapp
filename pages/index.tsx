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
import SimpleModal from '../components/simple-modal'
import { useAppState } from '../store/application'
import { getVault } from '../lib/graphql/queries'
import useSWR from 'swr'
import { CHAIN_ID } from './_app'
import { getMainnetSdk, getRinkebySdk, RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { useRouter } from 'next/router'
import { useAuctionStateStore } from 'store/auctionStateStore'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'

/*
Token ID    | Vault
0           | 0x34f67ab3458eC703EBc2bd2683B117d8F0764614
*/

// export const getServerSideProps: GetServerSideProps = async () => {
//   console.log('Getting SSP 2')
//   return {
//     props: {
//       // vault: await getVault('0x88645a6d84830311e4090107b106f5c75a3feab8')
//       vault: null // await getVault('0x332f26aa917d20806954e8facce349b5c3ba0fdc')
//     }
//   }
// }

const Home: NextPage<{ vault: any }> = ({ vault }: { vault: any }) => {
  const router = useRouter()
  const { account, library } = useEthers()
  const { setBidModalOpen, isBidModalOpen } = useAppState()
  const { isLoading, auctionInfo, nid, latestNounletId } = useDisplayedNounlet()

  // const { vaultAddress, isLoading } = useAuctionStateStore()
  // const nid = +(router.query?.nid || 0)

  // const { data } = useSWR(
  //   { name: 'NounletAuctionInfo', vaultAddress, nid },
  //   async (key) => {
  //     if (vaultAddress == null || library == null || key.nid === null) return null
  //     console.table(key)
  //     const { nounletAuction, nounletToken, nounletProtoform } =
  //       CHAIN_ID === 4 ? getRinkebySdk(library) : (getMainnetSdk(library) as RinkebySdk)

  //     const auctionInfo = await nounletAuction.auctionInfo(vaultAddress, 1)
  //     return { auctionInfo }
  //   },
  //   {}
  // )

  // console.log(nid, { data })

  // const router = useRouter()
  // const { nid } = router.query
  // useEffect(() => {
  //   return () => console.log('unsub')
  // }, [nid])

  const createVault = async () => {
    if (library == null) return
    console.log('creating vault')

    const {
      nounsToken,
      nounletAuction,
      nounletToken,
      nounletProtoform,
      optimisticBid,
      nounsDescriptiorV2,
      nounletGovernance
    } = CHAIN_ID === 4 ? getRinkebySdk(library) : (getMainnetSdk(library) as RinkebySdk)

    // Approve protoform: 0xa9fA8E3e9ea15c37Ec6b65C8d754987bad679820
    const isApprovedForAll = await nounsToken.isApprovedForAll(
      '0xa9fA8E3e9ea15c37Ec6b65C8d754987bad679820',
      nounletProtoform.address
    )

    // if (!isApprovedForAll) {
    //   console.log('not approved!')
    //   await nounsToken.setApprovalForAll(nounletProtoform.address, true)
    // }
    console.log('approved!')

    // const leafs = await nounletAuction.getLeafNodes()

    // console.log('leafs!', leafs)

    const merkleTree = await nounletProtoform.generateMerkleTree([
      nounletAuction.address,
      optimisticBid.address,
      nounletGovernance.address
    ])
    console.log('merklee!', merkleTree)

    /*
    // nounletAuction
    mintProof = protoform.getProof(merkleTree, 0);

    // optimisticBid
    batchBurnProof = protoform.getProof(merkleTree, 1); 
    withdrawERC721Proof = protoform.getProof(merkleTree, 2); 

    // nounletGovernance
    castVoteProof = protoform.getProof(merkleTree, 3);    
    castVoteWithReasonProof = protoform.getProof(merkleTree, 4);
    cancelProof = protoform.getProof(merkleTree, 5);
    proposeProof = protoform.getProof(merkleTree, 6);
    delegateProof = protoform.getProof(merkleTree, 7);
    */

    const mintProof = await nounletProtoform.getProof(merkleTree, 0)
    console.log({ mintProof })

    // const gasPrice = await library.getGasPrice()

    // const tx = await nounletProtoform.deployVault(
    //   [nounletAuction.address, optimisticBid.address, nounletGovernance.address],
    //   [],
    //   [],
    //   mintProof,
    //   nounsDescriptiorV2.address,
    //   0
    // )

    // return tx
    //   .wait()
    //   .then((res: any) => {
    //     console.log('Vault deployed', res)
    //     // debugger
    //     // nounletAuction.createAuction()
    //   })
    //   .catch((e: any) => {
    //     console.log(e)
    //   })
  }

  // useEffect(() => {
  //   if (nid != null) {
  //     if (nid < 1 || nid > 100) {
  //       console.log('navigate away')
  //       router.push(`/`)
  //     }
  //   }
  // }, [nid, router])

  return (
    <div className="page-home w-screen">
      <p onClick={createVault} className="text-px24 m-4 font-500 cursor-pointer">
        CREATE VAULT
      </p>
      <SimpleModal onClose={() => setBidModalOpen(false)} isShown={isBidModalOpen}>
        {/* <BidHistoryModal bids={auctionData?.bids || []} /> */}
      </SimpleModal>
      <div>
        <pre className="bg-gray-5 text-white p-4">
          {JSON.stringify(
            {
              isLoading,
              latestNounletId,
              nid,
              auctionInfo
            },
            null,
            4
          )}
        </pre>
        {/* <p>{isLoading || data == null ? 'loading' : 'loaded'}</p>
        <p>{latestNounletId}</p>
        <p>{nid}</p>
        <p>{data?.auctionInfo?.bidder}</p>
        <pre>{JSON.stringify(data?.auctionInfo, null, 4)}</pre> */}
      </div>
      <HomeHero />
      {/* {nid === latestNounletId ? <HomeLeaderboard /> : <HomeVotesFromNounlet />} */}
      {/* <HomeCollectiveOwnership /> */}
      {/* <HomeWTF /> */}
    </div>
  )
}

export default Home
