import { useCallback, useMemo, useState } from 'react'

import { sleep } from 'radash'
import useTributedNounsList from 'src/hooks/tribute/useTributedNounsList'
import Button from '../common/buttons/Button'
import classNames from 'classnames'
import { NounImage } from '../common/NounletImage'

export default function NextNounlets() {
  const { data: tributedNounsListFull } = useTributedNounsList()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 2

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

  const gridStyles = 'grid grid-cols-2 gap-3 md:gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

  return (
    <div className="space-y-8">
      <h2 className="text-center font-londrina text-[48px] font-900 leading-[52px]">
        Upcomming (maybe?) Nounlets
      </h2>

      {!tributedNounsListPaginated && (
        <div className={gridStyles + ' size-aware-skeleton-loaders-next-nounlets'}>
          <SmallTributedCard.Skeleton />
          <SmallTributedCard.Skeleton />
          <SmallTributedCard.Skeleton />
          <SmallTributedCard.Skeleton />
          <SmallTributedCard.Skeleton />
        </div>
      )}

      {tributedNounsListPaginated && tributedNounsListPaginated.length === 0 && (
        <h1 className="text-center font-londrina text-px22 font-900">
          No one has tributed a Noun yet :(
        </h1>
      )}

      {tributedNounsListPaginated && (
        <>
          <div className={gridStyles}>
            <div className="col-span-2 space-y-6 p-4">
              <h1 className="font-londrina text-px32 leading-px36">Tributed Nouns for Nounlets</h1>
              <p className="text-px16 font-500 leading-px24 text-gray-4">
                Anyone can Tribute their Noun to take part in the the Nounlets experiment.
                <br />
                <br />
                Read More
              </p>
            </div>

            {tributedNounsListPaginated.map((nounData) => (
              <div key={nounData.id} className="w-auto">
                <SmallTributedCard noun={nounData} />
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center">
              <Button
                className="default-outline text-black"
                loading={isLoading}
                onClick={handleShowMore}
              >
                Show more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SmallTributedCard(props: {
  noun: {
    id: string
  }
}) {
  return (
    <div className="overflow-hidden rounded-[24px] bg-gray-1 p-4">
      <div className="flex flex-col space-y-4">
        <div className="aspect-square overflow-hidden rounded-[16px] bg-white">
          <NounImage id={props.noun.id} />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-londrina text-px24 leading-px26">NOUN {props.noun.id}</h1>
        </div>
      </div>
    </div>
  )
}

SmallTributedCard.Skeleton = function SmallTributedCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] bg-gray-1 p-4">
      <div className="flex flex-col space-y-4">
        <div className="aspect-square overflow-hidden rounded-[16px] bg-white">
          <NounImage />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-londrina text-px24 leading-px26">NOUN ???</h1>
        </div>
      </div>
    </div>
  )
}
