import { useEthers } from '@usedapp/core'
import type { NextPage } from 'next'

import { getMainnetSdk, getRinkebySdk, RinkebySdk } from '@dethcrypto/eth-sdk-client'
import HomeHero from 'components/home/home-hero'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import { useRouter } from 'next/router'
import BidHistoryModal from '../components/modals/bid-history-modal'
import SimpleModal from '../components/simple-modal'
import { useAppStore } from '../store/application'
import { CHAIN_ID } from './_app'
import HomeLeaderboard from 'components/home/home-leaderboard'

/*
Token ID    | Vault
0           | 0x34f67ab3458eC703EBc2bd2683B117d8F0764614
*/

const Home: NextPage<{ vault: any }> = ({ vault }: { vault: any }) => {
  const router = useRouter()
  const { account, library } = useEthers()
  const { setBidModalOpen, isBidModalOpen } = useAppStore()
  const { isLoading, auctionInfo, nid, latestNounletTokenId, refreshDisplayedNounlet } =
    useDisplayedNounlet()

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

  // const createVault = async () => {
  //   if (library == null) return
  //   console.log('creating vault')

  //   const {
  //     nounsToken,
  //     nounletAuction,
  //     nounletToken,
  //     nounletProtoform,
  //     optimisticBid,
  //     nounsDescriptiorV2,
  //     nounletGovernance
  //   } = CHAIN_ID === 4 ? getRinkebySdk(library) : (getMainnetSdk(library) as RinkebySdk)

  //   // Approve protoform: 0xa9fA8E3e9ea15c37Ec6b65C8d754987bad679820
  //   const isApprovedForAll = await nounsToken.isApprovedForAll(
  //     '0xa9fA8E3e9ea15c37Ec6b65C8d754987bad679820',
  //     nounletProtoform.address
  //   )

  //   if (!isApprovedForAll) {
  //     console.log('not approved!')
  //     await nounsToken
  //       .connect(library.getSigner())
  //       .setApprovalForAll(nounletProtoform.address, true)
  //   }
  //   console.log('approved!')

  //   // const leafs = await nounletAuction.getLeafNodes()

  //   // console.log('leafs!', leafs)

  //   const merkleTree = await nounletProtoform.generateMerkleTree([
  //     nounletAuction.address,
  //     optimisticBid.address,
  //     nounletGovernance.address
  //   ])
  //   console.log('merklee!', merkleTree)

  //   /*
  //   // nounletAuction
  //   mintProof = protoform.getProof(merkleTree, 0);

  //   // optimisticBid
  //   batchBurnProof = protoform.getProof(merkleTree, 1);
  //   withdrawERC721Proof = protoform.getProof(merkleTree, 2);

  //   // nounletGovernance
  //   castVoteProof = protoform.getProof(merkleTree, 3);
  //   castVoteWithReasonProof = protoform.getProof(merkleTree, 4);
  //   cancelProof = protoform.getProof(merkleTree, 5);
  //   proposeProof = protoform.getProof(merkleTree, 6);
  //   delegateProof = protoform.getProof(merkleTree, 7);
  //   */

  //   const mintProof = await nounletProtoform.getProof(merkleTree, 0)
  //   console.log({ mintProof })

  //   // const gasPrice = await library.getGasPrice()

  //   // const tx = await nounletProtoform.deployVault(
  //   //   [nounletAuction.address, OptimisticBid.address, NounletGovernance.address],
  //   //   [],
  //   //   [],
  //   //   mintProof,
  //   //   nounsDescriptiorV2.address,
  //   //   0
  //   // )

  //   // return tx
  //   //   .wait()
  //   //   .then((res: any) => {
  //   //     console.log('Vault deployed', res)
  //   //     // debugger
  //   //     // nounletAuction.createAuction()
  //   //   })
  //   //   .catch((e: any) => {
  //   //     console.log(e)
  //   //   })
  // }

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
      <SimpleModal onClose={() => setBidModalOpen(false)} isShown={isBidModalOpen}>
        <BidHistoryModal />
      </SimpleModal>
      <div>
        {/* <pre className="bg-gray-5 text-white p-4">
          {JSON.stringify(
            {
              isLoading,
              latestNounletTokenId,
              nid,
              auctionInfo
            },
            null,
            4
          )}
        </pre>
        <button
          onClick={() => {
            refreshDisplayedNounlet()
          }}
        >
          refreshDisplayedNounlet
        </button> */}
        {/* <p>{isLoading || data == null ? 'loading' : 'loaded'}</p>
        <p>{latestNounletId}</p>
        <p>{nid}</p>
        <p>{data?.auctionInfo?.bidder}</p>
        <pre>{JSON.stringify(data?.auctionInfo, null, 4)}</pre> */}
      </div>
      <HomeHero />
      <HomeLeaderboard />
      {/* {nid === latestNounletId ? <HomeLeaderboard /> : <HomeVotesFromNounlet />} */}
      {/* <HomeCollectiveOwnership /> */}
      {/* <HomeWTF /> */}
    </div>
  )
}

export default Home
