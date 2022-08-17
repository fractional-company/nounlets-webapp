import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import useSWR from 'swr'
import { useEthers } from '@usedapp/core'
import { useAuctionStateStore } from 'store/auctionStateStore'
import { getMainnetSdk, getRinkebySdk, RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { CHAIN_ID } from 'pages/_app'
import { parseEther } from 'ethers/lib/utils'
import { getNouletAuctionDataFromBC } from 'lib/graphql/queries'
import useSdk from './useSdk'

export function generateNounletAuctionInfoKey({
  vaultAddress,
  vaultTokenId,
  nounletId
}: {
  vaultAddress?: string
  vaultTokenId?: string
  nounletId?: string
}) {
  return {
    name: 'NounletAuctionInfo',
    vaultAddress,
    vaultTokenId: vaultTokenId,
    nounletId: nounletId
  }
}

export default function useDisplayedNounlet() {
  const router = useRouter()
  const { account, library } = useEthers()
  const sdk = useSdk()

  const { isLoading, vaultAddress, vaultTokenAddress, vaultTokenId, latestNounletId } =
    useAuctionStateStore()

  const nid = useMemo(() => {
    if (router.query?.nid == null) return latestNounletId
    return router.query.nid as string
  }, [router.query?.nid, latestNounletId])

  const { data: auctionInfo, mutate: refreshDisplayedNounlet } = useSWR(
    sdk != null && latestNounletId !== '0'
      ? generateNounletAuctionInfoKey({
          vaultAddress,
          vaultTokenId,
          nounletId: nid
        })
      : null,
    async (key) => {
      if (sdk == null) return null
      if (key.vaultAddress == null || key.vaultTokenId == null || key.nounletId == null) return null
      if (key.nounletId === '0') return null

      console.log('trying to fetch auctionInfo for', key)

      const response = await getNouletAuctionDataFromBC(
        vaultAddress,
        vaultTokenAddress,
        vaultTokenId,
        key.nounletId,
        sdk.nounletAuction,
        latestNounletId
      )

      return response
      // if (key.nounletId === '1')
      //   return {
      //     id: '1',
      //     auction: {
      //       amount: '300000000000000',
      //       startTime: '1660726678',
      //       endTime: '1660741078',
      //       bidder: {
      //         id: '0x6d2343beeced0e805f3cccff870ccb974b5795e6'
      //       },
      //       settled: true,
      //       bids: [
      //         {
      //           id: '0x7a68646c9da387c30b75170240a7293170e6ca68055361d04b0baf3926b0dffa',
      //           bidder: {
      //             id: '0x497f34f8a6eab10652f846fd82201938e58d72e0'
      //           },
      //           amount: '100000000000000',
      //           blockNumber: '11213957',
      //           blockTimestamp: '1660674514'
      //         },
      //         {
      //           id: '0xad69d23da6d90074f330359b4c9e62d14dcf2412b33e54c036a066196a067d62',
      //           bidder: {
      //             id: '0x497f34f8a6eab10652f846fd82201938e58d72e0'
      //           },
      //           amount: '200000000000000',
      //           blockNumber: '11213984',
      //           blockTimestamp: '1660674919'
      //         },
      //         {
      //           id: '0xb8c83c018000653b2faca5761fd9014d41971a4217e573da600a1c359c10a4aa',
      //           bidder: {
      //             id: '0x6d2343beeced0e805f3cccff870ccb974b5795e6'
      //           },
      //           amount: '300000000000000',
      //           blockNumber: '11214062',
      //           blockTimestamp: '1660676089'
      //         }
      //       ]
      //     }
      //   }

      // return {
      //   id: '2',
      //   auction: {
      //     amount: '0',
      //     startTime: '1660741078',
      //     endTime: '1660741078',
      //     bidder: {
      //       id: '0x6d2343beeced0e805f3cccff870ccb974b5795e6'
      //     },
      //     settled: false,
      //     bids: []
      //   }
      // }
    },
    {
      revalidateIfStale: nid === latestNounletId
    }
  )

  // const { data: auctionInfo } = useSWR(
  //   { name: 'NounletAuctionInfo2', vaultAddress, nid },
  //   async (key) => {
  //     if (vaultAddress == null || library == null || key.nid === null) return null

  //     const { nounletAuction } =
  //       CHAIN_ID === 4
  //         ? getRinkebySdk(library || library)
  //         : (getMainnetSdk(library || library) as RinkebySdk)

  //     const auctionInfo = await nounletAuction.auctionInfo(vaultAddress, nid)
  //     console.group('Getting auction data for', nid)
  //     console.table(key)
  //     console.table(auctionInfo)
  //     console.groupEnd()
  //     return auctionInfo
  //   },
  //   {
  //     revalidateIfStale: nid === latestNounletId // Revalidate only latest auction
  //   }
  // )

  const historicBids = useMemo(() => {
    return auctionInfo?.auction.bids ?? []
  }, [auctionInfo])

  const { data: historicVotes } = useSWR(
    'test',
    (key) => {
      // console.log('im mutating historicVotes')
      return [1, 2]
    },
    { revalidateIfStale: true }
  )

  const auctionEndTime = useMemo(() => {
    if (auctionInfo == null) return 0

    const seconds = BigNumber.from(auctionInfo.auction.endTime).toNumber()
    return seconds
  }, [auctionInfo])

  const hasAuctionEnded = useMemo(() => {
    return auctionEndTime * 1000 < Date.now()
  }, [auctionEndTime])

  const hasAuctionSettled = useMemo(() => {
    return !!auctionInfo?.auction.settled
  }, [auctionInfo])

  const bid = async (bidAmount: BigNumber) => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')

    const tx = await sdk.nounletAuction
      .connect(library.getSigner())
      .bid(vaultAddress, { value: bidAmount })
    return tx.wait()
  }

  const settleAuction = async () => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')

    const merkleTree = await sdk.nounletProtoform.generateMerkleTree([
      sdk.nounletAuction.address,
      sdk.optimisticBid.address,
      sdk.nounletGovernance.address
    ])

    console.log(library?.getSigner())
    const mintProof = await sdk.nounletProtoform.getProof(merkleTree, 0)
    const tx = await sdk.nounletAuction
      .connect(library.getSigner())
      .settleAuction(vaultAddress, mintProof)
    return tx
      .wait()
      .then((res: any) => {
        console.log('SETTLED!', res)
        // debugger
        // nounletAuction.createAuction()
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  const endedAuctionInfo = useMemo(() => {
    if (auctionInfo == null) return null

    return {
      isSettled: auctionInfo.auction.settled,
      winningBid: auctionInfo.auction.amount,
      heldByAddress: auctionInfo.auction.bidder?.id,
      endedOn: auctionEndTime,
      wonByAddress: auctionInfo.auction.bidder?.id
    }
  }, [auctionEndTime, auctionInfo])

  return {
    isLoading,
    hasAuctionEnded,
    hasAuctionSettled,
    nid,
    latestNounletId,
    auctionInfo,
    auctionEndTime,
    endedAuctionInfo,
    historicBids,
    historicVotes,
    // methods
    refreshDisplayedNounlet,
    bid,
    settleAuction
  }
}
