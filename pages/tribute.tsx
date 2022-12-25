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

      <div className="px-4 lg:container lg:mx-auto">
        <TributeYourWallet />
        <div>tributed nouns</div>

        <div>{/* <NounImage id="2" /> */}</div>
      </div>
    </div>
  )
}

export default Tribute
