import IconEth from 'src/components/icons/icon-eth'
import SimpleAddress from 'src/components/simple-address'
import useNounBuyout from 'src/hooks/useNounBuyout'

export default function BuyoutOfferingDisplay(): JSX.Element {
  const { buyoutInfo } = useNounBuyout()

  return (
    <div className="buyout-offering-display">
      <div className="p-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-3">
            <p className="text-[15px] leading-[15px] font-500 text-gray-4">Nounlets offered</p>
            <p className="text-px24 leading-[38px] font-700">
              {buyoutInfo.formatted.fractionsOfferedCount}
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <p className="text-[15px] leading-[15px] font-500 text-gray-4">ETH offering</p>
            <div className="flex items-center space-x-3">
              <IconEth className="flex-shrink-0" />
              <p className="text-px24 leading-[38px] font-700">
                {buyoutInfo.formatted.initialEthBalance}
              </p>
            </div>
          </div>
          <div className="xs:col-span-2 flex flex-col space-y-3">
            <p className="text-[15px] leading-[15px] font-500 text-gray-4">Offered by</p>
            <div className="flex items-center space-x-3">
              <SimpleAddress
                address={buyoutInfo.proposer}
                avatarSize={24}
                className="space-x-2 font-700 text-px18 leading-px28"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
