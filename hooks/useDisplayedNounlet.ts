import { useEthers } from '@usedapp/core'
import { BigNumber, ethers } from 'ethers'
import txWithErrorHandling from 'lib/utils/tx-with-error-handling'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { useVaultStore } from 'store/vaultStore'
import useSWR, { unstable_serialize, useSWRConfig } from 'swr'
import useNounletAuctionInfo from './useNounletAuctionInfo'
import useNounletImageData from './useNounletImageData'
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

export default function useDisplayedNounlet(ignoreUpdate = false) {
  const router = useRouter()
  const { backgrounds } = useVaultStore()
  const { account, library } = useEthers()
  const {
    isLoading,
    vaultAddress,
    nounletTokenAddress,
    vaultCuratorAddress,
    backendLatestNounletTokenId,
    latestNounletTokenId
  } = useVaultStore()
  const sdk = useSdk()

  const nid = useMemo(() => {
    if (isLoading) return null
    if (!router.isReady) return null
    if (router.query?.nid == null) return latestNounletTokenId
    if (typeof router.query.nid !== 'string') {
      router.replace('/')
      return null
    }

    const id = parseInt(router.query.nid as string)
    if (isNaN(id)) {
      router.replace('/')
      return null
    }

    if (id <= 0 || id > +latestNounletTokenId) {
      router.replace('/')
      return null
    }
    return router.query.nid as string
  }, [isLoading, router, latestNounletTokenId])

  const { data: nounletImageData } = useNounletImageData(nid)
  const nounletBackground = useMemo(() => {
    if (nounletImageData == null) return null
    return backgrounds[nounletImageData.seed.background] || null
  }, [nounletImageData, backgrounds])

  const { data: auctionInfo, swrKey, mutate: mutateAuctionInfo } = useNounletAuctionInfo(nid)

  const shouldCheckForHolder = useMemo(() => {
    if (sdk == null) return false
    if (auctionInfo == null) return false
    if (auctionInfo.auction?.settled !== true) return false
    return true
  }, [sdk, auctionInfo])
  const { data: nounletHolderAddress } = useSWR(
    shouldCheckForHolder && { ...swrKey, name: 'NounletHolder' },
    async () => {
      const ownerAddress = await sdk!.NounletToken.attach(nounletTokenAddress).ownerOf(
        nid as string
      )
      return ownerAddress || ethers.constants.AddressZero
    },
    {
      revalidateIfStale: true,
      dedupingInterval: 60 * 1000 // 1 minute
    }
  )

  const historicBids = useMemo(() => {
    return auctionInfo?.auction!.bids ?? []
    // return [...(auctionInfo?.auction!.bids ?? [])].sort((a, b) => {
    //   return BigNumber.from(b.amount).sub(BigNumber.from(a.amount)).toNumber()
    // })
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
    if (auctionInfo == null || nid == null || auctionInfo.auction == null) return null

    let heldByAddress = nounletHolderAddress || ethers.constants.AddressZero
    let wonByAddress = auctionInfo.auction!.highestBidder?.id || ethers.constants.AddressZero

    if (heldByAddress === ethers.constants.AddressZero && !hasAuctionSettled) {
      heldByAddress = vaultCuratorAddress
    }

    if (wonByAddress === ethers.constants.AddressZero) {
      wonByAddress = vaultCuratorAddress
    }

    return {
      isSettled: auctionInfo.auction.settled, // +nid < +latestNounletTokenId,
      settledTransactionHash: auctionInfo.auction.settledTransactionHash,
      winningBid: auctionInfo.auction!.highestBidAmount.toString(),
      heldByAddress,
      endedOn: auctionEndTime,
      wonByAddress
    }
  }, [
    hasAuctionSettled,
    auctionEndTime,
    auctionInfo,
    nid,
    vaultCuratorAddress,
    nounletHolderAddress
  ])

  const bid = async (bidAmount: BigNumber) => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')

    const tx = await sdk.NounletAuction.connect(library.getSigner()).bid(vaultAddress, {
      value: bidAmount
    })
    return txWithErrorHandling(tx)
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
    return txWithErrorHandling(tx)
  }

  return {
    nid,
    isLatestNounlet: nid === latestNounletTokenId,
    isLoading: auctionInfo == null || isLoading,
    vaultAddress,
    nounletTokenAddress,
    nounletImageData,
    nounletBackground,
    latestNounletTokenId,
    hasAuctionEnded,
    hasAuctionSettled,
    auctionInfo,
    auctionEndTime,
    endedAuctionInfo,
    historicBids,
    // methods
    mutateAuctionInfo,
    bid,
    settleAuction
  }
}
