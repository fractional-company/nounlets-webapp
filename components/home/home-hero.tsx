import Image from 'next/image'
import nounImage from 'public/img/noun.png'
import Button from 'components/buttons/button'
import IconArrow from 'components/icons/icon-arrow'
import IconEth from 'components/icons/icon-eth'
import HomeHeroAuctionProgress from './home-hero-auction-progress'
import {useRouter} from "next/router";

export default function HomeHero(): JSX.Element {
  const navigateToNoun = () => {
  }
  return (
    <div className="home-hero bg-gray-1">
      <div className="lg:container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-2">
          <div className="flex flex-col justify-end lg:pr-4">
            <div className="w-full aspect-square max-w-[512px] mx-auto">
              <Image src={nounImage} layout="responsive" alt="nounlet 1" />
            </div>
          </div>

          <div className="px-4 py-12 md:p-12 lg:pl-6 lg:pr-10 -mx-4 lg:-mx-0 bg-white lg:bg-transparent space-y-3">
            <div className="navigation flex items-center space-x-1">
              <Button className="flex items-center justify-center rounded-full w-10 h-10 cursor-pointer bg-gray-2 lg:bg-white hover:bg-gray-2">
                <IconArrow />
              </Button>

              <Button className="flex items-center justify-center rounded-full w-10 h-10 cursor-pointer bg-gray-2 lg:bg-white hover:bg-gray-2">
                <IconArrow className="rotate-180" />
              </Button>

              <p className="text-px18 font-700 pl-2">
                32<span className="text-gray-4">/100</span>
              </p>
            </div>

            <h1 className="font-londrina text-px64 leading-[82px]">Nounlet 32</h1>

            <HomeHeroAuctionProgress />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="home-hero lg:grid lg:grid-cols-2 bg-gray-1">
      <div className="left flex flex-col justify-end px-4 container mx-auto xl:max-w-7xl pt-6">
        <div className="w-full aspect-square max-w-[512px] mx-auto">
          <Image src={nounImage} layout="responsive" alt="nounlet 1" />
        </div>
      </div>
      <div className="right p-4 md:p-12 bg-white lg:bg-transparent space-y-3 lg:max-w-[512px]">
        <div className="navigation flex items-center space-x-1">
          <Button className="flex items-center justify-center rounded-full w-10 h-10 cursor-pointer bg-gray-2 lg:bg-white hover:bg-gray-2">
            <IconArrow />
          </Button>

          <Button className="flex items-center justify-center rounded-full w-10 h-10 cursor-pointer bg-gray-2 lg:bg-white hover:bg-gray-2">
            <IconArrow className="rotate-180" />
          </Button>

          <p className="text-px18 font-700 pl-2">
            32<span className="text-gray-4">/100</span>
          </p>
        </div>

        <h1 className="font-londrina text-px64 leading-[82px]">Nounlet 32</h1>

        <HomeHeroAuctionProgress />
      </div>
    </div>
  )
}
