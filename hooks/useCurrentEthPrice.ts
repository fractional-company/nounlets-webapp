import { BigNumber, FixedNumber } from 'ethers'
import { parseEther, parseUnits } from 'ethers/lib/utils'
import { useState } from 'react'

// TODO check the prices
export default function useCurrentEthPrice() {
  const [usdInEth, setUsdInEth] = useState(FixedNumber.from('1632.13'))
  const [ethInUsd, setEthInUsd] = useState(
    FixedNumber.from('1').divUnsafe(FixedNumber.from('1632.13'))
  )

  return {
    usdInEth,
    ethInUsd
  }
}
