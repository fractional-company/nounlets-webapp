import useExistingVaults from 'src/hooks/useExistingVaults'
import NounletsOnAuctionCard from './Cards/NounletsOnAuctionCard'

export default function HomeNounletsOnAuction() {
  const { data } = useExistingVaults()

  console.log('shhshshs', data)

  if (data == null)
    return (
      <div className="space-y-12 bg-black px-6 py-12">
        <h2 className="text-center font-londrina text-[48px] font-900 leading-[52px] text-gray-0.5">
          Nounlets ON AUCTION ?
        </h2>
        <div className="grid grid-cols-1 items-center justify-center justify-items-center gap-12">
          <NounletsOnAuctionCard.Skeleton />
        </div>
      </div>
    )

  const list = data?.buckets.auctionInProgress || []
  if (list.length === 0) return null

  return (
    <div className="space-y-12 bg-black px-6 py-12">
      <h2 className="text-center font-londrina text-[48px] font-900 leading-[52px] text-gray-0.5">
        Nounlets ON AUCTION now!
      </h2>
      <div className="grid grid-cols-1 items-center justify-center justify-items-center gap-12">
        {list.map((vault, index) => (
          <NounletsOnAuctionCard key={vault.id || index} vault={vault} />
        ))}
      </div>
    </div>
  )
}
