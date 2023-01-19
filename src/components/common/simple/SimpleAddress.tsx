import Davatar from '@davatar/react'
import { useEthers, useLookupAddress } from '@usedapp/core'
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
  const address = (props.address || ethers.constants.AddressZero).toLowerCase()
  return (
    <div
      key={address}
      className={classNames('simple-address flex items-center overflow-hidden', props.className)}
    >
      <KeyedAddress {...{ ...props, address }} />
    </div>
  )
}

function KeyedAddress(props: ComponentProps) {
  const { avatarSize = 0, address } = props
  const shortenedAddres = shortenAddress(address)
  const ens = useReverseENSLookUp(address, false)

  return (
    <OnMounted>
      <>
        {!!avatarSize && (
          <a
            href={getCurrentChainExplorerAddressLink(address)}
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 overflow-hidden"
          >
            <div
              className={classNames(
                'flex-shrink-0 overflow-hidden rounded-full',
                props.avatarClassName
              )}
              style={{ width: avatarSize, height: avatarSize }}
            >
              <Jazzicon
                diameter={avatarSize}
                seed={jsNumberForAddress('' + address)}
                paperStyles={{ display: 'block' }}
              />
              {/* <Davatar size={avatarSize} address={address} provider={provider} /> */}
            </div>
          </a>
        )}
        <div className="flex flex-col overflow-hidden">
          <a href={getCurrentChainExplorerAddressLink(address)} target="_blank" rel="noreferrer">
            <p className={classNames('truncate ', props.textClassName)}>{ens || shortenedAddres}</p>
          </a>
          {props.subtitle}
        </div>
      </>
    </OnMounted>
  )
}
