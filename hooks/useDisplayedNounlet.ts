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
import {
  getNouletAuctionDataFromBC,
  getNounletAuctionData,
  getNounletAuctionDataBC
} from 'lib/graphql/queries'
import useSdk from './useSdk'
import { useVaultMetadataStore } from 'store/VaultMetadataStore'

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

export default function useDisplayedNounlet(ignoreUpdate = false) {
  const router = useRouter()
  const { account, library } = useEthers()
  const {
    isLoading,
    vaultAddress,
    nounletTokenAddress,
    backendLatestNounletTokenId,
    latestNounletTokenId
  } = useVaultMetadataStore()
  const sdk = useSdk()

  const nid = useMemo(() => {
    if (!router.isReady) return ''
    if (router.query?.nid == null) return latestNounletTokenId
    return router.query.nid as string
  }, [router.isReady, router.query, latestNounletTokenId])

  const [wasOutOfSyncFixed, setWasOutOfSyncFixed] = useState(false)
  const IsOutOfSync = useMemo(() => {
    if (nid == null) return false
    return nid === backendLatestNounletTokenId && nid !== latestNounletTokenId && !wasOutOfSyncFixed
  }, [nid, backendLatestNounletTokenId, latestNounletTokenId, wasOutOfSyncFixed])

  const { data: auctionInfo, mutate: refreshDisplayedNounlet } = useSWR(
    router.isReady &&
      !isLoading &&
      !ignoreUpdate &&
      sdk != null &&
      nid != null && {
        name: 'NounletAuctionData',
        vaultAddress,
        nounletTokenAddress,
        nounletId: nid,
        IsOutOfSync
      },
    async (key) => {
      if (sdk == null) return null
      if (key.vaultAddress == null || key.nounletTokenAddress == null || key.nounletId == null)
        return null

      console.log('🧽 Fetching displayed nounlet data')
      console.table(key)

      let response
      if (key.IsOutOfSync || key.nounletId === latestNounletTokenId) {
        response = await getNounletAuctionDataBC(
          key.vaultAddress,
          key.nounletTokenAddress,
          key.nounletId,
          sdk.nounletAuction
        )

        if (key.IsOutOfSync) {
          console.log('Should not refetch as it is synced')
          response.auction.settled = true
          setWasOutOfSyncFixed(true)
        }
      } else {
        response = await getNounletAuctionData(
          key.vaultAddress,
          key.nounletTokenAddress,
          key.nounletId
        )
      }

      console.log('🧽 Fetched displayed nounlet data')
      console.log(response)
      return response
    },
    {
      revalidateIfStale: nid === latestNounletTokenId || IsOutOfSync,
      errorRetryCount: 0,
      onError: (error) => {
        console.log('Error', error)
      }
    }
  )

  const historicBids = useMemo(() => {
    return [...(auctionInfo?.auction.bids ?? [])].sort((a, b) => {
      return BigNumber.from(b.amount).sub(BigNumber.from(a.amount)).toNumber()
    })
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
    return auctionInfo != null && auctionEndTime * 1000 < Date.now()
  }, [auctionInfo, auctionEndTime])

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
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  const endedAuctionInfo = useMemo(() => {
    if (auctionInfo == null || nid == null) return null

    return {
      isSettled: +nid < +latestNounletTokenId,
      winningBid: auctionInfo.auction.amount.toString(),
      heldByAddress: auctionInfo.auction.bidder?.id,
      endedOn: auctionEndTime,
      wonByAddress: auctionInfo.auction.bidder?.id
    }
  }, [auctionEndTime, auctionInfo, nid, latestNounletTokenId])

  return {
    isLoading: auctionInfo == null || isLoading,
    vaultAddress,
    nounletTokenAddress,
    latestNounletTokenId,
    nid,
    hasAuctionEnded,
    hasAuctionSettled,
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
