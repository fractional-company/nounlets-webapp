import { NextPage } from 'next'

const Governance: NextPage = () => {
  return (
    <div className="page-governance lg:container mx-auto">
      <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16">
        <h4 className="font-londrina text-px24 leading-px36 text-gray-4">Governance</h4>
        <h1 className="font-londrina text-[56px] leading-[68px] mt-3">Vote for a delegate</h1>
        <p className="font-500 text-px20 leading-px28 text-gray-4 mt-6">
          All Nounlet owners will be able to vote on a delegate. The delegate will be elected
          on-chain in the Nouns contract. The active delegate will be able to join the official
          nouns-private discord channel, vote in governance and submit governance proposals. Each
          Nounlet has 1 vote on the delegate.
        </p>

        <div className="mt-10 border rounded-px16 p-4 border-gray-2">
          <div className="flex items-center">
            <p className="font-londrina text-px24 leading-px36 text-gray-4">Current delegate</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Governance
