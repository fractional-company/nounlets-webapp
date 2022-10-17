import IconEth from 'src/components/icons/icon-eth'
import { NounletImage } from 'src/components/NounletImage'
import SimpleAddress from 'src/components/simple-address'
import OnMounted from 'src/components/utils/on-mounted'
import { FixedNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import useCurrentEthPrice from 'src/hooks/useCurrentEthPrice'
import useNounBuyout from 'src/hooks/useNounBuyout'
import Image from 'next/image'
import nounletIcon from 'public/img/nounlet.png'
import { useMemo } from 'react'

export default function BuyoutYourWallet(): JSX.Element {
  const { account, myNounlets, userBalance } = useNounBuyout()
  const { usdInEth, ethInUsd } = useCurrentEthPrice()

  const accountBalance = useMemo(() => {
    const usdPrice = FixedNumber.from(formatEther(userBalance || 0)).mulUnsafe(usdInEth)
    const formattedETH = FixedNumber.from(formatEther(userBalance || 0))
      .round(4)
      .toString()
    const formattedUSD = usdPrice.round(2).toString()

    return {
      formattedETH,
      formattedUSD
    }
  }, [userBalance, usdInEth])
  const nounletImages = useMemo(() => {
    if (!account) return

    if (myNounlets.length === 1)
      return (
        <div className="overflow-hidden border-white rounded-px8 border-2 flex-shrink-0 w-10 h-10">
          <NounletImage id={myNounlets[0].id} />
        </div>
      )

    return (
      <>
        <div className="overflow-hidden border-white rounded-px8 border-2 flex-shrink-0 w-10 h-10 mr-4">
          <NounletImage id={myNounlets[0].id} />
        </div>
        <div className="absolute top-0 right-0 border-white border-2 overflow-hidden rounded-px8 flex-shrink-0 w-10 h-10">
          <NounletImage id={myNounlets[1].id} />
        </div>
      </>
    )
  }, [account, myNounlets])

  if (!account) return <></>

  return (
    <div className="buyout-your-wallet">
      <div className="rounded-px10 bg-white p-3 flex items-center gap-3">
        <div className="relative">{nounletImages}</div>
        <div className="flex flex-col overflow-hidden">
          <p className="font-700 leading-px16 truncate">
            {myNounlets.length} nounlet{myNounlets.length > 1 ? 's' : ''}
          </p>
          <SimpleAddress address={account} className="text-px12 font-500 text-gray-4" />
        </div>
        <div className="flex flex-col items-end ml-auto">
          <div className="flex items-center">
            <IconEth className="h-2.5" />
            <p className="font-700 leading-px16">{accountBalance.formattedETH}</p>
          </div>
          <p className="text-px12 font-500 text-gray-4">≈ $ {accountBalance.formattedUSD}</p>
        </div>
      </div>
    </div>
  )
}
