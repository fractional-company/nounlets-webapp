import metamaskLogo from 'assets/wallet-brand-assets/metamask-fox.svg'
import fortmaticLogo from 'assets/wallet-brand-assets/fortmatic.svg'
import walletconnectLogo from 'assets/wallet-brand-assets/walletconnect-logo.svg'
import braveLogo from 'assets/wallet-brand-assets/brave.svg'
import ledgerLogo from 'assets/wallet-brand-assets/ledger.svg'
import trezorLogo from 'assets/wallet-brand-assets/trezor.svg'
import coinbaseWalletLogo from 'assets/wallet-brand-assets/coinbase-wallet-dot.svg'
import Button from './buttons/button'
import Image, { StaticImageData } from 'next/image'
import classNames from 'classnames'

export enum WALLET_TYPE {
  metamask = 'Metamask',
  brave = 'Brave',
  ledger = 'Ledger',
  walletconnect = 'WalletConnect',
  fortmatic = 'Fortmatic',
  trezor = 'Trezor',
  coinbaseWallet = 'Coinbase Wallet'
}

const logo = (walletType: WALLET_TYPE): StaticImageData | string => {
  switch (walletType) {
    case WALLET_TYPE.metamask:
      return metamaskLogo
    case WALLET_TYPE.fortmatic:
      return fortmaticLogo
    case WALLET_TYPE.walletconnect:
      return walletconnectLogo
    case WALLET_TYPE.brave:
      return braveLogo
    case WALLET_TYPE.ledger:
      return ledgerLogo
    case WALLET_TYPE.trezor:
      return trezorLogo
    case WALLET_TYPE.coinbaseWallet:
      return coinbaseWalletLogo
    default:
      return ''
  }
}

export default function WalletButton(props: {
  className?: string
  onClick: () => void
  walletType: WALLET_TYPE
}): JSX.Element {
  const image = logo(props.walletType)
  return (
    <Button
      className={classNames(
        'wallet-button basic gap-2 !justify-between sm:!justify-center',
        props.className
      )}
      onClick={props.onClick}
    >
      <div className="flex-shrink-0 w-8 h-8">
        <Image
          src={image}
          alt="icon"
          width="32"
          height="32"
          className="overflow-hidden rounded-full flex-shrink-0"
        />
      </div>
      <span className="truncate">{props.walletType}</span>
    </Button>
  )
}
