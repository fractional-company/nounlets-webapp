import classNames from 'classnames'
import Image from 'next/image'
import nounImage from 'public/img/noun.png'

export default function HomeCollectiveOwnership(): JSX.Element {
  return (
    <div className="home-collective-ownership">
      <div className="lg:container mx-auto">
        <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16">
          <div className="md:grid md:grid-cols-2 items-end">
            <h1
              className={classNames(
                'text-center self-center font-londrina font-900 text-[48px] leading-[56px]',
                'sm:text-[72px] sm:leading-[78px]',
                'md:text-left lg:text-[96px] lg:leading-[116px]'
              )}
            >
              COLLECTIVE OWNERSHIP OF NOUN 356
            </h1>

            <div className="w-full aspect-square max-w-[512px] mx-auto">
              <Image src={nounImage} layout="responsive" alt="nounlet 1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
