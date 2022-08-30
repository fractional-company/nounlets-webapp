import { RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { SDKContext } from 'components/WalletConfig'
import { useContext } from 'react'

export type NounletsSDK = RinkebySdk['nounlets']

export default function useSdk() {
  const sdk = useContext(SDKContext)
  return sdk
}
