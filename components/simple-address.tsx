import Davatar from '@davatar/react'
import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import { ethers } from 'ethers'
import { shortenAddress } from 'lib/utils/common'
import { useReverseENSLookUp } from 'lib/utils/ensLookup'
import { buildEtherscanAddressLink } from '../lib/utils/etherscan'
import OnMounted from './utils/on-mounted'

type ComponentProps = {
  className?: string
  address: string
  avatarSize?: number
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
      className={classNames('simple-address flex items-center overflow-hidden', props.className)}
    >
      <OnMounted>
        {!!avatarSize && (
          <a
            href={buildEtherscanAddressLink(address)}
            target="_blank"
            rel="noreferrer"
            className="overflow-hidden flex-shrink-0"
          >
            <div
              className="overflow-hidden rounded-full flex-shrink-0"
              style={{ width: avatarSize, height: avatarSize }}
            >
              <Davatar size={avatarSize} address={address} provider={provider} />
            </div>
          </a>
        )}
        <div className="flex flex-col overflow-hidden">
          <a href={buildEtherscanAddressLink(address)} target="_blank" rel="noreferrer">
            <p className={classNames('truncate ', props.textClassName)}>{ens || shortenedAddres}</p>
          </a>
          {props.subtitle}
        </div>
      </OnMounted>
    </div>
  )
}
