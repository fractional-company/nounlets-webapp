import { useEthers } from '@usedapp/core'
import { BigNumber } from 'ethers'
import { getNounletAuctionData, getNounletAuctionDataBC } from 'lib/graphql/queries'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useVaultMetadataStore } from 'store/VaultMetadataStore'
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
  } = useVaultMetadataStore()
  const sdk = useSdk()

  const nid = useMemo(() => {
    if (!router.isReady) return ''
    if (router.query?.nid == null) return latestNounletTokenId
    return router.query.nid as string
  }, [router.isReady, router.query, latestNounletTokenId])

  const cachedData = cacheSWRGlobal.get(
    unstable_serialize({
      name: 'NounletAuctionData',
      vaultAddress,
      nounletTokenAddress,
      nounletId: nid
    })
  )
  const { data: auctionInfo = null, mutate: refreshDisplayedNounlet } = useSWR(
    router.isReady &&
      !isLoading &&
      sdk != null &&
      nid != null && {
        name: 'NounletAuctionData',
        vaultAddress,
        nounletTokenAddress,
        nounletId: nid
      },
    async (key) => {
      if (sdk == null) return null
      if (key.vaultAddress == null || key.nounletTokenAddress == null || key.nounletId == null)
        return null

      console.log('🧽 Fetching displayed nounlet data', key.nounletId)
      console.table(key)

      let response
      if (key.nounletId == backendLatestNounletTokenId || key.nounletId === latestNounletTokenId) {
        response = await getNounletAuctionDataBC(
          key.vaultAddress,
          key.nounletTokenAddress,
          key.nounletId,
          sdk.NounletAuction
        )

        if (
          key.nounletId == backendLatestNounletTokenId &&
          key.nounletId !== latestNounletTokenId
        ) {
          console.log('Data for unsynced auction should now be fixed')
          response.auction.settled = true
        }
      } else {
        response = await getNounletAuctionData(
          key.vaultAddress,
          key.nounletTokenAddress,
          key.nounletId
        )
      }

      console.log('🧽 Fetched displayed nounlet data', key.nounletId)
      console.log(response)
      return response
    },
    {
      refreshInterval: nid === latestNounletTokenId ? 5 * 60 * 1000 : 0, // Every 5 min if live
      revalidateIfStale: !ignoreUpdate && cachedData?.auction.settled !== true,
      errorRetryCount: 0, // TODO change to 2
      onError: (error) => {
        console.log('Error', error)
      }
    }
  )

  const { data: historicVotes } = useSWR(
    'test',
    (key) => {
      // console.log('im mutating historicVotes')
      return [1, 2]
    },
    { revalidateIfStale: true }
  )

  const historicBids = useMemo(() => {
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
    return auctionInfo != null && auctionEndTime * 1000 < Date.now()
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

    console.log(library?.getSigner())
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
