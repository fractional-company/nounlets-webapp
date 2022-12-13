import { useCoingeckoPrice } from '@usedapp/coingecko'
import { FixedNumber } from 'ethers'
import { useEffect, useState } from 'react'

export default function useCurrentEthPrice() {
  const etherPrice = useCoingeckoPrice('ethereum', 'usd')

  const [usdInEth, setUsdInEth] = useState(FixedNumber.from(0))
  const [ethInUsd, setEthInUsd] = useState(FixedNumber.from(0))

  useEffect(() => {
    setUsdInEth(FixedNumber.from(etherPrice || 0))
    setEthInUsd(FixedNumber.from('1').divUnsafe(FixedNumber.from(etherPrice || 1)))
  }, [etherPrice])

  return {
    usdInEth,
    ethInUsd
  }
}
