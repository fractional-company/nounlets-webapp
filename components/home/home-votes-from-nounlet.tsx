import IconTime from 'components/icons/icon-time'

function VotesListTile(): JSX.Element {
  return (
    <div className="votes-list-tile">
      <div className="border rounded-px16 p-4 border-gray-2 leading-px24">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:justify-between">
          <div className="flex items-start text-gray-4 ">
            <IconTime className="h-6 w-6 flex-shrink-0" />
            <p className="ml-2 text-px18 font-500">
              Voted for delegate{' '}
              <span className="text-px18 font-700 text-secondary-blue">hot.gabrielayuso.eth</span>
            </p>
          </div>

          <p className="pl-8 text-px14 text-gray-3 text-right">Jul 5, 2022, 6:54 AM</p>
        </div>
      </div>
    </div>
  )
}

export default function HomeVotesFromNounlet(): JSX.Element {
  return (
    <div className="home-votes-from-nounlet lg:container mx-auto">
      <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16">
        <h3 className="text-px32 font-londrina">Votes from this Nounlet</h3>

        <div className="votes-list mt-8 space-y-2">
          <VotesListTile />
          <VotesListTile />
          <VotesListTile />
        </div>
      </div>
    </div>
  )
}
