import { Dialog } from '@headlessui/react'
import { Mainnet, Rinkeby } from '@usedapp/core'
import { NounletImage } from 'components/NounletImage'
import { NEXT_PUBLIC_BID_DECIMALS } from 'config'
import { FixedNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import { useMemo } from 'react'
import { CHAIN_ID } from '../../pages/_app'
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
        //   const formttedTimestamp = dayjs.unix(+bid.blockTimestamp).format('MMM D, YYYY, h:mmA')
        const explorerLink =
          CHAIN_ID === 1
            ? Mainnet.getExplorerTransactionLink(bid.id)
            : Rinkeby.getExplorerTransactionLink(bid.id)
        return (
          <div
            key={bid.id.toString()}
            className={`items-center rounded-px10 justify-between p-3 flex bg-white ${
              index === 0 ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div className="flex flex-col">
              <SimpleAddress
                avatarSize={24}
                address={bid.bidder?.id || '0x0'}
                className="text-px18 leading-px28 font-700 gap-2 flex-1"
              />
              {/* <div className="text-px14 leading-px24">{formttedTimestamp}</div> */}
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
    <div className="sm:w-[400px]">
      <Dialog.Title className="p-4 pl-0 text-px24 font-500">
        <div className="flex items-center -mt-10 space-x-4">
          <div className="w-[84px]">
            <NounletImage id={nid} />
          </div>
          <div className="flex flex-col font-londrina">
            <h4 className="text-px24 text-gray-4">Bids for</h4>
            <h2 className="text-px42 font-900 leading-px42">Nounlet {nid}/100</h2>
          </div>
        </div>
      </Dialog.Title>
      <div className="py-4 pl-4 pr-2 bg-gray-2 rounded-px10 h-[17.25rem]">
        <div className="flex flex-col overflow-y-scroll gap-2 h-full custom-scrollbar pr-2">
          {bidHistory}
        </div>
      </div>
    </div>
  )
}

export default BidHistoryModal
