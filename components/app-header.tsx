import Image from 'next/image'
import Button from './buttons/button'
import IconCaretDropdown from './icons/icon-caret-dropdown'
import IconDiscord from './icons/icon-discord'
import IconFractionalLogo from './icons/icon-fractional-logo'
import IconPeople from '../public/img/icon-people.png'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import IconMedium from './icons/icon-medium'
import IconHeartHollow from './icons/icon-heart-hollow'
import IconTwitter from './icons/icon-twitter'
import IconEtherscan from './icons/icon-etherscan'
import LinksDropdownButton from './buttons/links-dropdown-button'
import InfoPopover from './info-popover'
import WalletModal from './modals/wallet-modal'
import { useAppStore } from '../store/application'
import { useEthers } from '@usedapp/core'
import { useShortAddress } from './ShortAddress'
import SimplePopover from './simple-popover'
import IconQuestionCircle from './icons/icon-question-circle'
import Link from 'next/link'
import VoteForDelegateModal from './modals/vote-for-delegate-modal'
import toast from 'react-hot-toast'
import IconNounletsLogo from './icons/icon-nounlets-logo'
import { useVaultStore } from 'store/vaultStore'
import SimpleAddress from './simple-address'
import { ethers } from 'ethers'
import classNames from 'classnames'
import IconCrown from './icons/icon-crown'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import useCurrentBackground from 'hooks/useCurrentBackground'
import IconCheckmark from './icons/icon-checkmark'
import { ErrorToast, SuccessToast } from './toasts/CustomToasts'

export default function AppHeader(): JSX.Element {
  const [isMobileMenuOpen, setIsModalMenuOpen] = useState(false)
  const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { setConnectModalOpen } = useAppStore()
  const { account, deactivate } = useEthers()
  const { isLive, currentDelegate, backgrounds, isCurrentDelegateOutOfSync } = useVaultStore()
  const { currentBackground } = useCurrentBackground()

  useEffect(() => {
    if (mobileMenuRef.current == null) return
    if (isMobileMenuOpen) {
      const height = mobileMenuRef.current.getBoundingClientRect().height
      setMobileMenuMaxHeight(height)
    } else {
      setMobileMenuMaxHeight(0)
    }
  }, [isMobileMenuOpen])

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
    return true
  }, [account, currentDelegate])

  const connectButton = useMemo(
    () => (
      <Button
        className={classNames(
          account ? 'basic hover:!bg-secondary-red' : 'primary',
          'relative group overflow-hidden'
        )}
        onClick={() => handleConnectButtonClick()}
      >
        {account ? (
          <div className="flex items-center overflow-hidden">
            {isCrownShown && (
              <IconCrown className="absolute w-[30px] h-auto left-[-12px] top-[-12px] rotate-[-40deg] text-[#fa8f2f]" />
            )}
            <SimpleAddress
              avatarSize={16}
              address={account}
              className="space-x-2 pointer-events-none group-hover:invisible"
            />
            <p className="absolute inset-0 pointer-events-none invisible group-hover:visible text-white leading-px48">
              Disconnect
            </p>
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
        <WalletModal />
        <VoteForDelegateModal />
        <div className="flex items-center h-full space-x-4 min-h-[88px]">
          <Link href="/">
            <a className="relative overflow-visible pt-2 mb-4">
              <IconNounletsLogo className="flex-shrink-0 w-20 h-20 md:w-[108px] md:h-[108px]" />
            </a>
          </Link>
          <div className="flex flex-1 -mt-4 md:-mt-8 overflow-hidden">
            <div className="flex-1 pr-4">
              {isLive && (
                <Link href="/governance">
                  <div className="hidden md:inline-flex items-center px-4 h-12 rounded-px10 bg-white space-x-2 cursor-pointer overflow-hidden">
                    <span className="flex-shrink-0">Current delegate</span>
                    {currentDelegateRC}

                    {isCurrentDelegateOutOfSync && (
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
            <div className="hidden lg:flex items-center space-x-4 overflow-hidden">
              <Link href="/governance">
                <Button className="basic space-x-2 flex-shrink-0">
                  <Image src={IconPeople} alt="votes" height={14} />
                  <span>Vote</span>
                </Button>
              </Link>
              <Button className="basic">
                <a
                  href="https://discord.com/invite/8a34wmRjWB"
                  target="_blank"
                  className="flex space-x-2 items-center"
                  rel="noreferrer"
                >
                  <IconDiscord className="h-[11px] w-auto" />
                  <span>Discord</span>
                </a>
              </Button>
              <LinksDropdownButton />
              {connectButton}
            </div>
            <div className="flex lg:hidden space-x-2 overflow-hidden">
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
        {isLive && (
          <Link href="/governance">
            <div className="md:hidden pb-4 cursor-pointer">
              <div className="flex flex-col items-center px-4 py-2 rounded-px10 bg-white space-y-2 justify-center overflow-hidden">
                <p>Current delegate</p>
                <div className="flex items-center justify-center space-x-2 w-full">
                  <div className="truncate font-500">{currentDelegateRC}</div>
                  {isCurrentDelegateOutOfSync && (
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
              <Link href="/governance">
                <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                  <Image src={IconPeople} alt="votes" height={14} />
                  <span>Vote</span>
                </Button>
              </Link>
              <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                <a
                  href="https://discord.com/invite/8a34wmRjWB"
                  target="_blank"
                  className="space-x-2 w-full flex justify-center"
                  rel="noreferrer"
                >
                  <IconDiscord className="h-[13px] w-auto" />
                  <span>Discord</span>
                </a>
              </Button>
              <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                <a
                  href="https://medium.com/@deeze/b76bbb4e42cc"
                  target="_blank"
                  rel="noreferrer"
                  className="space-x-2 w-full flex justify-center"
                >
                  <IconMedium className="h-[16px] w-auto" />
                  <span>Nounlets Explained (FAQ)</span>
                </a>
              </Button>
              <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                <a
                  href="https://nouns.wtf"
                  target="_blank"
                  rel="noreferrer"
                  className="space-x-2 w-full flex justify-center"
                >
                  <IconHeartHollow className="h-[16px] w-auto" />
                  <span>Nouns.wtf</span>
                </a>
              </Button>
              <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                <a
                  href="https://twitter.com/tessera"
                  target="_blank"
                  rel="noreferrer"
                  className="space-x-2 w-full flex justify-center"
                >
                  <IconTwitter className="h-[16px] w-auto" />
                  <span>Twitter</span>
                </a>
              </Button>
              <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                <IconEtherscan className="h-[16px] w-auto" />
                <span>Etherscan</span>
              </Button>
              <Button className="default-outline w-full space-x-2 !border-black/10 hover:bg-white/40">
                <a
                  href="https://tessera.co/"
                  target="_blank"
                  rel="noreferrer"
                  className="space-x-2 w-full flex justify-center"
                >
                  <IconFractionalLogo className="h-[16px] w-auto text-black" />
                  <span>Tessera</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
