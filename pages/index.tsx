import type { NextPage } from 'next'

import NextNounlets from 'src/components/home/HomeNextNounlets'
import HomeNounletsOnAuction from 'src/components/home/HomeNounletsOnAuction'
import HomePastNounletAuctions from 'src/components/home/HomePastNounletAuctions'
import WTFAreNounlets from 'src/components/WTFAreNounlets'

const Home: NextPage<{ url: string }> = () => {
  return (
    <div className="page-home">
      <div className="space-y-4 px-6 pt-4 pb-12 text-center lg:pb-20 lg:pt-10">
        <h1 className="font-londrina text-[64px] font-900 leading-[70px] lg:text-[96px] lg:leading-[106px]">
          OWN A NOUN, TOGETHER
        </h1>
        <p className="font-londrina text-[34px] font-900 leading-[40px] text-[#202A46] lg:text-[42px] lg:leading-[52px]">
          1 Noun. 100 Nounlets. Until they´re gone.
        </p>
      </div>

      <HomeNounletsOnAuction />

      <div className="bg-white pb-[64px] pt-[48px] lg:pb-[120px] lg:pt-[80px]">
        <div className="space-y-16 px-4 lg:container lg:mx-auto">
          <HomePastNounletAuctions />

          <NextNounlets />

          <WTFAreNounlets showCurrentAuction={false} />
        </div>
      </div>
    </div>
  )
}

export default Home
