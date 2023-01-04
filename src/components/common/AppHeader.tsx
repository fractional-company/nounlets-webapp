import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ModalVoteForDelegate from 'src/components/modals/ModalVoteForDelegate'
import useCurrentBackground from 'src/hooks/utils/useCurrentBackground'
import { useNounStore } from 'src/store/noun.store'
import { useAppStore } from '../../store/application.store'
import ModalWallet from '../modals/ModalWallet'
import Button from './buttons/Button'
import ButtonLinksDropdown from './buttons/ButtonLinksDropdown'
import IconCaretDropdown from './icons/IconCaretDropdown'
import IconDiscord from './icons/IconDiscord'
import IconEtherscan from './icons/IconEtherscan'
import IconFractionalLogo from './icons/IconFractionalLogo'
import IconHeartHollow from './icons/iconHeartHollow'
import IconHome from './icons/IconHome'
import IconLink from './icons/IconLink'
import IconMedium from './icons/IconMedium'
import IconNounletsLogo from './icons/IconNounletsLogo'
import IconTwitter from './icons/IconTwitter'
import SimpleAddress from './simple/SimpleAddress'

export default function AppHeader(): JSX.Element {
  const [isMobileMenuOpen, setIsModalMenuOpen] = useState(false)
  const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { setConnectModalOpen } = useAppStore()
  const { account, deactivate } = useEthers()
  const { isGovernanceEnabled } = useNounStore()
  const { currentBackground } = useCurrentBackground()

  useEffect(() => {
    if (mobileMenuRef.current == null) return
    if (isMobileMenuOpen) {
      const height = mobileMenuRef.current.getBoundingClientRect().height
      setMobileMenuMaxHeight(height)
    } else {
      setMobileMenuMaxHeight(0)
    }
  }, [isMobileMenuOpen, isGovernanceEnabled])

  const handleConnectButtonClick = useCallback(() => {
    if (account == null) {
      setConnectModalOpen(true)
    } else {
      deactivate()
    }
  }, [account, setConnectModalOpen, deactivate])

  const connectButton = useMemo(
    () => (
      <Button
        className={classNames(
          account ? 'basic hover:!bg-secondary-red' : 'primary',
          'group relative'
        )}
        onClick={() => handleConnectButtonClick()}
      >
        {account ? (
          <div className="flex items-center">
            <div className="overflow-hidden">
              <SimpleAddress
                avatarSize={16}
                address={account}
                className="pointer-events-none space-x-2 group-hover:invisible"
              />
              <p className="pointer-events-none invisible absolute inset-0 leading-px48 text-white group-hover:visible">
                Disconnect
              </p>
            </div>
          </div>
        ) : (
          <span>Connect</span>
        )}
      </Button>
    ),
    [account, handleConnectButtonClick]
  )

  return (
    <div className="app-header" style={{ background: currentBackground }}>
      <div className="mx-auto px-4 lg:container">
        <ModalWallet />
        <ModalVoteForDelegate />
        <div className="flex h-full min-h-[88px] items-center space-x-4">
          <Link href="/">
            <a className="relative mb-4 overflow-visible pt-2">
              <IconNounletsLogo className="h-20 w-20 flex-shrink-0 md:h-[108px] md:w-[108px]" />
            </a>
          </Link>

          <div className="-mt-4 flex min-w-0 flex-1 justify-end space-x-4 md:-mt-8">
            <div className="hidden flex-1 justify-between lg:flex">
              <Link href="/tribute">
                <Button className="basic flex-shrink-0 space-x-2">
                  <span>Tribute your Noun</span>
                </Button>
              </Link>

              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button className="basic flex-shrink-0 space-x-2">
                    <IconHome className="h-[12px] w-auto" />
                    <span>Home</span>
                  </Button>
                </Link>

                <Link href="/">
                  <Button className="basic flex-shrink-0 space-x-2">
                    <IconHome className="h-[12px] w-auto" />
                    <span>WTF are Nounlets?</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:block">
                <ButtonLinksDropdown />
              </div>

              <div className="lg:hidden">
                <Button
                  className="basic space-x-2"
                  onClick={() => setIsModalMenuOpen(!isMobileMenuOpen)}
                >
                  <IconLink className="h-[15px] w-auto" />
                  <IconCaretDropdown className="h-[7px] w-auto" />
                </Button>
              </div>
              {connectButton}
            </div>
          </div>
        </div>

        <div
          className="mobile-menu overflow-hidden transition-all ease-in-out lg:hidden"
          style={{ maxHeight: mobileMenuMaxHeight }}
        >
          <div ref={mobileMenuRef}>
            <div className="space-y-2 pb-4">
              <Link href="/">
                <Button
                  className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40"
                  onClick={() => setIsModalMenuOpen(false)}
                >
                  <IconHome className="h-[12px] w-auto" />
                  <span>Home</span>
                </Button>
              </Link>
              <Link href="/">
                <Button
                  className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40"
                  onClick={() => setIsModalMenuOpen(false)}
                >
                  <IconHome className="h-[12px] w-auto" />
                  <span>Trbute your Noun</span>
                </Button>
              </Link>
              <a
                href="https://medium.com/tessera-nft/nounlets-explained-faq-57e9bc537d93"
                target="_blank"
                rel="noreferrer"
                className="flex w-full justify-center space-x-2"
              >
                <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                  <IconMedium className="h-[16px] w-auto" />
                  <span>WTF are Nounlets?</span>
                </Button>
              </a>
              <a
                href="https://medium.com/tessera-nft/nounlets-explained-faq-57e9bc537d93"
                target="_blank"
                rel="noreferrer"
                className="flex w-full justify-center space-x-2"
              >
                <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                  <IconMedium className="h-[16px] w-auto" />
                  <span>Tributed Nouns</span>
                </Button>
              </a>
              <a
                href="https://discord.com/invite/8a34wmRjWB"
                target="_blank"
                className="flex w-full justify-center space-x-2"
                rel="noreferrer"
              >
                <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                  <IconDiscord className="h-[13px] w-auto" />
                  <span>Discord</span>
                </Button>
              </a>
              <a
                href="https://nouns.wtf"
                target="_blank"
                rel="noreferrer"
                className="flex w-full justify-center space-x-2"
              >
                <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                  <IconHeartHollow className="h-[16px] w-auto" />
                  <span>Nouns.wtf</span>
                </Button>
              </a>
              <a
                href="https://twitter.com/tessera"
                target="_blank"
                rel="noreferrer"
                className="flex w-full justify-center space-x-2"
              >
                <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                  <IconTwitter className="h-[16px] w-auto" />
                  <span>Twitter</span>
                </Button>
              </a>
              <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                <IconEtherscan className="h-[16px] w-auto" />
                <span>Etherscan</span>
              </Button>
              <a
                href="src/components/common/AppHeader.tsx"
                target="_blank"
                rel="noreferrer"
                className="flex w-full justify-center space-x-2"
              >
                <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                  <IconFractionalLogo className="h-[16px] w-auto text-black" />
                  <span>Tessera</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
