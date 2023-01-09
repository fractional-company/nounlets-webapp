import useExistingVaults from 'src/hooks/useExistingVaults'
import NounletsOnAuctionCard from './Cards/NounletsOnAuctionCard'

export default function HomeNounletsOnAuction() {
  const { data } = useExistingVaults()

  if (data == null)
    return (
      <Wrapper>
        <NounletsOnAuctionCard.Skeleton />
      </Wrapper>
    )

  const list = data?.buckets.auctionInProgress || []
  if (list.length === 0) return null

  return (
    <Wrapper>
      {list.map((vault, index) => (
        <NounletsOnAuctionCard key={vault.id || index} vault={vault} />
      ))}
    </Wrapper>
  )
}

function Wrapper(props: { children: React.ReactNode }) {
  return (
    <div className="space-y-12 bg-black px-6 py-12">
      <h2 className="text-center font-londrina text-[48px] font-900 leading-[52px] text-gray-0.5 lg:text-[56px] lg:leading-[62px]">
        Nounlets ON AUCTION now!
      </h2>
      <div className="grid grid-cols-1 items-center justify-center justify-items-center gap-12">
        {props.children}
      </div>
    </div>
  )
}
