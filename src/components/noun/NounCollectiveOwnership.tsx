import classNames from 'classnames'
import { NounImage } from 'src/components/common/NounletImage'
import Image from 'next/image'
import nounImage from 'public/img/noun.png'
import { useNounStore } from 'src/store/noun.store'

export default function NounCollectiveOwnership(): JSX.Element {
  const { nounTokenId } = useNounStore()

  return (
    <div className="home-collective-ownership">
      <div className="lg:container mx-auto">
        <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16">
          <div className="grid md:grid-cols-2 gap-8 items-end">
            <h1
              className={classNames(
                'text-center self-center font-londrina font-900 text-[48px] leading-[56px]',
                'sm:text-[72px] sm:leading-[78px]',
                'md:text-left lg:text-[96px] lg:leading-[116px]'
              )}
            >
              COLLECTIVE OWNERSHIP OF NOUN {nounTokenId || '???'}
            </h1>

            <div className="w-full aspect-square max-w-[512px] mx-auto md:ml-auto md:mr-0">
              <NounImage id={nounTokenId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
