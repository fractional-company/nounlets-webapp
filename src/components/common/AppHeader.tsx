import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ModalVoteForDelegate from 'src/components/modals/ModalVoteForDelegate'
import useCurrentBackground from 'src/hooks/utils/useCurrentBackground'
import useSdk from 'src/hooks/utils/useSdk'
import { getCurrentChainExplorerAddressLink } from 'src/lib/utils/common'
import { useNounStore } from 'src/store/noun.store'
import { useAppStore } from '../../store/application.store'
import ModalWallet from '../modals/ModalWallet'
import Button from './buttons/Button'
import ButtonLinksDropdown from './buttons/ButtonLinksDropdown'
import IconCaretDropdown from './icons/IconCaretDropdown'
import IconDiscord from './icons/IconDiscord'
import IconEtherscan from './icons/IconEtherscan'
import IconFractionalLogo from './icons/IconFractionalLogo'
import IconHeartHollow from './icons/iconHeartHollow'
import IconHome from './icons/IconHome'
import IconLink from './icons/IconLink'
import IconMedium from './icons/IconMedium'
import IconNounlets from './icons/IconNounlets'
import IconNounletsLogo from './icons/IconNounletsLogo'
import IconTesseraLogo from './icons/IconTesseraLogo'
import IconTwitter from './icons/IconTwitter'
import SimpleAddress from './simple/SimpleAddress'

export default function AppHeader(): JSX.Element {
  const sdk = useSdk()
  const [isMobileMenuOpen, setIsModalMenuOpen] = useState(false)
  const [mobileMenuMaxHeight, setMobileMenuMaxHeight] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const { setConnectModalOpen } = useAppStore()
  const { account, deactivate } = useEthers()
  const { isGovernanceEnabled } = useNounStore()
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

  const connectButton = useMemo(
    () => (
      <Button
        className={classNames(
          account ? 'basic hover:!bg-secondary-red' : 'primary',
          'group relative'
        )}
        onClick={() => handleConnectButtonClick()}
      >
        {account ? (
          <div className="flex items-center">
            <div className="overflow-hidden">
              <SimpleAddress
                avatarSize={16}
                address={account}
                className="pointer-events-none space-x-2 group-hover:invisible"
              />
              <p className="pointer-events-none invisible absolute inset-0 leading-px48 text-white group-hover:visible">
                Disconnect
              </p>
            </div>
          </div>
        ) : (
          <span>Connect</span>
        )}
      </Button>
    ),
    [account, handleConnectButtonClick]
  )

  return (
    <div className="app-header" style={{ background: currentBackground }}>
      <div className="mx-auto px-4 lg:container">
        <ModalWallet />
        <ModalVoteForDelegate />
        <div className="flex h-full min-h-[88px] items-center space-x-4">
          <Link href="/">
            <a className="relative mb-4 overflow-visible pt-2">
              <IconNounletsLogo className="h-20 w-20 flex-shrink-0 md:h-[108px] md:w-[108px]" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
