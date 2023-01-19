import IconEth from 'src/components/common/icons/IconEth'
import { NounletImage } from 'src/components/common/NounletImage'
import SimpleAddress from 'src/components/common/simple/SimpleAddress'
import OnMounted from 'src/components/OnMounted'
import { FixedNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import useCurrentEthPrice from 'src/hooks/utils/useCurrentEthPrice'
import useNounBuyout from 'src/hooks/useNounBuyout'
import Image from 'next/image'
import nounletIcon from 'public/img/nounlet.png'
import { useMemo } from 'react'
import useDisplayedNounlet from 'src/hooks/useDisplayedNounlet'

export default function BuyoutYourWallet(): JSX.Element {
  const { account, myNounlets, userBalance } = useNounBuyout()
  const { usdInEth, ethInUsd } = useCurrentEthPrice()
  const { nounTokenId, nounletTokenAddress } = useDisplayedNounlet()

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
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-px8 border-2 border-white">
          <NounletImage
            noundId={nounTokenId}
            id={myNounlets[0].id}
            nounletTokenAddress={nounletTokenAddress}
          />
        </div>
      )

    return (
      <>
        <div className="mr-4 h-10 w-10 flex-shrink-0 overflow-hidden rounded-px8 border-2 border-white">
          <NounletImage
            noundId={nounTokenId}
            id={myNounlets[0].id}
            nounletTokenAddress={nounletTokenAddress}
          />
        </div>
        <div className="absolute top-0 right-0 h-10 w-10 flex-shrink-0 overflow-hidden rounded-px8 border-2 border-white">
          <NounletImage
            noundId={nounTokenId}
            id={myNounlets[1].id}
            nounletTokenAddress={nounletTokenAddress}
          />
        </div>
      </>
    )
  }, [account, myNounlets, nounTokenId, nounletTokenAddress])

  if (!account) return <></>

  return (
    <div className="buyout-your-wallet">
      <div className="flex items-center gap-3 rounded-px10 bg-white p-3">
        <div className="relative">{nounletImages}</div>
        <div className="flex flex-col overflow-hidden">
          <p className="truncate font-700 leading-px16">
            {myNounlets.length} nounlet{myNounlets.length > 1 ? 's' : ''}
          </p>
          <SimpleAddress address={account} className="text-px12 font-500 text-gray-4" />
        </div>
        <div className="ml-auto flex flex-col items-end">
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
