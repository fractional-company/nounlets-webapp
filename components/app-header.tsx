import Image from 'next/image'
import Button from './buttons/button'
import IconCaretDropdown from './icons/icon-caret-dropdown'
import IconDiscord from './icons/icon-discord'
import IconFractionalLogo from './icons/icon-fractional-logo'
import IconLink from './icons/icon-link'
import IconPeople from '../public/img/icon-people.png'
import { Fragment, useEffect, useRef, useState } from 'react'
import IconMedium from './icons/icon-medium'
import IconHeartHollow from './icons/icon-heart-hollow'
import IconTwitter from './icons/icon-twitter'
import IconEtherscan from './icons/icon-etherscan'
import LinksDropdownButton from './buttons/links-dropdown-button'
import InfoPopover from './info-popover'
import { Dialog, Transition } from '@headlessui/react'
import WalletModal from "./wallet-modal";
import {useAppState} from "../store/application";

export default function AppHeader(): JSX.Element {
  let [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsModalMenuOpen] = useState(false)
  const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { setConnectModalOpen } = useAppState()

  useEffect(() => {
    if (mobileMenuRef.current == null) return
    if (isMobileMenuOpen) {
      const height = mobileMenuRef.current.getBoundingClientRect().height
      setMobileMenuMaxHeight(height)
    } else {
      setMobileMenuMaxHeight(0)
    }
  }, [isMobileMenuOpen])

  return (
    <div className="app-header bg-gray-1">
      <div className="lg:container mx-auto xl:max-w-7xl px-4">
        <WalletModal />
        <div className="flex items-center h-full space-x-4 min-h-[88px]">
          <IconFractionalLogo className="flex-shrink-0 h-8 w-auto text-[#D63C5E]" />
          <div className="flex-1">
            <div className="hidden md:inline-flex items-center px-4 h-12 rounded-px10 bg-white space-x-2">
              <span className="hidden lg:inline">Current delegate</span>
              <span className="font-500 ml-2">hot.gabrielayuso.eth</span>
              <InfoPopover />
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
            <Button className="primary space-x-2" onClick={() => setConnectModalOpen(true)}>
              <span>Connect</span>
            </Button>
          </div>
          <div className="flex lg:hidden space-x-2">
            <Button className="primary space-x-2" onClick={() => setConnectModalOpen(true)}>
              <span>Connect</span>
            </Button>

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
            <p className="truncate">
              <span className="hidden sm:inline">Current delegate</span>
              <span className="font-500 ml-2">hot.gabrielayuso.eth</span>
            </p>
            <InfoPopover />
          </div>
        </div>
        <div
          className="lg:hidden mobile-menu overflow-hidden transition-all ease-in-out"
          style={{ maxHeight: mobileMenuMaxHeight }}
        >
          <div ref={mobileMenuRef}>
            <div className="py-4 space-y-2">
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
