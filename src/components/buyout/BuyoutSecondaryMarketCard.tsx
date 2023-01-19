import Button from 'src/components/common/buttons/Button'
import useNounBuyout from 'src/hooks/useNounBuyout'
import { useNounStore } from 'src/store/noun.store'

export default function BuyoutSecondaryMarketCard(): JSX.Element {
  const { nounTokenId, myNounlets } = useNounBuyout()
  const { nounletTokenAddress } = useNounStore()

  const marketLink = `https://nounlets.market/collections/${nounletTokenAddress}`

  return (
    <div className="buyout-secondary-market-card">
      {myNounlets.length > 0 ? (
        <div className="flex flex-col gap-4 rounded-px16 bg-gray-2 py-4 px-6 text-black">
          <p className="text-px14 font-700 leading-px18">
            All auctions for Nounlets of Noun {nounTokenId} have finished. You can buy a Nounlet on
            the{' '}
            <a className="text-secondary-blue" href={marketLink} target="__blank">
              secondary market
            </a>{' '}
            or you can bid for the full Noun below.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-px16 bg-black py-4 px-6 text-white">
          <p className="text-px14 font-700 leading-px18">
            All auctions for Nounlets of Noun {nounTokenId} have finished. You can buy a Nounlet on
            the{' '}
            <a className="text-secondary-blue" href={marketLink} target="__blank">
              secondary market
            </a>
            .
          </p>
          <a className="text-secondary-blue" href={marketLink} target="__blank">
            <Button className="primary w-full">Buy a Nounlet</Button>
          </a>
        </div>
      )}
    </div>
  )
}
