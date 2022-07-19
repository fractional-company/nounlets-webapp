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
import {useEthers} from "@usedapp/core";
import config, {CHAIN_ID} from "../config";
import classes from "./WalletConnectModal/WalletConnectModal.module.css";
import WalletButton, {WALLET_TYPE} from "./WalletButton";
import {InjectedConnector} from "@web3-react/injected-connector";
import {FortmaticConnector} from "@web3-react/fortmatic-connector";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";
import {WalletLinkConnector} from "@web3-react/walletlink-connector";
import {TrezorConnector} from "@web3-react/trezor-connector";
import clsx from "clsx";

export default function WalletModal(): JSX.Element {
    const [isMobileMenuOpen, setIsModalMenuOpen] = useState(false)
    const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0)
    const mobileMenuRef = useRef<HTMLDivElement>(null)
    const { setConnectModalOpen, isConnectModalOpen } = useAppState()
    const { activate, account } = useEthers();
    const supportedChainIds = [CHAIN_ID];

    useEffect(() => {
        if (mobileMenuRef.current == null) return
        if (isMobileMenuOpen) {
            const height = mobileMenuRef.current.getBoundingClientRect().height
            setMobileMenuMaxHeight(height)
        } else {
            setMobileMenuMaxHeight(0)
        }
    }, [isMobileMenuOpen])

    const wallets = (
        <div className={classes.walletConnectModal}>
            <WalletButton
                onClick={() => {
                    const injected = new InjectedConnector({
                        supportedChainIds,
                    });
                    activate(injected);
                }}
                walletType={WALLET_TYPE.metamask}
            />
            <WalletButton
                onClick={() => {
                    const fortmatic = new FortmaticConnector({
                        apiKey: 'pk_live_60FAF077265B4CBA',
                        chainId: CHAIN_ID,
                    });
                    activate(fortmatic);
                }}
                walletType={WALLET_TYPE.fortmatic}
            />
            <WalletButton
                onClick={() => {
                    const walletlink = new WalletConnectConnector({
                        supportedChainIds,
                        chainId: CHAIN_ID,
                        rpc: {
                            [CHAIN_ID]: config.app.jsonRpcUri,
                        },
                    });
                    activate(walletlink);
                }}
                walletType={WALLET_TYPE.walletconnect}
            />
            <WalletButton
                onClick={() => {
                    const walletlink = new WalletLinkConnector({
                        appName: 'LilNouns.WTF',
                        appLogoUrl: 'https://lilnouns.wtf/static/media/logo.svg',
                        url: config.app.jsonRpcUri,
                        supportedChainIds,
                    });
                    activate(walletlink);
                }}
                walletType={WALLET_TYPE.coinbaseWallet}
            />
            <WalletButton
                onClick={() => {
                    const injected = new InjectedConnector({
                        supportedChainIds,
                    });
                    activate(injected);
                }}
                walletType={WALLET_TYPE.brave}
            />
            {/* <WalletButton
        onClick={() => {
          const ledger = new LedgerConnector({
            //TODO: refactor
            chainId: config.supportedChainId,
            url: config.rinkebyJsonRpc,
          });
          activate(ledger);
        }}
        walletType={WALLET_TYPE.ledger}
      /> */}

            {/* //TODO: update */
            }

            <WalletButton
                onClick={() => {
                    const trezor = new TrezorConnector({
                        chainId: CHAIN_ID,
                        url: config.app.jsonRpcUri,
                        manifestAppUrl: 'https://lilnouns.wtf',
                        manifestEmail: 'lilnouns@protonmail.com',
                    });
                    activate(trezor);
                }}
                walletType={WALLET_TYPE.trezor}
            />
            <div
                className={clsx(classes.clickable, classes.walletConnectData)}
                onClick={() => {
                    console.log(localStorage.removeItem('walletconnect'));
                }}
            >
                Clear WalletConnect Data
            </div>
        </div>
    );

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
                            <Dialog.Title>Connect your wallet</Dialog.Title>
                            {wallets}
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    )
}
