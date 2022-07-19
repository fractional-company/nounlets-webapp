import HomeAccordions from './home-accordions'

export default function HomeWTF(): JSX.Element {
  return (
    <div className="home-wtf">
      <div className="lg:container mx-auto">
        <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16 font-500 text-px22 leading-px28 text-gray-4">
          <h2 className="font-londrina text-[64px] leading-[78px] font-700 mb-12 text-black">
            WTF?
          </h2>
          <p className="mb-6">
            Nounlets are an experiment to allow for collective ownership over an individual{' '}
            <a href="" className="text-secondary-blue">
              Noun
            </a>
            . Each Nounlet represents 1% of the vaulted Noun and has a vote in delegating the Noun’s
            governance rights. The chosen delegate can join the official Nouns private discord
            channel, vote in governance and submit governance proposals.
          </p>
          <p>
            Learn more below, or by visiting and reviewing the{' '}
            <a href="" className="text-secondary-blue">
              Nouns DAO homepage.
            </a>
          </p>
        </div>

        <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16 font-500 text-px18 leading-px28 text-gray-4">
          <HomeAccordions />
        </div>
      </div>
    </div>
  )
}
