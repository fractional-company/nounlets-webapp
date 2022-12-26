import { useEthers } from '@usedapp/core'
import { BigNumber, ethers, FixedNumber } from 'ethers'
import txWithErrorHandling from 'src/lib/utils/txWithErrorHandling'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { useNounStore } from 'src/store/noun.store'
import { useNounletStore } from 'src/store/nounlet.store'
import useSWR, { unstable_serialize, useSWRConfig } from 'swr'
import useNounletAuctionInfo from './useNounletAuctionInfo'
import useNounletImageData from './images/useNounletImageData'
import useSdk from './utils/useSdk'
import useProofs from './useProofs'

export default function useDisplayedNounlet(ignoreUpdate = false) {
  const { cache, mutate: globalMutate } = useSWRConfig()
  const sdk = useSdk()
  const { getMintProof } = useProofs()
  const { backgrounds } = useNounStore()
  const { account, library } = useEthers()
  const {
    isLoading,
    vaultAddress,
    nounletTokenAddress,
    vaultCuratorAddress,
    backendLatestNounletTokenId,
    latestNounletTokenId,
    nounTokenId
  } = useNounStore()
  const { nounletId, auctionData } = useNounletStore()

  const { data: nounletImageData } = useNounletImageData(
    nounTokenId,
    nounletTokenAddress,
    nounletId
  )

  const mutateAuctionInfo = useCallback(async () => {
    return globalMutate(`${nounletTokenAddress}/nounlet/${nounletId}`)
  }, [globalMutate, nounletTokenAddress, nounletId])

  const nounletBackground = useMemo(() => {
    if (nounletImageData == null) return null
    return backgrounds[nounletImageData.seed.background] || null
  }, [nounletImageData, backgrounds])

  const shouldCheckForHolder = useMemo(() => {
    if (sdk == null) return false
    if (auctionData == null) return false
    if (auctionData.auction?.settled !== true) return false
    return true
  }, [sdk, auctionData])

  const { data: nounletHolderAddress } = useSWR(
    shouldCheckForHolder && { nounTokenId, nounletId, name: 'NounletHolder' },
    async () => {
      const ownerAddress = await sdk!.NounletToken.attach(nounletTokenAddress).ownerOf(
        nounletId as string
      )
      return ownerAddress || ethers.constants.AddressZero
    },
    {
      revalidateIfStale: true,
      dedupingInterval: 60 * 1000 // 1 minute
    }
  )

  const historicBids = useMemo(() => {
    return auctionData?.auction!.bids ?? []
    // return [...(auctionData?.auction!.bids ?? [])].sort((a, b) => {
    //   return BigNumber.from(b.amount).sub(BigNumber.from(a.amount)).toNumber()
    // })
  }, [auctionData])

  const auctionEndTime = useMemo(() => {
    if (auctionData == null) return 0

    const seconds = BigNumber.from(auctionData.auction!.endTime).toNumber()
    return seconds
  }, [auctionData])

  const hasAuctionEnded = useMemo(() => {
    const now = Date.now() + 2000 // add 2 second buffer
    return auctionData != null && auctionEndTime * 1000 <= now
  }, [auctionData, auctionEndTime])

  const hasAuctionSettled = useMemo(() => {
    return !!auctionData?.auction!.settled
  }, [auctionData])

  const endedAuctionInfo = useMemo(() => {
    if (auctionData == null || nounletId == null || auctionData.auction == null) return null

    let heldByAddress = nounletHolderAddress || null
    let wonByAddress = auctionData.auction!.highestBidder?.id || ethers.constants.AddressZero

    if (heldByAddress == null && !hasAuctionSettled) {
      heldByAddress = vaultCuratorAddress
    }

    if (wonByAddress === ethers.constants.AddressZero) {
      wonByAddress = vaultCuratorAddress
    }

    return {
      isSettled: auctionData.auction.settled, // +nid < +latestNounletTokenId,
      settledTransactionHash: auctionData.auction.settledTransactionHash,
      winningBid: auctionData.auction!.highestBidAmount.toString(),
      heldByAddress,
      endedOn: auctionEndTime,
      wonByAddress
    }
  }, [
    hasAuctionSettled,
    auctionEndTime,
    auctionData,
    nounletId,
    vaultCuratorAddress,
    nounletHolderAddress
  ])

  const bid = async (bidAmount: BigNumber) => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')

    const gasLimit = await sdk.NounletAuction.estimateGas.bid(vaultAddress, { value: bidAmount })
    const tx = await sdk.NounletAuction.connect(library.getSigner()).bid(vaultAddress, {
      value: bidAmount,
      gasLimit: gasLimit.mul(12).div(10)
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
      sdk.NounletGovernance.address,
      sdk.OptimisticBid.address
    ])

    // const mintProof = await sdk.NounletProtoform.getProof(merkleTree, 0)
    const mintProof = await getMintProof()
    const tx = await sdk.NounletAuction.connect(library.getSigner()).settleAuction(
      vaultAddress,
      mintProof
    )
    return txWithErrorHandling(tx)
  }

  return {
    nid: nounletId,
    nounTokenId,
    nounletId,
    isLatestNounlet: nounletId === latestNounletTokenId,
    isLoading: auctionData == null || isLoading,
    vaultAddress,
    nounletTokenAddress,
    nounletImageData,
    nounletBackground,
    latestNounletTokenId,
    hasAuctionEnded,
    hasAuctionSettled,
    auctionData,
    auctionEndTime,
    endedAuctionInfo,
    historicBids,
    // methods
    mutateAuctionInfo,
    bid,
    settleAuction
  }
}
