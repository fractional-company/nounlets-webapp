import { multicall, useEtherBalance, useEthers } from '@usedapp/core'
import { OfferDetails } from 'src/components/buyout/BuyoutOfferModal'
import { BigNumber, FixedNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import txWithErrorHandling from 'src/lib/utils/txWithErrorHandling'
import { useMemo } from 'react'
import { useBuyoutStore } from 'src/store/buyout/buyout.store'
import { useNounStore } from 'src/store/noun.store'
import { useSWRConfig } from 'swr'
import useLeaderboard from './useLeaderboard'
import useNounImageData from './images/useNounImageData'
import useSdk from './utils/useSdk'
import useProofs from './useProofs'

export default function useNounBuyout() {
  const { mutate: globalMutate } = useSWRConfig()
  const { account, library } = useEthers()
  const userBalance = useEtherBalance(account)
  const sdk = useSdk()
  const { getBatchBurnProof, getWithdrawERC721Proof } = useProofs()
  const {
    backgrounds,
    isLoading: isLoadingVault,
    vaultAddress,
    nounTokenId,
    nounletTokenAddress,
    vaultCuratorAddress,
    backendLatestNounletTokenId,
    latestNounletTokenId
  } = useNounStore()
  const { isLoading, buyoutInfo, offers } = useBuyoutStore()

  const { data, myNounlets } = useLeaderboard()
  const { data: nounImageData } = useNounImageData(nounTokenId)
  const mutate = useMemo(
    () => () => {
      return globalMutate('VaultBuyout')
    },
    [globalMutate]
  )

  const nounBackground = useMemo(() => {
    if (nounImageData == null) return 'transparent'
    return backgrounds[nounImageData.seed.background] || 'transparent'
  }, [nounImageData, backgrounds])

  const pastOffers = useMemo(() => {
    return [...(buyoutInfo.offers ?? [])].reverse()
  }, [buyoutInfo.offers])

  const userOwnedNounletCount = useMemo(() => {
    return myNounlets.length
  }, [myNounlets])

  const nounletsOffered = useMemo(() => {
    const offered = buyoutInfo.fractionsOffered.map((id) => id.toNumber())
    const remaining = buyoutInfo.fractionsRemaining.map((id) => id.toNumber())
    const mapped = offered.map((id) => {
      return {
        id: id,
        isAvailable: remaining.includes(id)
      }
    })

    return mapped
  }, [buyoutInfo])

  const nounletsOfferedCount = useMemo(() => {
    return nounletsOffered.length
  }, [nounletsOffered])

  const nounletsRemaining = useMemo(() => {
    return nounletsOffered.filter((n) => n.isAvailable)
  }, [nounletsOffered])

  const nounletsRemainingCount = useMemo(() => {
    return nounletsRemaining.length
  }, [nounletsRemaining])

  const nounletPercentage = useMemo(() => {
    if (nounletsRemainingCount === 0 || nounletsOfferedCount === 0) return 1.0
    return (
      1.0 -
      FixedNumber.from('' + nounletsRemainingCount / nounletsOfferedCount)
        .round(2)
        .toUnsafeFloat()
    )
  }, [nounletsOfferedCount, nounletsRemainingCount])

  const hasEnded = useMemo(() => {
    const endTime = buyoutInfo.endTime
    return endTime.mul(1000).lte(BigNumber.from(Date.now()))
  }, [buyoutInfo])

  const getIsApprovedToStartBuyoutOrCashOut = async () => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')
    if (nounletTokenAddress == null) throw new Error('no token address')

    // Approve
    const nounletToken = sdk.NounletToken.attach(nounletTokenAddress).connect(library.getSigner())
    const isApprovedForAll = await nounletToken.isApprovedForAll(account, sdk.OptimisticBid.address)
    return isApprovedForAll
  }

  const approveBuyoutOffer = async () => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')
    if (nounletTokenAddress == null) throw new Error('no token address')

    // Approve
    const nounletToken = sdk.NounletToken.attach(nounletTokenAddress).connect(library.getSigner())
    const tx = await nounletToken.setApprovalForAll(sdk.OptimisticBid.address, true)
    return txWithErrorHandling(tx)
  }

  const submitOffer = async (offerDetails: OfferDetails) => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')
    if (nounletTokenAddress == null) throw new Error('no token address')

    const initialEthBalance = parseEther(offerDetails.ethOffered.toString())
    const nounletsOffered = myNounlets.slice(0, +offerDetails.nounletsOffered.toUnsafeFloat())
    const fractionsOffered = nounletsOffered.map((nounlet) => +nounlet.id)
    const amountsOffered = fractionsOffered.map((v) => 1)

    const vault = sdk.OptimisticBid.connect(library.getSigner())
    const tx = await vault.start(vaultAddress, fractionsOffered, amountsOffered, {
      value: initialEthBalance
    })
    return txWithErrorHandling(tx)

    // console.log({ gasLimit })

    // setBuyoutInfo({
    //   startTime: BigNumber.from(1659437203),
    //   proposer: account,
    //   state: BuyoutState.LIVE,
    //   fractionPrice,
    //   ethBalance: initialEthBalance,
    //   lastTotalSupply: BigNumber.from(100),
    //   fractionsOffered: fractionsOffered,
    //   fractionsOfferedCount: BigNumber.from(fractionsOffered.length),
    //   fractionsOfferedPrice: fractionPrice.mul(fractionsOffered.length),
    //   initialEthBalance
    // })
  }

  const buyNounlet = async (nounletIds: number[]) => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')
    if (nounletTokenAddress == null) throw new Error('no token address')
    if (account == null) throw new Error('No address')

    const optimisticBid = sdk.OptimisticBid.connect(library.getSigner())
    const tx = await optimisticBid.buyFractions(
      vaultAddress,
      nounletIds,
      nounletIds.map((_) => 1),
      {
        value: buyoutInfo.fractionPrice.mul(nounletIds.length)
      }
    )
    return txWithErrorHandling(tx)
  }

  const settleOffer = async () => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')
    if (nounletTokenAddress == null) throw new Error('no token address')
    if (account == null) throw new Error('No address')

    const merkleTree = await sdk.NounletProtoform.generateMerkleTree([
      sdk.NounletAuction.address,
      sdk.NounletGovernance.address,
      sdk.OptimisticBid.address
    ])
    // const burnProof = await sdk.NounletProtoform.getProof(merkleTree, 6)
    const burnProof = await getBatchBurnProof()
    const optimisticBid = sdk.OptimisticBid.connect(library.getSigner())

    const tx = await optimisticBid.end(
      vaultAddress,
      buyoutInfo.fractionsRemaining.map((n) => n.toNumber()),
      buyoutInfo.fractionsRemaining.map((_) => 1),
      burnProof
    )
    return txWithErrorHandling(tx)
  }

  const cashOut = async () => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')
    if (nounletTokenAddress == null) throw new Error('no token address')
    if (myNounlets.length === 0) throw new Error('No nounlets held')

    const merkleTree = await sdk.NounletProtoform.generateMerkleTree([
      sdk.NounletAuction.address,
      sdk.NounletGovernance.address,
      sdk.OptimisticBid.address
    ])
    // const burnProof = await sdk.NounletProtoform.getProof(merkleTree, 6)
    const burnProof = await getBatchBurnProof()
    const optimisticBid = sdk.OptimisticBid.connect(library.getSigner())

    const tx = await optimisticBid.cash(
      vaultAddress,
      myNounlets.map((n) => n.id),
      burnProof
    )
    // const tx = await optimisticBid.cash(
    //   myNounlets.map((n) => n.id),
    //   myNounlets.map((n) => 1)
    // )
    return txWithErrorHandling(tx)
  }

  const withdrawNoun = async () => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')
    if (nounletTokenAddress == null) throw new Error('no token address')
    if (account.toLowerCase() !== buyoutInfo.proposer.toLowerCase())
      throw new Error('not the proposer')

    const merkleTree = await sdk.NounletProtoform.generateMerkleTree([
      sdk.NounletAuction.address,
      sdk.NounletGovernance.address,
      sdk.OptimisticBid.address
    ])

    // const withdrawProof = await sdk.NounletProtoform.getProof(merkleTree, 7)
    const withdrawProof = await getWithdrawERC721Proof()
    const optimisticBid = sdk.OptimisticBid.connect(library.getSigner())

    const tx = await optimisticBid.withdrawERC721(
      vaultAddress,
      sdk.NounsToken.address,
      account,
      nounTokenId,
      withdrawProof
    )
    // const tx = await optimisticBid.withdrawNoun(withdrawProof)
    return txWithErrorHandling(tx)
  }

  return {
    isLoading: isLoadingVault || isLoading || data == null,
    nounBackground,
    userBalance,
    nounTokenId,
    myNounlets,
    offers,
    // Old
    nounletsOffered,
    nounletsOfferedCount,
    nounletsRemaining,
    nounletsRemainingCount,
    nounletPercentage,
    // User
    account,
    balance: userBalance,
    userOwnedNounletCount,
    // Buyout
    buyoutInfo,
    pastOffers,
    hasEnded,
    // Methods
    getIsApprovedToStartBuyoutOrCashOut,
    approveBuyoutOffer,
    mutate,
    submitOffer,
    settleOffer,
    buyNounlet,
    cashOut,
    withdrawNoun
  }
}
