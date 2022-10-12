import classNames from 'classnames'
import IconCaret from 'components/icons/icon-caret'
import IconSpinner from 'components/icons/icon-spinner'
import IconTime from 'components/icons/icon-time'
import dayjs from 'dayjs'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import useSdk from 'hooks/useSdk'
import { getNounletVotes } from 'lib/graphql/queries'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import SimpleAddress from '../simple-address'

export default function HomeVotesFromNounlet(): JSX.Element {
  const sdk = useSdk()
  const { nid, nounletTokenAddress, auctionInfo, endedAuctionInfo } = useDisplayedNounlet()
  const [showAll, setShowAll] = useState(false)

  const voteShowLimit = 5
  const { data } = useSWR(
    sdk != null && nid != null && { name: 'NounletVotes', nounletId: nid },
    async () => {
      return await getNounletVotes(nounletTokenAddress, nid as string, sdk!.NounletAuction.address)
    },
    {
      dedupingInterval: 4000,
      refreshInterval(latestData) {
        if ((latestData?.nounlet.delegateVotes.length ?? 0) === 0) {
          return 10000
        }
        return 60000
      }
    }
  )

  const nounletVotes = useMemo(() => {
    if (data?.nounlet == null || data.nounlet.delegateVotes.length === 0)
      return (
        <div className="flex items-center justify-center">
          <IconSpinner className="animate-spin text-gray-4" />
        </div>
      )

    const votes = data.nounlet.delegateVotes.map((vote) => {
      const formattedTimestamp = dayjs.unix(+vote.timestamp).format('MMM D, YYYY, h:mmA')
      const address = vote.delegate.id.split('-')[1]

      return (
        <div className="votes-list-tile" key={vote.id}>
          <div className="border rounded-px16 p-4 border-gray-2 leading-px24">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:justify-between">
              <div className="flex items-start text-gray-4 space-x-3">
                <IconTime className="h-6 w-6 flex-shrink-0" />
                <p className="text-px18 font-500">Voted for delegate</p>
                <div className="text-px18 font-700 text-secondary-blue inline-flex">
                  <SimpleAddress address={address} />
                </div>
              </div>

              <p className="pl-8 text-px14 text-gray-3 text-right">{formattedTimestamp}</p>
            </div>
          </div>
        </div>
      )
    })

    if (showAll) return votes
    return votes.slice(0, voteShowLimit)
  }, [data, showAll])

  const votesCount = useMemo(() => data?.nounlet.delegateVotes.length || 0, [data])
  const hasHiddenVotes = useMemo(() => votesCount > voteShowLimit, [votesCount])

  return (
    <div className="home-votes-from-nounlet lg:container mx-auto">
      <div className="px-4 md:px-12 lg:px-4">
        <h3 className="text-px32 font-londrina">Votes from this Nounlet</h3>
        <div className="votes-list mt-8 space-y-2">{nounletVotes}</div>
        {hasHiddenVotes && (
          <div
            className="flex items-center justify-center space-x-2 text-gray-3 cursor-pointer mt-2"
            onClick={() => setShowAll(!showAll)}
          >
            <p className="text-center text-px20 leading-px24 font-700 py-3">
              {showAll ? 'Show fewer' : `Show all ${votesCount} votes`}
            </p>
            <IconCaret className={classNames('h-3', showAll ? '' : 'rotate-180')} />
          </div>
        )}
      </div>
    </div>
  )
}
