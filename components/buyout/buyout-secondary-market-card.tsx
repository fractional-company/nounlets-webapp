import Button from 'components/buttons/button'
import useNounBuyout from 'hooks/useNounBuyout'

export default function BuyoutSecondaryMarketCard(): JSX.Element {
  const { nounTokenId, myNounlets } = useNounBuyout()

  return (
    <div className="buyout-secondary-market-card">
      {myNounlets.length > 0 ? (
        <div className="bg-gray-2 rounded-px16 py-4 px-6 flex flex-col gap-4 text-black">
          <p className="text-px12 leading-px18 font-700">
            All auctions for Nounlets of Noun {nounTokenId} have finished. You can buy a Nounlet on
            the{' '}
            <a className="text-secondary-blue" href="https://opensea.io/" target="__blank">
              secondary market
            </a>{' '}
            or you can bid for the full Noun below.
          </p>
        </div>
      ) : (
        <div className="bg-black rounded-px16 py-4 px-6 flex flex-col gap-4 text-white">
          <p className="text-px12 leading-px18 font-700">
            All auctions for Nounlets of Noun {nounTokenId} have finished. You can buy a Nounlet on
            the{' '}
            <a className="text-secondary-blue" href="https://opensea.io/" target="__blank">
              secondary market
            </a>
            .
          </p>
          <a className="text-secondary-blue" href="https://opensea.io/" target="__blank">
            <Button className="primary w-full">Buy a Nounlet</Button>
          </a>
        </div>
      )}
    </div>
  )
}
