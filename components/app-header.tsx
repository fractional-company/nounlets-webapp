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

export default function AppHeader(): JSX.Element {
  let [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsModalMenuOpen] = useState(false)
  const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mobileMenuRef.current == null) return
    if (isMobileMenuOpen) {
      const height = mobileMenuRef.current.getBoundingClientRect().height
      setMobileMenuMaxHeight(height)
    } else {
      setMobileMenuMaxHeight(0)
    }
  }, [isMobileMenuOpen])

  const handleToggleModal = () => {
    console.log('toggle', isOpen)
    setIsOpen(!isOpen)
  }

  return (
    <div className="app-header bg-gray-1">
      <div className="lg:container mx-auto xl:max-w-7xl px-4">
        <Transition show={isOpen} as={Fragment}>
          <Dialog onClose={() => setIsOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="fixed inset-0 flex items-center justify-center p-6">
                <Dialog.Panel className=" bg-white rounded-px24 p-6 max-w-screen-md">
                  <Dialog.Title>Deactivate account</Dialog.Title>
                  <Dialog.Description>
                    This will permanently deactivate your account
                  </Dialog.Description>

                  <p>
                    Are you sure you want to deactivate your account? All of your data will be
                    permanently removed. This action cannot be undone.
                  </p>

                  <button onClick={() => setIsOpen(false)}>Deactivate</button>
                  <button onClick={() => setIsOpen(false)}>Cancel</button>
                </Dialog.Panel>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition>
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
            <Button className="primary space-x-2" onClick={handleToggleModal}>
              <span>Connect</span>
            </Button>
          </div>
          <div className="flex lg:hidden space-x-2">
            <Button className="primary space-x-2" onClick={handleToggleModal}>
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
