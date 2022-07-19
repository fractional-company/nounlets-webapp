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
import {useAccountState} from "../store/account";
import {useAppState} from "../store/application";

export default function WalletModal(): JSX.Element {
    const [isMobileMenuOpen, setIsModalMenuOpen] = useState(false)
    const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0)
    const mobileMenuRef = useRef<HTMLDivElement>(null)
    const { setConnectModalOpen, isConnectModalOpen } = useAppState()

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
        <Transition show={isConnectModalOpen} as={Fragment}>
            <Dialog onClose={() => setConnectModalOpen(false)}>
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

                            <button onClick={() => setConnectModalOpen(false)}>Deactivate</button>
                            <button onClick={() => setConnectModalOpen(false)}>Cancel</button>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    )
}
