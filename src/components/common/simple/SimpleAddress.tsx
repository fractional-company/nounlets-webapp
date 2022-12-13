import Davatar from '@davatar/react'
import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import { ethers } from 'ethers'
import { getCurrentChainExplorerAddressLink, shortenAddress } from 'src/lib/utils/common'
import { useReverseENSLookUp } from 'src/lib/utils/ensLookup'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import OnMounted from '../../OnMounted'
import { useEffect, useState } from 'react'

type ComponentProps = {
  className?: string
  address: string
  avatarSize?: number
  avatarClassName?: string
  subtitle?: JSX.Element
  textClassName?: string // Used to fix londrina font clipping
}

export default function SimpleAddress(props: ComponentProps): JSX.Element {
  const { library: provider } = useEthers()
  const { avatarSize = 0 } = props
  const address = props.address || ethers.constants.AddressZero
  const shortenedAddres = shortenAddress(address).toLowerCase()
  const ens = useReverseENSLookUp(address, false)

  // TODO if the address owns an nounlet, use it as avatar

  return (
    <div
      key={address}
      className={classNames('simple-address flex items-center overflow-hidden', props.className)}
    >
      <OnMounted>
        <>
          {!!avatarSize && (
            <a
              href={getCurrentChainExplorerAddressLink(address)}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden flex-shrink-0"
            >
              <div
                className={classNames(
                  'overflow-hidden rounded-full flex-shrink-0',
                  props.avatarClassName
                )}
                style={{ width: avatarSize, height: avatarSize }}
              >
                <Jazzicon diameter={avatarSize} seed={jsNumberForAddress('' + address)} />
                {/* <Davatar size={avatarSize} address={address} provider={provider} /> */}
              </div>
            </a>
          )}
          <div className="flex flex-col overflow-hidden">
            <a href={getCurrentChainExplorerAddressLink(address)} target="_blank" rel="noreferrer">
              <p className={classNames('truncate ', props.textClassName)}>
                {ens || shortenedAddres}
              </p>
            </a>
            {props.subtitle}
          </div>
        </>
      </OnMounted>
    </div>
  )
}
