import Image from 'next/image'
import Button from './buttons/button'
import IconCaretDropdown from './icons/icon-caret-dropdown'
import IconDiscord from './icons/icon-discord'
import IconFractionalLogo from './icons/icon-fractional-logo'
import IconPeople from '../public/img/icon-people.png'
import { useEffect, useRef, useState } from 'react'
import IconMedium from './icons/icon-medium'
import IconHeartHollow from './icons/icon-heart-hollow'
import IconTwitter from './icons/icon-twitter'
import IconEtherscan from './icons/icon-etherscan'
import LinksDropdownButton from './buttons/links-dropdown-button'
import InfoPopover from './info-popover'
import WalletModal from './wallet-modal'
import { useAppState } from '../store/application'
import { useEthers } from '@usedapp/core'
import { useShortAddress } from './ShortAddress'
import SimplePopover from './simple-popover'
import IconQuestionCircle from './icons/icon-question-circle'

export default function AppHeader(): JSX.Element {
  const [isMobileMenuOpen, setIsModalMenuOpen] = useState(false)
  const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { setConnectModalOpen } = useAppState()
  const { account } = useEthers()

  useEffect(() => {
    if (mobileMenuRef.current == null) return
    if (isMobileMenuOpen) {
      const height = mobileMenuRef.current.getBoundingClientRect().height
      setMobileMenuMaxHeight(height)
    } else {
      setMobileMenuMaxHeight(0)
    }
  }, [isMobileMenuOpen])

  const shortAddress = useShortAddress(account || '')

  const connectButton = (
    <Button className="primary space-x-2" onClick={() => setConnectModalOpen(true)}>
      <span>{account ? shortAddress : 'Connect'}</span>
    </Button>
  )

  return (
    <div className="app-header bg-gray-1">
      <div className="lg:container mx-auto px-4">
        <WalletModal />
        <div className="flex items-center h-full space-x-4 min-h-[88px]">
          <IconFractionalLogo className="flex-shrink-0 h-8 w-auto text-[#D63C5E]" />
          <div className="flex-1">
            <div className="hidden md:inline-flex items-center px-4 h-12 rounded-px10 bg-white space-x-2">
              <span className="hidden lg:inline">Current delegate</span>
              <span className="font-500 ml-2">hot.gabrielayuso.eth</span>
              <SimplePopover>
                <h1 className="font-700 text-px18 text-gray-4">
                  <span className="text-secondary-orange">⚠</span>
                </h1>
                <div>
                  This delegate is currently out of sync. There is another wallet with more votes.
                  You can update the delegate with a transaction.
                </div>
              </SimplePopover>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <Button className="basic space-x-2">
              <Image src={IconPeople} alt="votes" height={14} />
              <span>Vote</span>
            </Button>
            <Button className="basic space-x-2">
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
        <div className="md:hidden pb-4">
          <div className="flex items-center px-4 h-12 rounded-px10 bg-white space-x-2 justify-center">
            <p className="truncate font-500">
              <span className="hidden sm:inline">Current delegate</span>
              <span className="font-700 ml-2">hot.gabrielayuso.eth</span>
            </p>
            <SimplePopover>
              <h1 className="font-700 text-px18 text-gray-4">
                <span className="text-secondary-orange">⚠</span>
              </h1>
              <div>
                This delegate is currently out of sync. There is another wallet with more votes. You
                can update the delegate with a transaction.
              </div>
            </SimplePopover>
          </div>
        </div>
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
