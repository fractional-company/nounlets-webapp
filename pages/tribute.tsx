import { useEthers } from '@usedapp/core'
import { NextPage } from 'next'
import TributeYourWallet from 'src/components/tribute/TributeYourWallet'

const Tribute: NextPage = () => {
  const { account } = useEthers()

  return (
    <div className="page-tribute w-screen space-y-8 bg-white lg:space-y-16">
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
                <span className="text-primary">1.</span> Tribute your Noun to put it in the waiting
                list.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                Connect your wallet and unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28">
                <span className="text-primary">1.</span> Tribute your Noun to put it in the waiting
                list.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                Connect your wallet and unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28">
                <span className="text-primary">1.</span> Tribute your Noun to put it in the waiting
                list.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                Connect your wallet and unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <h1 className="text-center font-londrina text-[48px] leading-[58px]">Tributed Nouns</h1>

          <p className="font-500 text-gray-4">
            Explanation of this feature..... Nounlets are an experiment to allow for collective
            ownership over an individual Noun. Each Nounlet represents 1% of the vaulted Noun and
            has a vote in delegating the Noun`s governance rights. The selected delegate is the
            official representative to the NounsDAO on behalf of the underlying Noun.
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-20">
            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28">
                <span className="text-primary">1.</span> Tribute your Noun to put it in the waiting
                list.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                Connect your wallet and unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28">
                <span className="text-primary">1.</span> Tribute your Noun to put it in the waiting
                list.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                Connect your wallet and unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28">
                <span className="text-primary">1.</span> Tribute your Noun to put it in the waiting
                list.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                Connect your wallet and unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium.
              </p>
            </div>
          </div>
        </div>

        <div>{/* <NounImage id="2" /> */}</div>
      </div>
    </div>
  )
}

export default Tribute
