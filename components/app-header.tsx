import Image from 'next/image'
import Button from './buttons/button'
import IconCaretDropdown from './icons/icon-caret-dropdown'
import IconDiscord from './icons/icon-discord'
import IconFractionalLogo from './icons/icon-fractional-logo'
import IconPeople from '../public/img/icon-people.png'
import { useEffect, useMemo, useRef, useState } from 'react'
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

export default function AppHeader(): JSX.Element {
  const [isMobileMenuOpen, setIsModalMenuOpen] = useState(false)
  const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { setConnectModalOpen } = useAppStore()
  const { account, deactivate } = useEthers()
  const { isLive, currentDelegate, backgrounds } = useVaultStore()
  const { nid, nounletImageData, nounletBackground } = useDisplayedNounlet()
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

  const handleConnectButtonClick = () => {
    if (account == null) {
      setConnectModalOpen(true)
    } else {
      deactivate()
    }
  }

  const isCrownShown = useMemo(() => {
    if (account == null) return false
    if (currentDelegate == null || currentDelegate === ethers.constants.AddressZero) return false
    if (account !== currentDelegate) return false
    return true
  }, [account, currentDelegate])

  const connectButton = (
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
  )

  const handleShowNotification = () => {
    toast('Hello!')
  }

  const currentDelegateRC = useMemo(() => {
    return currentDelegate === ethers.constants.AddressZero ? (
      <span className="font-700 ml-2">no one :(</span>
    ) : (
      <SimpleAddress className="inline-flex font-700 ml-2" address={currentDelegate} />
    )
  }, [currentDelegate])

  return (
    <div className="app-header" style={{ background: currentBackground }}>
      <div className="lg:container mx-auto px-4">
        <WalletModal />
        <VoteForDelegateModal />
        <div className="flex items-center h-full space-x-4 min-h-[88px]">
          <Link href="/">
            <a className="relative h-[88px] overflow-visible pt-2">
              <IconNounletsLogo className="flex-shrink-0 w-auto h-16" />
            </a>
          </Link>
          <div className="flex-1">
            {isLive && (
              <div className="hidden md:inline-flex items-center px-4 h-12 rounded-px10 bg-white space-x-2">
                <span className="hidden lg:inline">Current delegate</span>
                {currentDelegateRC}

                <SimplePopover>
                  <h1 className="font-700 text-px18 text-gray-4">
                    <span className="text-secondary-orange">⚠</span>
                  </h1>
                  <div>Delegate is out of sync. You can update it on the vote page.</div>
                </SimplePopover>
              </div>
            )}
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/governance">
              <Button className="basic space-x-2">
                <Image src={IconPeople} alt="votes" height={14} />
                <span>Vote</span>
              </Button>
            </Link>
            <Button className="basic space-x-2" onClick={handleShowNotification}>
              <IconDiscord className="h-[11px] w-auto" />
              <span>Discord</span>
            </Button>
            <LinksDropdownButton />
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
        {isLive && (
          <div className="md:hidden pb-4">
            <div className="flex items-center px-4 h-12 rounded-px10 bg-white space-x-2 justify-center">
              <div className="truncate font-500">
                <span className="hidden sm:inline">Current delegate</span>
                {currentDelegateRC}
              </div>
              <SimplePopover>
                <h1 className="font-700 text-px18 text-gray-4">
                  <span className="text-secondary-orange">⚠</span>
                </h1>
                <div>Delegate is out of sync. You can update it on the vote page.</div>
              </SimplePopover>
            </div>
          </div>
        )}
        <div
          className="lg:hidden mobile-menu overflow-hidden transition-all ease-in-out"
          style={{ maxHeight: mobileMenuMaxHeight }}
        >
          <div ref={mobileMenuRef}>
            <div className="space-y-2 pb-4">
              <Button className="default-outline w-full space-x-2">
                <IconDiscord className="h-[13px] w-auto" />
                <span>Discord</span>
              </Button>
              <Button className="default-outline w-full space-x-2">
                <IconMedium className="h-[16px] w-auto" />
                <span>What is it... (blog)</span>
              </Button>
              <Button className="default-outline w-full space-x-2">
                <IconHeartHollow className="h-[16px] w-auto" />
                <span>Nouns.wtf</span>
              </Button>
              <Button className="default-outline w-full space-x-2">
                <IconTwitter className="h-[16px] w-auto" />
                <span>Twitter</span>
              </Button>
              <Button className="default-outline w-full space-x-2">
                <IconEtherscan className="h-[16px] w-auto" />
                <span>Etherscan</span>
              </Button>
              <Button className="default-outline w-full space-x-2">
                <IconFractionalLogo className="h-[16px] w-auto text-secondary-green" />
                <span>Fractional.art</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
