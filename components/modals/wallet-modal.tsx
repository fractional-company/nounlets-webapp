import Button from '../buttons/button'
import { useEffect, useRef, useState } from 'react'
import { useAppState } from '../../store/application'
import { useEthers } from '@usedapp/core'
import config, { CHAIN_ID } from '../../config'
import { InjectedConnector } from '@web3-react/injected-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { TrezorConnector } from '@web3-react/trezor-connector'
import WalletButton, { WALLET_TYPE } from '../wallet-button'
import SimpleModal from '../simple-modal'
import SimpleCheckbox from 'components/simple-checkbox'
import Link from 'next/link'
import classNames from 'classnames'

export default function WalletModal(): JSX.Element {
  const [isMobileMenuOpen, setIsModalMenuOpen] = useState(false)
  const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { setConnectModalOpen, isConnectModalOpen } = useAppState()
  const { activate, activateBrowserWallet, account, deactivate } = useEthers()
  const supportedChainIds = [CHAIN_ID]
  const [areConditionsAccepted, setAreConditionsAccepted] = useState(false)

  useEffect(() => {
    if (mobileMenuRef.current == null) return
    if (isMobileMenuOpen) {
      const height = mobileMenuRef.current.getBoundingClientRect().height
      setMobileMenuMaxHeight(height)
    } else {
      setMobileMenuMaxHeight(0)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (account) {
        setConnectModalOpen(false)
    }
  }, [account])

  const wallets = (
    <div className="wallet-buttons-list grid grid-cols-1 md:grid-cols-2 gap-3 justify-items-stretch md:justify-items-start">
      <style jsx global>{`
        @media (min-width: 768px) {
          .wallet-buttons-list button:nth-child(odd) {
            margin-left: auto;
          }
        }
      `}</style>
      <WalletButton
        onClick={async () => {
            debugger
            const response = await activateBrowserWallet()
            debugger
        }}
        walletType={WALLET_TYPE.metamask}
      />
      <WalletButton
        onClick={() => {
          const fortmatic = new FortmaticConnector({
            apiKey: 'pk_live_60FAF077265B4CBA',
            chainId: CHAIN_ID
          })
          activate(fortmatic)
        }}
        walletType={WALLET_TYPE.fortmatic}
      />
      <WalletButton
        onClick={() => {
          const walletlink = new WalletConnectConnector({
            supportedChainIds,
            chainId: CHAIN_ID,
            rpc: {
              [CHAIN_ID]: config.app.jsonRpcUri
            }
          })
          activate(walletlink)
        }}
        walletType={WALLET_TYPE.walletconnect}
      />
      <WalletButton
        onClick={() => {
          const walletlink = new WalletLinkConnector({
            appName: 'LilNouns.WTF',
            appLogoUrl: 'https://lilnouns.wtf/static/media/logo.svg',
            url: config.app.jsonRpcUri,
            supportedChainIds
          })
          activate(walletlink)
        }}
        walletType={WALLET_TYPE.coinbaseWallet}
      />
      <WalletButton
          onClick={() => activateBrowserWallet()}
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

      <WalletButton
        onClick={() => {
          const trezor = new TrezorConnector({
            chainId: CHAIN_ID,
            url: config.app.jsonRpcUri,
            manifestAppUrl: 'https://lilnouns.wtf',
            manifestEmail: 'lilnouns@protonmail.com'
          })
          activate(trezor)
        }}
        walletType={WALLET_TYPE.trezor}
      />
    </div>
  )

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  return (
    <SimpleModal
      className="wallet-modal !max-w-[454px]"
      isShown={isConnectModalOpen}
      onClose={() => setConnectModalOpen(false)}
    >
      <h2 className="font-700 text-px32 leading-px36 text-center">Connect your wallet</h2>
      <div className="mt-8 flex flex-col gap-6">
        <div className="flex items-center p-5 rounded-px16 bg-gray-5 gap-4">
          <SimpleCheckbox isChecked={areConditionsAccepted} onChange={setAreConditionsAccepted} />
          <p className="font-500 font-px12 leading-px20 text-white">
            I have read and accept the site&apos;s{' '}
            <Link href="/">
              <a className="text-primary hover:text-white transition-colors">Disclaimer</a>
            </Link>
            {', '}
            <Link href="/">
              <a className="text-primary hover:text-white transition-colors">Privacy Policy</a>
            </Link>
            {', and '}
            <Link href="/">
              <a className="text-primary hover:text-white transition-colors">Terms of Use</a>
            </Link>
            .
          </p>
        </div>
        <div
          className={classNames('transition-opacity', {
            'pointer-events-none opacity-25': !areConditionsAccepted
          })}
        >
          {wallets}
        </div>
        <Button
          className="link text-px14 font-700 text-gray-3 hover:text-secondary-blue w-full --sm"
          onClick={() => {
            console.log(localStorage.removeItem('walletconnect'))
              deactivate()
            setIsSuccessModalOpen(true)
          }}
        >
          Clear WalletConnect Data
        </Button>

        <SimpleModal isShown={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)}>
          <h2 className="font-700 text-px32 leading-px36 text-center">Data cleared!</h2>
          <div className="mt-8 flex flex-col gap-6">
            <Button
              className="basic"
              onClick={() => {
                setIsSuccessModalOpen(false)
              }}
            >
              Yay!
            </Button>
          </div>
        </SimpleModal>
      </div>
    </SimpleModal>
  )
}
