import useExistingVaults from 'src/hooks/useExistingVaults'
import NounletsPastAuctionCard from './Cards/NounletsPastAuctionCard'

export default function HomePastNounletAuctions() {
  const { data } = useExistingVaults()

  if (data == null)
    return (
      <div className="space-y-8">
        <h2 className="text-center font-londrina text-[48px] font-900 leading-[52px]">
          Past Nounlet auctions
        </h2>
        <div className="size-aware-skeleton-loaders grid grid-cols-1 items-start justify-center justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <NounletsPastAuctionCard.Skeleton />
          <NounletsPastAuctionCard.Skeleton />
          <NounletsPastAuctionCard.Skeleton />
          <NounletsPastAuctionCard.Skeleton />
        </div>
      </div>
    )

  const buyouts = [
    ...data.buckets.buyoutInProgress,
    ...data.buckets.finished,
    ...data.buckets.buyoutIdle
  ]

  if (buyouts.length === 0) return null

  const isBuyoutHappening = data.buckets.buyoutInProgress.length > 0

  return (
    <div className="space-y-8">
      <h2 className="text-center font-londrina text-[48px] font-900 leading-[52px]">
        Past Nounlet auctions
      </h2>
      <div className="grid items-start justify-center justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isBuyoutHappening && (
          <div className="flex max-w-[300px] flex-col gap-6">
            <h1 className="font-londrina text-px42 leading-px48">
              <span className="text-secondary-red">Live buyout</span> is happening!
            </h1>
            <p className="text-px16 font-500 leading-px24 text-gray-4">
              Someone submitted an offer to buyout a Noun. Anyone can reject the offer by purchasing
              the Nounlets in their proposal. If any Nounlets remain after 7 days the offer will be
              automatically accepted. Read More
            </p>
          </div>
        )}
        {buyouts.map((vault, index) => (
          <NounletsPastAuctionCard key={vault.id || index} vault={vault} />
        ))}
      </div>
    </div>
  )
}
