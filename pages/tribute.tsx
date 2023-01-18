import { NextPage } from 'next'
import { sleep } from 'radash'
import { useCallback, useMemo, useState } from 'react'
import Button from 'src/components/common/buttons/Button'
import TributedNounCard from 'src/components/tribute/TributedNounCard'
import TributeYourWallet from 'src/components/tribute/TributeYourWallet'
import WTFAreNounlets from 'src/components/WTFAreNounlets'
import useTributedNounsList from 'src/hooks/tribute/useTributedNounsList'

const Tribute: NextPage = () => {
  return (
    <div className="page-tribute space-y-8 bg-white lg:space-y-16">
      <div className="bg-gray-1 px-4 pt-4 pb-12">
        <h1 className="text-center font-londrina text-[56px] font-700 uppercase leading-[62px]">
          Want to Tribute your Noun?
        </h1>
      </div>

      <div className="space-y-12 px-4 md:px-12 lg:container lg:mx-auto  lg:space-y-16 lg:px-4">
        <TributeYourWallet />

        <div className="space-y-12">
          <h1 className="text-center font-londrina text-[48px] leading-[58px] lg:text-[64px] lg:leading-[76px]">
            This is how it goes down
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-20">
            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28 lg:text-[36px] lg:leading-[42px]">
                <span className="text-primary">1.</span> Tribute your Noun to add it to the
                waitlist.
              </h2>
              <p className="font-500 leading-px22 text-gray-4 lg:text-px18 lg:leading-px28">
                Connect your wallet and sign the transaction to volunteer your Noun for tribute.
                Please note you are approving the Tessera smart contracts to vault your Noun for a
                Nounlets auction at any time.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28 lg:text-[36px] lg:leading-[42px]">
                <span className="text-primary">2.</span> Your Noun will be featured on the tribute
                list.
              </h2>
              <p className="font-500 leading-px22 text-gray-4 lg:text-px18 lg:leading-px28">
                The Tessera team will work with community members to vote on which Noun should be
                auctioned next. There is no guarantee your Nouns is auctioned and there is no set
                schedule for Noun auctions.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28 lg:text-[36px] lg:leading-[42px]">
                <span className="text-primary">3.</span> Voila, your Noun will be put on auction -
                Nounlets style.
              </h2>
              <p className="font-500 leading-px22 text-gray-4 lg:text-px18 lg:leading-px28">
                If your Noun is selected, Tessera will initiate a transaction and kickoff the
                Nounlets auction. ETH proceeds from the auction will be automatically sent to your
                wallet (minus a 2% fee).
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12" id="tributed-list">
          <h1 className="text-center font-londrina text-[48px] leading-[58px] lg:text-[64px] lg:leading-[76px]">
            Tributed Nouns
          </h1>

          <p className="text-center font-500 text-gray-4 lg:text-px18 lg:leading-px28">
            Noun owners who wanted to participate in Nounlets can “tribute” their Noun to be
            auctioned. Tributed Nouns will display below. The Tessera team will work with the
            community to decide which Noun comes next and when the Nounlets auction will start. If
            you change your mind, you can withdraw your tributed Noun as long as the Noun has not
            been vaulted.
          </p>

          <div>
            <TributedNounsList />
          </div>
        </div>

        <div className="space-y-12 pb-20">
          <h1 className="text-center font-londrina text-[48px] leading-[58px] lg:text-[64px] lg:leading-[76px]">
            FAQs
          </h1>
          <WTFAreNounlets showFAQOnly />
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
  const PAGE_SIZE = 9

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
