import { OfferDetails } from 'src/components/buyout/BuyoutOfferModal'
import { NEXT_PUBLIC_BID_DECIMALS, NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import { FixedNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { BuyoutInfo, BuyoutInfoFixedNumber, BuyoutInfoFormatted } from 'src/store/buyout/buyout.store'

export const formatOfferDetails = (offerDetails: OfferDetails) => {
  const tempOfferDetailsFormatted = {
    fullPrice: '0',
    pricePerNounlet: '0',
    nounletsOffered: '0',
    priceOfOfferedNounlets: '0',
    ethOffered: '0'
  }
  try {
    tempOfferDetailsFormatted.fullPrice = offerDetails.fullPrice.toString()
    tempOfferDetailsFormatted.pricePerNounlet = offerDetails.pricePerNounlet.toString()
    tempOfferDetailsFormatted.nounletsOffered = offerDetails.nounletsOffered.toString()
    tempOfferDetailsFormatted.priceOfOfferedNounlets = offerDetails.priceOfOfferedNounlets
      .round(NEXT_PUBLIC_BID_DECIMALS + 2)
      .toString()
    tempOfferDetailsFormatted.ethOffered = offerDetails.ethOffered.toString()

    return tempOfferDetailsFormatted
  } catch (error) {
    console.log('Error calculating offerDetailsFormatted', error)
    return tempOfferDetailsFormatted
  }
}

export function toBuyoutInfoFixedNumber(buyoutInfo: BuyoutInfo): BuyoutInfoFixedNumber {
  const tmp: BuyoutInfoFixedNumber = {
    fractionPrice: FixedNumber.from(0),
    fullPrice: FixedNumber.from(0),
    lastTotalSupply: FixedNumber.from(0),
    ethBalance: FixedNumber.from(0),
    fractionsOfferedCount: FixedNumber.from(0),
    fractionsOfferedPrice: FixedNumber.from(0),
    initialEthBalance: FixedNumber.from(0)
  }

  try {
    const fractionPriceFX = FixedNumber.from(formatEther(buyoutInfo.fractionPrice))
    const fullPriceFX = FixedNumber.from(NEXT_PUBLIC_MAX_NOUNLETS).mulUnsafe(fractionPriceFX)
    const lastTotalSupplyFX = FixedNumber.from(NEXT_PUBLIC_MAX_NOUNLETS)
    const ethBalanceFX = FixedNumber.from(formatEther(buyoutInfo.ethBalance))
    const fractionsOfferedCountFX = FixedNumber.from(buyoutInfo.fractionsOffered.length)
    const fractionsOfferedPriceFX = fractionsOfferedCountFX.mulUnsafe(fractionPriceFX)
    const initialEthBalanceFX = FixedNumber.from(formatEther(buyoutInfo.initialEthBalance))

    return {
      ...tmp,
      fractionPrice: fractionPriceFX,
      fullPrice: fullPriceFX,
      lastTotalSupply: lastTotalSupplyFX,
      ethBalance: ethBalanceFX,
      fractionsOfferedCount: fractionsOfferedCountFX,
      fractionsOfferedPrice: fractionsOfferedPriceFX,
      initialEthBalance: initialEthBalanceFX
    }
  } catch (error) {
    console.log('Error calculating toBuyoutInfoFixedNumber', error)
  }
  return tmp
}

export function toBuyoutInfoFormatted(
  buyoutInfoFixedNumber: BuyoutInfoFixedNumber
): BuyoutInfoFormatted {
  const tmp: BuyoutInfoFormatted = {
    fractionPrice: '0.0',
    fullPrice: '0.0',
    lastTotalSupply: '0.0',
    ethBalance: '0.0',
    fractionsOfferedCount: '0',
    fractionsOfferedPrice: '0.0',
    initialEthBalance: '0.0'
  }

  try {
    return {
      ...tmp,
      fractionPrice: buyoutInfoFixedNumber.fractionPrice.toString(),
      fullPrice: buyoutInfoFixedNumber.fullPrice.toString(),
      lastTotalSupply: buyoutInfoFixedNumber.lastTotalSupply.toString(),
      ethBalance: buyoutInfoFixedNumber.ethBalance.toString(),
      fractionsOfferedCount: buyoutInfoFixedNumber.fractionsOfferedCount.toUnsafeFloat().toFixed(0),
      fractionsOfferedPrice: buyoutInfoFixedNumber.fractionsOfferedPrice.toString(),
      initialEthBalance: buyoutInfoFixedNumber.initialEthBalance.toString()
    }
  } catch (error) {
    console.log('Error calculating toBuyoutInfoFormatted', error)
  }
  return tmp
}
