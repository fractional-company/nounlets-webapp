import { useEthers } from '@usedapp/core'
import { OfferDetails } from 'components/buyout/buyout-offer-modal/buyout-offer-modal'
import { BigNumber, FixedNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { BuyoutState, useBuyoutStore } from 'store/buyout/buyout.store'

function useMockWallet() {
  const { account } = useEthers()
  const balance = parseEther('2.6783')

  return {
    account,
    balance
  }
}

export default function useBuyoutNoun() {
  const { account, balance } = useMockWallet()
  const { isLoading, buyoutInfo, offers, setBuyoutInfo } = useBuyoutStore()

  const currentOffer = parseEther('13.66')
  const pastOffers = useMemo(() => {
    return [...offers].reverse()
  }, [offers])

  const userOwnedNounletCount = useMemo(() => {
    return account ? 3 : 0
  }, [account])

  const submitOffer = async (offerDetails: OfferDetails) => {
    console.log('submitting offer', offerDetails)
    if (account == null) throw new Error('No address')
    // await mockDelayedPromise()

    const fractionPrice = parseEther(offerDetails.pricePerNounlet.toString())
    const fractionsOffered = [BigNumber.from(0), BigNumber.from(1), BigNumber.from(2)]
    const initialEthBalance = parseEther(offerDetails.ethOffered.toString())

    setBuyoutInfo({
      startTime: BigNumber.from(1659437203),
      proposer: account,
      state: BuyoutState.LIVE,
      fractionPrice,
      ethBalance: initialEthBalance,
      lastTotalSupply: BigNumber.from(100),
      fractionsOffered: fractionsOffered,
      fractionsOfferedCount: BigNumber.from(fractionsOffered.length),
      fractionsOfferedPrice: fractionPrice.mul(fractionsOffered.length),
      initialEthBalance
    })
  }

  const nounletsOffered = useMemo(
    () => [
      { id: 0, isAvailable: false },
      { id: 1, isAvailable: false },
      { id: 2, isAvailable: true },
      { id: 3, isAvailable: true },
      { id: 4, isAvailable: true },
      { id: 5, isAvailable: true },
      { id: 6, isAvailable: false },
      { id: 7, isAvailable: true },
      { id: 100, isAvailable: true }
    ],
    []
  )

  const nounletsOfferedCount = useMemo(() => {
    return nounletsOffered.length
  }, [nounletsOffered])

  const nounletsRemainingCount = useMemo(() => {
    return nounletsOffered.filter((n) => n.isAvailable).length
  }, [nounletsOffered])

  const nounletPercentage = useMemo(() => {
    return (
      1.0 -
      FixedNumber.from('' + nounletsRemainingCount / nounletsOfferedCount)
        .round(2)
        .toUnsafeFloat()
    )
  }, [nounletsOfferedCount, nounletsRemainingCount])

  return {
    // TODO
    nounletsOffered,
    nounletsOfferedCount,
    nounletsRemainingCount,
    nounletPercentage,
    // User
    account,
    balance,
    userOwnedNounletCount,
    // Buyout
    buyoutInfo,
    currentOffer,
    pastOffers,
    submitOffer
  }
}
