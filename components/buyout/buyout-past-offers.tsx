import IconEth from 'components/icons/icon-eth'
import IconLinkOffsite from 'components/icons/icon-link-offsite'
import SimpleAddress from 'components/simple-address'
import { formatEther } from 'ethers/lib/utils'
import useBuyoutNoun from 'hooks/useBuyoutNoun'
import { useMemo } from 'react'
import { ChainId, getExplorerTransactionLink } from '@usedapp/core'
import { CHAIN_ID } from '../../pages/_app'
import { FixedNumber } from 'ethers'

export default function BuyoutPastOffers(): JSX.Element {
  const { pastOffers } = useBuyoutNoun()

  const pastOffersList: JSX.Element[] = useMemo(() => {
    return pastOffers.slice(0, 3).map((bid) => {
      // const ethValue = new BigNumber(formatEther(bid.value)).toFixed(2)
      const ethValue = FixedNumber.from(formatEther(bid.value)).round(4).toString()
      return (
        <div key={bid.id.toString()} className="flex items-center flex-1 py-2 overflow-hidden">
          <SimpleAddress
            avatarSize={24}
            address={bid.sender}
            className="text-px18 leading-px28 font-700 gap-2"
          />
          <div className="rounded-px6 flex-shrink-0 bg-secondary-red text-white font-700 text-px12 leading-px20 px-2 mx-4">
            Rejected
          </div>
          <IconEth className="flex-shrink-0 h-[12px] ml-auto" />
          <p className="ml-1 text-px18 leading-px28 font-700">{ethValue}</p>
          <a
            href={getExplorerTransactionLink(bid.txHash, CHAIN_ID as ChainId)}
            target="_blank"
            rel="noreferrer"
          >
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
        <div className="flex flex-col divide-y divide-gray-2">{pastOffersList}</div>
        <p className="text-center text-gray-4 text-px16 leading-px24 font-500 cursor-pointer">
          View all past offers
        </p>
      </div>
    </div>
  )
}
