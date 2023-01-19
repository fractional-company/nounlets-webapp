import Link from 'next/link'
import { useRouter } from 'next/router'
import useExistingVaults from 'src/hooks/useExistingVaults'
import useSdk from 'src/hooks/utils/useSdk'
import { getCurrentChainExplorerAddressLink } from 'src/lib/utils/common'
import scrollToElement from 'src/lib/utils/scrollToElement'
import IconNounletsLogo from './icons/IconNounletsLogo'

export default function AppFooter(): JSX.Element {
  const router = useRouter()
  const sdk = useSdk()
  const { data } = useExistingVaults()

  const hasAuctionsInProgress = (data?.buckets.auctionInProgress.length || 0) > 0

  function scrollOrNavigate(id: string) {
    if (router.pathname === '/') {
      scrollToElement(id)
    } else {
      router.push('/#' + id)
    }
  }

  return (
    <div className="bg-gray-1 py-12 lg:py-24">
      <div className="space-y-16 px-4 md:px-12 lg:container lg:mx-auto lg:px-4">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div>
            <Link href="/">
              <a className="relative mb-4 overflow-visible pt-2">
                <IconNounletsLogo className="h-[108px] w-[108px] flex-shrink-0" />
              </a>
            </Link>
          </div>
          <div className="space-y-8">
            <div className="flex flex-col gap-6 lg:flex-row">
              {hasAuctionsInProgress && (
                <h2
                  className="cursor-pointer font-londrina text-px32 leading-px36 transition-colors hover:text-primary"
                  onClick={() => scrollOrNavigate('nounlets-on-auction')}
                >
                  Current Auctions
                </h2>
              )}
              <h2
                className="cursor-pointer font-londrina text-px32 leading-px36 transition-colors hover:text-primary"
                onClick={() => scrollOrNavigate('past-nounlet-auctions')}
              >
                Past Auctions
              </h2>
              <Link href="/tribute">
                <h2 className="cursor-pointer font-londrina text-px32 leading-px36 transition-colors hover:text-primary">
                  Tributed Nouns
                </h2>
              </Link>
              <h2
                className="cursor-pointer font-londrina text-px32 leading-px36 transition-colors hover:text-primary"
                onClick={() => scrollOrNavigate('faq')}
              >
                FAQ
              </h2>
            </div>
            <div className="grid grid-cols-2 items-center justify-items-center gap-4 font-500 leading-px20 text-gray-4 sm:grid-cols-4 lg:flex lg:justify-end">
              <a
                href="https://discord.com/invite/8a34wmRjWB"
                target="_blank"
                className="transition-colors hover:text-primary"
                rel="noreferrer"
              >
                Discord
              </a>
              <a
                href="https://twitter.com/tessera"
                target="_blank"
                className="transition-colors hover:text-primary"
                rel="noreferrer"
              >
                Twitter
              </a>
              {sdk && (
                <a
                  href={getCurrentChainExplorerAddressLink(sdk?.NounletProtoform.address)}
                  target="_blank"
                  className="transition-colors hover:text-primary"
                  rel="noreferrer"
                >
                  Etherscan
                </a>
              )}
              <a
                href="https://tessera.co/"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                tessera.co
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
