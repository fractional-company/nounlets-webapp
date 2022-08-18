import { BID_DECIMALS } from 'config'
import { BigNumber, BigNumberish, FixedNumber } from 'ethers'

export function calculateNextBid(
  amount: BigNumberish,
  increaseMultiplier: BigNumberish,
  decimals = BID_DECIMALS
) {
  if (amount == null) throw new Error('amount is required')
  const amountFX = FixedNumber.from(amount)
  const increaseMultiplierFX = FixedNumber.from(increaseMultiplier)
  const decimalsFX = FixedNumber.from(10 ** decimals)
  const minBidFX = FixedNumber.from(1).divUnsafe(decimalsFX)

  const bidFX = amountFX
    .mulUnsafe(increaseMultiplierFX)
    .mulUnsafe(decimalsFX)
    .ceiling()
    .divUnsafe(decimalsFX)

  if (BigNumber.from(bidFX).lt(BigNumber.from(minBidFX))) {
    console.log('bid is smaller than allowed')
    return minBidFX.addUnsafe(amountFX)
  }

  return bidFX.addUnsafe(amountFX)
}
