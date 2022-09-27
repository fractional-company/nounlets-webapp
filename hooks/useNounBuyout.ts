import { useEtherBalance, useEthers } from '@usedapp/core'
import { OfferDetails } from 'components/buyout/buyout-offer-modal/buyout-offer-modal'
import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import txWithErrorHandling from 'lib/utils/tx-with-error-handling'
import { useMemo } from 'react'
import { useBuyoutStore } from 'store/buyout/buyout.store'
import { useVaultStore } from 'store/vaultStore'
import useLeaderboard from './useLeaderboard'
import useNounImageData from './useNounImageData'
import useSdk from './useSdk'

export default function useNounBuyout() {
  const { account, library } = useEthers()
  const userBalance = useEtherBalance(account)
  const sdk = useSdk()
  const {
    backgrounds,
    isLoading: isLoadingVault,
    vaultAddress,
    nounTokenId,
    nounletTokenAddress,
    vaultCuratorAddress,
    backendLatestNounletTokenId,
    latestNounletTokenId
  } = useVaultStore()
  const { isLoading, buyoutInfo, offers } = useBuyoutStore()
  const { myNounlets } = useLeaderboard()
  const { data: nounImageData } = useNounImageData(nounTokenId)

  const nounBackground = useMemo(() => {
    if (nounImageData == null) return 'transparent'
    return backgrounds[nounImageData.seed.background] || 'transparent'
  }, [nounImageData, backgrounds])

  const submitOffer = async (offerDetails: OfferDetails) => {
    if (sdk == null) throw new Error('no sdk')
    if (account == null) throw new Error('no signer')
    if (library == null) throw new Error('no library')
    if (vaultAddress == null) throw new Error('no vault')
    if (nounletTokenAddress == null) throw new Error('no token address')

    console.log('submitting offer', { offerDetails })
    if (account == null) throw new Error('No address')
    // await mockDelayedPromise()

    // Approve
    const nounletToken = sdk.NounletToken.attach(nounletTokenAddress).connect(library.getSigner())
    const isApprovedForAll = await nounletToken.isApprovedForAll(account, sdk.OptimisticBid.address)

    if (!isApprovedForAll) {
      const tx = await nounletToken.setApprovalForAll(sdk.OptimisticBid.address, true)
      await tx.wait()
    }

    // const fractionPrice = parseEther(offerDetails.pricePerNounlet.toString())
    // const fractionsOffered = [BigNumber.from(0), BigNumber.from(1), BigNumber.from(2)]

    const initialEthBalance = parseEther(offerDetails.ethOffered.toString())
    const nounletsOffered = myNounlets.slice(0, +offerDetails.nounletsOffered.toUnsafeFloat())
    const fractionsOffered = nounletsOffered.map((nounlet) => +nounlet.id)
    const amountsOffered = fractionsOffered.map((v) => 1)

    console.log('Calling start', {
      vaultAddress,
      initialEthBalance,
      fractionsOffered,
      amountsOffered
    })

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

  return {
    isLoading: isLoadingVault && isLoading,
    nounTokenId,
    account,
    userBalance,
    myNounlets,
    buyoutInfo,
    offers,
    nounBackground,
    submitOffer
  }
}
