import { useEthers } from '@usedapp/core'
import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { useAuctionInfoStore } from 'store/auctionInfoStore'
import { useVaultStore } from 'store/vaultStore'
import useSWR, { unstable_serialize, useSWRConfig } from 'swr'
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

// let prev: any = null

export default function useDisplayedNounlet(ignoreUpdate = false) {
  const router = useRouter()
  const { mutate: mutateSWRGlobal, cache: cacheSWRGlobal } = useSWRConfig()
  const { account, library } = useEthers()
  const {
    isLoading,
    vaultAddress,
    nounletTokenAddress,
    backendLatestNounletTokenId,
    latestNounletTokenId
  } = useVaultStore()
  const sdk = useSdk()

  const { data: auctionInfoMap } = useAuctionInfoStore()
  const nid = useMemo(() => {
    if (isLoading) return null
    if (!router.isReady) return null
    if (router.query?.nid == null) return latestNounletTokenId
    return router.query.nid as string
  }, [isLoading, router.isReady, router.query, latestNounletTokenId])

  const auctionInfo = nid ? auctionInfoMap[nid] : null

  const swrQueryKey = useMemo(() => {
    if (nid == null) return null
    return {
      name: 'NounletAuctionData',
      vaultAddress,
      nounletTokenAddress,
      nounletId: nid
    }
  }, [nid, vaultAddress, nounletTokenAddress])

  const historicBids = useMemo(() => {
    // console.log('historic bids')
    return [...(auctionInfo?.auction!.bids ?? [])].sort((a, b) => {
      return BigNumber.from(b.amount).sub(BigNumber.from(a.amount)).toNumber()
    })
  }, [auctionInfo])

  const auctionEndTime = useMemo(() => {
    if (auctionInfo == null) return 0

    const seconds = BigNumber.from(auctionInfo.auction!.endTime).toNumber()
    return seconds
  }, [auctionInfo])

  const hasAuctionEnded = useMemo(() => {
    const now = Date.now() + 5000 // add 5 second buffer
    return auctionInfo != null && auctionEndTime * 1000 <= now
  }, [auctionInfo, auctionEndTime])

  const hasAuctionSettled = useMemo(() => {
    return !!auctionInfo?.auction!.settled
  }, [auctionInfo])

  const endedAuctionInfo = useMemo(() => {
    if (auctionInfo == null || nid == null) return null

    return {
      isSettled: +nid < +latestNounletTokenId,
      winningBid: auctionInfo.auction!.amount.toString(),
      heldByAddress: auctionInfo.auction!.bidder?.id,
      endedOn: auctionEndTime,
      wonByAddress: auctionInfo.auction!.bidder?.id
    }
  }, [auctionEndTime, auctionInfo, nid, latestNounletTokenId])

  const bid = async (bidAmount: BigNumber) => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')

    const tx = await sdk.NounletAuction.connect(library.getSigner()).bid(vaultAddress, {
      value: bidAmount
    })
    return tx.wait()
  }

  const settleAuction = async () => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')

    const merkleTree = await sdk.NounletProtoform.generateMerkleTree([
      sdk.NounletAuction.address,
      sdk.OptimisticBid.address,
      sdk.NounletGovernance.address
    ])

    const mintProof = await sdk.NounletProtoform.getProof(merkleTree, 0)
    const tx = await sdk.NounletAuction.connect(library.getSigner()).settleAuction(
      vaultAddress,
      mintProof
    )
    return tx
      .wait()
      .then((res: any) => {
        console.log('SETTLED!', res)
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  const mutateDisplayedNounletAuctionInfo = useCallback(async () => {
    if (swrQueryKey != null) {
      console.log('🔨 force mutate', swrQueryKey.nounletId)
      return mutateSWRGlobal(swrQueryKey)
    }
  }, [swrQueryKey, mutateSWRGlobal])

  return {
    swrQueryKey,
    nid,
    isLoading: auctionInfo == null || isLoading,
    vaultAddress,
    nounletTokenAddress,
    latestNounletTokenId,
    hasAuctionEnded,
    hasAuctionSettled,
    auctionInfo,
    auctionEndTime,
    endedAuctionInfo,
    historicBids,
    // methods
    mutateDisplayedNounletAuctionInfo,
    bid,
    settleAuction
  }
}
