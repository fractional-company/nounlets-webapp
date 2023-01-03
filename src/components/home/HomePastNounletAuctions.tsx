import useExistingVaults from 'src/hooks/useExistingVaults'
import NounletsPastAuctionCard from './Cards/NounletsPastAuctionCard'

export default function HomePastNounletAuctions() {
  const { data } = useExistingVaults()

  if (data == null) return null

  const buyouts = [
    ...data.buckets.buyoutInProgress,
    ...data.buckets.finished,
    ...data.buckets.buyoutIdle
  ]
  if (buyouts.length === 0) return null

  return (
    <div className="px-6 py-12">
      <h2 className="text-center font-londrina text-[48px] font-900 leading-[52px]">
        Past Nounlet auctions
      </h2>
      <div className="grid grid-cols-2 items-center justify-center justify-items-center gap-6">
        {buyouts.map((vault, index) => (
          <NounletsPastAuctionCard key={vault.id || index} vault={vault} />
        ))}
      </div>
    </div>
  )
}
