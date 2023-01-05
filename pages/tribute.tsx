import { NextPage } from 'next'
import { sleep } from 'radash'
import { useCallback, useMemo, useState } from 'react'
import Button from 'src/components/common/buttons/Button'
import TributedNounCard from 'src/components/tribute/TributedNounCard'
import TributeFAQ from 'src/components/tribute/TributeFAQ'
import TributeYourWallet from 'src/components/tribute/TributeYourWallet'
import useTributedNounsList from 'src/hooks/tribute/useTributedNounsList'

const Tribute: NextPage = () => {
  return (
    <div className="page-tribute space-y-8 bg-white lg:space-y-16">
      <div className="bg-gray-1 px-4 pt-4 pb-12">
        <h1 className="text-center font-londrina text-[56px] font-700 uppercase leading-[62px]">
          Want to Tribute your Noun?
        </h1>
      </div>

      <div className="space-y-12 px-4 lg:container lg:mx-auto">
        <TributeYourWallet />

        <div className="space-y-12">
          <h1 className="text-center font-londrina text-[48px] leading-[58px]">
            This is how it goes down
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-20">
            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28">
                <span className="text-primary">1.</span> Sign a transaction to tribute your Noun and
                add it to the waitlist.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                Connect your wallet and approve the transaction for the Tessera smart contracts to
                transfer your Noun to be auctioned.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28">
                <span className="text-primary">2.</span> Tessera will work with the Nouns community
                to decide which Noun is next.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                The Tessera team will work with community members to vote on which Noun should be
                auctioned next. There is no set schedule for Noun auctions.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28">
                <span className="text-primary">3.</span> Voila, your Noun will be put on auction -
                Nounlets style.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                Once the next Noun is voted on, Tessera will initiate the transaction and kick off
                the auction. ETH proceeds from the auction will be automatically distributed back to
                the original Noun owner.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12" id="tributed-list">
          <h1 className="text-center font-londrina text-[48px] leading-[58px]">Tributed Nouns</h1>

          <p className="text-center font-500 text-gray-4">
            Explanation of this feature..... Nounlets are an experiment to allow for collective
            ownership over an individual Noun. Each Nounlet represents 1% of the vaulted Noun and
            has a vote in delegating the Noun`s governance rights. The selected delegate is the
            official representative to the NounsDAO on behalf of the underlying Noun.
          </p>

          <div>
            <TributedNounsList />
          </div>
        </div>

        <div className="pb-20">
          <TributeFAQ />
        </div>
      </div>
    </div>
  )
}

export default Tribute

function TributedNounsList() {
  const { data: tributedNounsListFull } = useTributedNounsList()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 3

  const tributedNounsListPaginated = useMemo(() => {
    return tributedNounsListFull?.slice(0, PAGE_SIZE * page) || null
  }, [tributedNounsListFull, page])

  const hasMore =
    tributedNounsListFull != null &&
    tributedNounsListPaginated != null &&
    tributedNounsListPaginated.length < tributedNounsListFull.length

  const handleShowMore = useCallback(async () => {
    setIsLoading(true)
    await sleep(1000)
    setPage((value) => value + 1)
    setIsLoading(false)
  }, [])

  return (
    <div className="flex flex-col items-center space-y-8 overflow-hidden rounded-[20px] bg-white p-6">
      {!tributedNounsListPaginated && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <div className="w-[300px]">
            <TributedNounCard.Skeleton />
          </div>
        </div>
      )}

      {tributedNounsListPaginated && tributedNounsListPaginated.length === 0 && (
        <h1 className="text-center font-londrina text-px22 font-900">
          No one has tributed a Noun yet :(
        </h1>
      )}

      {tributedNounsListPaginated && (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {tributedNounsListPaginated.map((nounData) => (
              <div key={nounData.id} className="w-[300px]">
                <TributedNounCard noun={nounData} />
              </div>
            ))}
          </div>
          {hasMore && (
            <Button
              className="default-outline text-black"
              loading={isLoading}
              onClick={handleShowMore}
            >
              Show more
            </Button>
          )}
        </>
      )}
    </div>
  )
}
