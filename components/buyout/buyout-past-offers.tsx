import { Goerli, Mainnet } from '@usedapp/core'
import IconEth from 'components/icons/icon-eth'
import IconLinkOffsite from 'components/icons/icon-link-offsite'
import SimpleAddress from 'components/simple-address'
import { CHAIN_ID, NEXT_PUBLIC_BID_DECIMALS } from 'config'
import { FixedNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import useNounBuyout from 'hooks/useNounBuyout'
import { useMemo } from 'react'
import { BuyoutState } from 'store/buyout/buyout.store'

export default function BuyoutPastOffers(): JSX.Element {
  const { pastOffers } = useNounBuyout()
  const pastOffersList: JSX.Element[] = useMemo(() => {
    return pastOffers
      .filter((offer) => offer.state !== BuyoutState.LIVE)
      .slice(0, 3)
      .map((bid) => {
        const ethValue = FixedNumber.from(formatEther(bid.value.toString()))
          .round(NEXT_PUBLIC_BID_DECIMALS)
          .toString()

        const explorerLink =
          CHAIN_ID === 1
            ? Mainnet.getExplorerTransactionLink(bid.id)
            : Goerli.getExplorerTransactionLink(bid.id)

        return (
          <div key={bid.id.toString()} className="flex items-center flex-1 py-3 overflow-hidden">
            <SimpleAddress
              avatarSize={24}
              address={bid.sender}
              className="text-px18 leading-px28 font-700 gap-2"
            />
            {bid.state === BuyoutState.INACTIVE && (
              <div className="rounded-px6 flex-shrink-0 bg-secondary-red text-white font-700 text-px12 leading-px20 px-2 mx-4">
                Rejected
              </div>
            )}
            {bid.state === BuyoutState.LIVE && (
              <div className="rounded-px6 flex-shrink-0 bg-secondary-orange text-white font-700 text-px12 leading-px20 px-2 mx-4">
                In progress
              </div>
            )}
            {bid.state === BuyoutState.SUCCESS && (
              <div className="rounded-px6 flex-shrink-0 bg-secondary-green text-white font-700 text-px12 leading-px20 px-2 mx-4">
                Accepted
              </div>
            )}
            <IconEth className="flex-shrink-0 h-[12px] ml-auto" />
            <p className="ml-1 text-px18 leading-px28 font-700">{ethValue}</p>
            <a href={explorerLink} target="_blank" rel="noreferrer">
              <IconLinkOffsite className="ml-3 flex-shrink-0 h-[12px]" />
            </a>
          </div>
        )
      })
  }, [pastOffers])

  return (
    <div className="buyout-past-offers">
      <div className="space-y-4 pt-4">
        <p className="font-500 text-px18 leading-px22 text-gray-4">Past offers</p>
        <div className="flex flex-col divide-y divide-black/10">{pastOffersList}</div>
        <p className="text-center text-gray-4 text-px16 leading-px24 font-500 cursor-pointer pb-2">
          View all past offers
        </p>
      </div>
    </div>
  )
}
