import IconTime from 'components/icons/icon-time'
import dayjs from 'dayjs'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import { getNounletVotes } from 'lib/graphql/queries'
import { getNounVotes } from 'lib/utils/getNounsVotes'
import { useMemo } from 'react'
import useSWR from 'swr'
import { useReverseENSLookUp } from '../../lib/utils/ensLookup'
import { buildEtherscanAddressLink } from '../../lib/utils/etherscan'
import SimpleAddress from '../simple-address'

function VotesListTile(address: string, timestamp: number): JSX.Element {
  return (
    <div className="votes-list-tile">
      <div className="border rounded-px16 p-4 border-gray-2 leading-px24">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:justify-between">
          <div className="flex items-start text-gray-4 ">
            <IconTime className="h-6 w-6 flex-shrink-0" />
            <div className="ml-2 text-px18 font-500">
              Voted for delegate{' '}
              <div className="text-px18 font-700 text-secondary-blue inline-flex">
                <SimpleAddress address={'0x537265e3fa15c839e445a483e8428e2dd627d00c'} />
              </div>
            </div>
          </div>

          <p className="pl-8 text-px14 text-gray-3 text-right">Jul 5, 2022, 6:54 AM</p>
        </div>
      </div>
    </div>
  )
}

export default function HomeVotesFromNounlet(): JSX.Element {
  const { nid, nounletTokenAddress } = useDisplayedNounlet()

  const { data } = useSWR(
    nid != null && { name: 'NounletVotes', nounletId: nid },
    async () => {
      return await getNounletVotes(nounletTokenAddress, nid as string)
    },
    {
      dedupingInterval: 15000
    }
  )

  const nounletVotes = useMemo(() => {
    if (data?.nounlet == null) return <p>Loading</p>

    if (data.nounlet.delegateVotes.length === 0)
      return (
        <p className="font-500 text-px20 leading-px28 text-gray-4">
          This nounlet has not yet voted for a Delegate
        </p>
      )

    return data.nounlet.delegateVotes.map((vote) => {
      const formattedTimestamp = dayjs.unix(+vote.timestamp).format('MMM D, YYYY, h:mmA')

      return (
        <div className="votes-list-tile" key={vote.id}>
          <div className="border rounded-px16 p-4 border-gray-2 leading-px24">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:justify-between">
              <div className="flex items-start text-gray-4 ">
                <IconTime className="h-6 w-6 flex-shrink-0" />
                <div className="ml-2 text-px18 font-500">
                  Voted for delegate{' '}
                  <div className="text-px18 font-700 text-secondary-blue inline-flex">
                    <SimpleAddress address={vote.delegate.id} />
                  </div>
                </div>
              </div>

              <p className="pl-8 text-px14 text-gray-3 text-right">{formattedTimestamp}</p>
            </div>
          </div>
        </div>
      )
    })
  }, [data])

  return (
    <div className="home-votes-from-nounlet lg:container mx-auto">
      <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16">
        <h3 className="text-px32 font-londrina">Votes from this Nounlet</h3>
        <div className="votes-list mt-8 space-y-2">{nounletVotes}</div>
      </div>
    </div>
  )
}
