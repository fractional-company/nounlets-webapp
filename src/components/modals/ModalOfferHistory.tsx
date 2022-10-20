import { Dialog } from '@headlessui/react'
import { Goerli, Mainnet } from '@usedapp/core'
import IconEth from 'src/components/common/icons/IconEth'
import IconLinkOffsite from 'src/components/common/icons/IconLinkOffsite'
import { NounImage } from 'src/components/common/NounletImage'
import SimpleAddress from 'src/components/common/simple/SimpleAddress'
import { CHAIN_ID, NEXT_PUBLIC_BID_DECIMALS } from 'config'
import { FixedNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import useNounBuyout from 'src/hooks/useNounBuyout'
import { getCurrentChainExplorerTransactionLink } from 'src/lib/utils/common'
import { useMemo } from 'react'
import { BuyoutState } from 'src/store/buyout/buyout.store'

export default function ModalOfferHistory() {
  const { pastOffers, nounTokenId } = useNounBuyout()

  const pastOffersList: JSX.Element[] = useMemo(() => {
    return pastOffers
      .filter((offer) => offer.state !== BuyoutState.LIVE)
      .map((bid, index) => {
        const ethValue = FixedNumber.from(formatEther(bid.value.toString()))
          .round(NEXT_PUBLIC_BID_DECIMALS)
          .toString()

        return (
          <div
            key={bid.id.toString()}
            className={`flex items-center rounded-px10 justify-between p-3 bg-white ${
              index === 0 ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div className="flex min-w-0 items-start">
              <SimpleAddress
                avatarSize={40}
                address={bid.sender}
                avatarClassName="hidden xs:block"
                className="text-px18 leading-px24 font-700 gap-3 flex-1"
                subtitle={
                  // <div className="text-px14 leading-px20 font-500 text-gray-4 truncate">test</div>
                  <div className="flex items-start">
                    {bid.state === BuyoutState.INACTIVE && (
                      <div className="rounded-px6 flex-shrink-0 bg-secondary-red text-white font-700 text-px12 leading-px20 px-2">
                        Rejected
                      </div>
                    )}
                    {bid.state === BuyoutState.LIVE && (
                      <div className="rounded-px6 flex-shrink-0 bg-secondary-orange text-white font-700 text-px12 leading-px20 px-2">
                        In progress
                      </div>
                    )}
                    {bid.state === BuyoutState.SUCCESS && (
                      <div className="rounded-px6 flex-shrink-0 bg-secondary-green text-white font-700 text-px12 leading-px20 px-2">
                        Accepted
                      </div>
                    )}
                  </div>
                }
              />
            </div>
            <div className="flex items-center">
              <IconEth className="flex-shrink-0 h-[12px]" />
              <p className="ml-1 text-px18 leading-px28 font-700">{ethValue}</p>
              <a
                href={getCurrentChainExplorerTransactionLink(bid.id)}
                target="_blank"
                rel="noreferrer"
              >
                <IconLinkOffsite className="ml-3 flex-shrink-0 h-[12px]" />
              </a>
            </div>
          </div>
        )
      })
  }, [pastOffers])

  return (
    <div className="overflow-hidden">
      <Dialog.Title className="text-px24 font-500">
        <div className="flex items-start space-x-4">
          <div className="w-[84px] flex-shrink-0 rounded-[15px] overflow-hidden">
            <NounImage />
          </div>
          <div className="flex flex-col font-londrina">
            <h4 className="text-px24 text-gray-4">Offers for</h4>
            <h2 className="text-px42 font-900 leading-px42">Noun {nounTokenId}</h2>
          </div>
        </div>
      </Dialog.Title>
      <div className="mt-8 py-4 px-4 bg-gray-2 rounded-px10 h-[17.25rem]">
        <div className="flex flex-col overflow-auto gap-2 h-full">{pastOffersList}</div>
      </div>
    </div>
  )
}
