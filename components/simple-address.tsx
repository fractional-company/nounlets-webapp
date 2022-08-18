import classNames from 'classnames'
import Davatar from '@davatar/react'
import { shortenAddress } from 'lib/utils/common'
import { useReverseENSLookUp } from 'lib/utils/ensLookup'
import OnMounted from './utils/on-mounted'
import { useEthers } from '@usedapp/core'
import { buildEtherscanAddressLink } from '../lib/utils/etherscan'

type ComponentProps = {
  className?: string
  address: string
  avatarSize?: number
}

export default function SimpleAddress(props: ComponentProps): JSX.Element {
  const { library: provider } = useEthers()
  const { avatarSize = 0 } = props
  const address = props.address || '0x0000000000000000000000000000000000000000'
  const shortenedAddres = shortenAddress(address).toLowerCase()
  const ens = useReverseENSLookUp(address, false)

  // TODO if the address owns an nounlet, use it as avatar

  return (
    <div
      className={classNames('simple-address flex items-center overflow-hidden', props.className)}
    >
      <OnMounted>
        {!!avatarSize && (
          <a href={buildEtherscanAddressLink(address)} target="_blank" rel="noreferrer">
            <div
              className="overflow-hidden rounded-full flex-shrink-0"
              style={{ width: avatarSize, height: avatarSize }}
            >
              <Davatar size={avatarSize} address={address} provider={provider} />
            </div>
          </a>
        )}
        <a href={buildEtherscanAddressLink(address)} target="_blank" rel="noreferrer">
          <p className="truncate">{ens || shortenedAddres}</p>
        </a>
      </OnMounted>
    </div>
  )
}
