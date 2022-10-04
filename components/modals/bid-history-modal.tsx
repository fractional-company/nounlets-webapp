import { Dialog } from '@headlessui/react'
import { Goerli, Mainnet, Rinkeby } from '@usedapp/core'
import { NounletImage } from 'components/NounletImage'
import { CHAIN_ID, NEXT_PUBLIC_BID_DECIMALS, NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import dayjs from 'dayjs'
import { FixedNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import useCurrentBackground from 'hooks/useCurrentBackground'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import { useMemo } from 'react'
import IconEth from '../icons/icon-eth'
import IconLinkOffsite from '../icons/icon-link-offsite'
import SimpleAddress from '../simple-address'

const BidHistoryModal = (): JSX.Element => {
  const { nid, historicBids } = useDisplayedNounlet(true)

  const bidHistory = useMemo(
    () =>
      historicBids.map((bid, index) => {
        const ethValue = FixedNumber.from(formatEther(bid.amount.toString()))
          .round(NEXT_PUBLIC_BID_DECIMALS)
          .toString()

        let formattedTimestamp = 'Recently'
        if (bid.blockTimestamp) {
          formattedTimestamp = dayjs.unix(+bid.blockTimestamp).format('MMM D, YYYY, h:mmA')
        }
        const explorerLink =
          CHAIN_ID === 1
            ? Mainnet.getExplorerTransactionLink(bid.id)
            : Goerli.getExplorerTransactionLink(bid.id)

        return (
          <div
            key={bid.id.toString()}
            className={`flex items-center rounded-px10 justify-between p-3 bg-white ${
              index === 0 ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div className="flex min-w-0">
              <SimpleAddress
                avatarSize={40}
                address={bid.bidder?.id || '0x0'}
                avatarClassName="hidden xs:block"
                className="text-px18 leading-px24 font-700 gap-3 flex-1"
                subtitle={
                  <div className="text-px14 leading-px20 font-500 text-gray-4 truncate">
                    {formattedTimestamp}
                  </div>
                }
              />
            </div>
            <div className="flex items-center">
              <IconEth className="flex-shrink-0 h-[12px]" />
              <p className="ml-1 text-px18 leading-px28 font-700">{ethValue}</p>
              <a href={explorerLink} target="_blank" rel="noreferrer">
                <IconLinkOffsite className="ml-3 flex-shrink-0 h-[12px]" />
              </a>
            </div>
          </div>
        )
      }),
    [historicBids]
  )

  return (
    <div className="overflow-hidden">
      <Dialog.Title className="text-px24 font-500">
        <div className="flex items-start space-x-4">
          <div className="w-[84px] flex-shrink-0 rounded-[15px] overflow-hidden">
            <NounletImage id={nid} />
          </div>
          <div className="flex flex-col font-londrina">
            <h4 className="text-px24 text-gray-4">Bids for</h4>
            <h2 className="text-px42 font-900 leading-px42">
              Nounlet {nid}/{NEXT_PUBLIC_MAX_NOUNLETS}
            </h2>
          </div>
        </div>
      </Dialog.Title>
      <div className="mt-8 py-4 px-4 bg-gray-2 rounded-px10 h-[17.25rem]">
        <div className="flex flex-col overflow-auto gap-2 h-full">{bidHistory}</div>
      </div>
    </div>
  )
}

export default BidHistoryModal
