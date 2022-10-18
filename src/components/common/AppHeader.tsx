import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import { ethers } from 'ethers'
import useCurrentBackground from 'src/hooks/useCurrentBackground'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useVaultStore } from 'src/store/vaultStore'
import IconPeople from '../../../public/img/icon-people.png'
import { useAppStore } from '../../store/application'
import Button from './buttons/Button'
import ButtonLinksDropdown from './buttons/ButtonLinksDropdown'
import IconCaretDropdown from './icons/IconCaretDropdown'
import IconCrown from './icons/IconCrown'
import IconDiscord from './icons/IconDiscord'
import IconEtherscan from './icons/IconEtherscan'
import IconFractionalLogo from './icons/IconFractionalLogo'
import IconHeartHollow from './icons/iconHeartHollow'
import IconMedium from './icons/IconMedium'
import IconNounlets from './icons/IconNounlets'
import IconHome from './icons/IconHome'
import IconNounletsLogo from './icons/IconNounletsLogo'
import IconTwitter from './icons/IconTwitter'
import ModalVoteForDelegate from '../modals/ModalVoteForDelegate'
import ModalWallet from '../modals/ModalWallet'
import SimpleAddress from './simple/SimpleAddress'
import SimplePopover from './simple/SimplePopover'
import IconVote from './icons/IconVote'
import { BuyoutState, useBuyoutStore } from 'src/store/buyout/buyout.store'

export default function AppHeader(): JSX.Element {
  const [isMobileMenuOpen, setIsModalMenuOpen] = useState(false)
  const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { setConnectModalOpen } = useAppStore()
  const { account, deactivate } = useEthers()
  const { isGovernanceEnabled, currentDelegate, isCurrentDelegateOutOfSyncOnVaultContract } =
    useVaultStore()
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

  const isCrownShown = useMemo(() => {
    if (account == null) return false
    if (currentDelegate == null || currentDelegate === ethers.constants.AddressZero) return false
    if (account.toLowerCase() !== currentDelegate.toLowerCase()) return false
    if (!isGovernanceEnabled) return false
    return true
  }, [account, currentDelegate, isGovernanceEnabled])

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
            {isCrownShown && (
              <IconCrown className="absolute w-[30px] h-auto left-[-12px] top-[-12px] rotate-[-40deg] text-[#fa8f2f]" />
            )}
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
            {/* <IconCaretDropdown /> */}
          </div>
        ) : (
          <span>Connect</span>
        )}
      </Button>
    ),
    [account, isCrownShown, handleConnectButtonClick]
  )

  const currentDelegateRC = useMemo(() => {
    return currentDelegate === ethers.constants.AddressZero ? (
      <span className="font-700 ml-2">no one :(</span>
    ) : (
      <SimpleAddress
        className="inline-flex font-700 ml-2 pointer-events-none"
        textClassName=""
        address={currentDelegate}
      />
    )
  }, [currentDelegate])

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
            <div className="flex flex-1 pr-4 min-w-0">
              {isGovernanceEnabled && (
                <Link href="/governance">
                  <div className="hidden md:inline-flex items-center px-4 h-12 rounded-px10 bg-white space-x-2 cursor-pointer overflow-hidden">
                    <span className="flex-shrink-0">Current delegate</span>
                    {currentDelegateRC}

                    {isCurrentDelegateOutOfSyncOnVaultContract && (
                      <SimplePopover>
                        <h1 className="font-700 text-px18 text-gray-4">
                          <span className="text-secondary-orange">⚠</span>
                        </h1>
                        <div>Delegate is out of sync. You can update it on the vote page.</div>
                      </SimplePopover>
                    )}
                  </div>
                </Link>
              )}
            </div>
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <Link href="/">
                <Button className="basic space-x-2 flex-shrink-0">
                  <IconHome className="h-[12px] w-auto" />
                  <span>Home</span>
                </Button>
              </Link>
              {isGovernanceEnabled && (
                <Link href="/governance">
                  <Button className="basic space-x-2 flex-shrink-0">
                    <IconVote className="h-[16px] w-auto" />
                    <span>Vote</span>
                  </Button>
                </Link>
              )}
              <Link href="/nounlet/1">
                <Button className="basic space-x-2">
                  <IconNounlets className="h-[12px] w-auto" />
                  <span>Nounlets</span>
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
        {isGovernanceEnabled && (
          <Link href="/governance">
            <div className="md:hidden pb-4 cursor-pointer">
              <div className="flex flex-col items-center px-4 py-2 rounded-px10 bg-white space-y-2 justify-center overflow-hidden">
                <p>Current delegate</p>
                <div className="flex items-center justify-center space-x-2 w-full">
                  <div className="truncate font-500">{currentDelegateRC}</div>
                  {isCurrentDelegateOutOfSyncOnVaultContract && (
                    <SimplePopover>
                      <h1 className="font-700 text-px18 text-gray-4">
                        <span className="text-secondary-orange">⚠</span>
                      </h1>
                      <div>Delegate is out of sync. You can update it on the vote page.</div>
                    </SimplePopover>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )}
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
              {isGovernanceEnabled && (
                <Link href="/governance">
                  <Button
                    className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40"
                    onClick={() => setIsModalMenuOpen(false)}
                  >
                    <IconVote className="h-[16px] w-auto" />
                    <span>Vote</span>
                  </Button>
                </Link>
              )}
              <Link href="/nounlet/1">
                <Button
                  className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40"
                  onClick={() => setIsModalMenuOpen(false)}
                >
                  <IconNounlets className="h-[12px] w-auto" />
                  <span>Nounlets</span>
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