import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ModalVoteForDelegate from 'src/components/modals/ModalVoteForDelegate'
import useCurrentBackground from 'src/hooks/useCurrentBackground'
import { useVaultStore } from 'src/store/vaultStore'
import { useAppStore } from '../../store/application'
import ModalWallet from '../modals/ModalWallet'
import Button from './buttons/Button'
import ButtonLinksDropdown from './buttons/ButtonLinksDropdown'
import IconCaretDropdown from './icons/IconCaretDropdown'
import IconDiscord from './icons/IconDiscord'
import IconEtherscan from './icons/IconEtherscan'
import IconFractionalLogo from './icons/IconFractionalLogo'
import IconHeartHollow from './icons/iconHeartHollow'
import IconHome from './icons/IconHome'
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
  const { isGovernanceEnabled } = useVaultStore()
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
          'relative group'
        )}
        onClick={() => handleConnectButtonClick()}
      >
        {account ? (
          <div className="flex items-center">
            <div className="overflow-hidden">
              <SimpleAddress
                avatarSize={16}
                address={account}
                className="space-x-2 pointer-events-none group-hover:invisible"
              />
              <p className="absolute inset-0 pointer-events-none invisible group-hover:visible text-white leading-px48">
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
      <div className="lg:container mx-auto px-4">
        <ModalWallet />
        <ModalVoteForDelegate />
        <div className="flex items-center h-full space-x-4 min-h-[88px]">
          <Link href="/">
            <a className="relative overflow-visible pt-2 mb-4">
              <IconNounletsLogo className="flex-shrink-0 w-20 h-20 md:w-[108px] md:h-[108px]" />
            </a>
          </Link>
          <div className="flex flex-1 -mt-4 md:-mt-8 min-w-0">
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <Link href="/">
                <Button className="basic space-x-2 flex-shrink-0">
                  <IconHome className="h-[12px] w-auto" />
                  <span>Home</span>
                </Button>
              </Link>
              <ButtonLinksDropdown />
              {connectButton}
            </div>
            <div className="flex lg:hidden space-x-2">
              {connectButton}
              <Button
                className="basic space-x-2"
                onClick={() => setIsModalMenuOpen(!isMobileMenuOpen)}
              >
                <IconCaretDropdown className="h-[7px] w-auto" />
              </Button>
            </div>
          </div>
        </div>

        <div
          className="lg:hidden mobile-menu overflow-hidden transition-all ease-in-out"
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
              <a
                href="https://discord.com/invite/8a34wmRjWB"
                target="_blank"
                className="space-x-2 w-full flex justify-center"
                rel="noreferrer"
              >
                <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                  <IconDiscord className="h-[13px] w-auto" />
                  <span>Discord</span>
                </Button>
              </a>
              <a
                href="https://medium.com/tessera-nft/nounlets-explained-faq-57e9bc537d93"
                target="_blank"
                rel="noreferrer"
                className="space-x-2 w-full flex justify-center"
              >
                <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                  <IconMedium className="h-[16px] w-auto" />
                  <span>Nounlets Explained (FAQ)</span>
                </Button>
              </a>
              <a
                href="https://nouns.wtf"
                target="_blank"
                rel="noreferrer"
                className="space-x-2 w-full flex justify-center"
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
                className="space-x-2 w-full flex justify-center"
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
                className="space-x-2 w-full flex justify-center"
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
