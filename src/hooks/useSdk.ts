import { GoerliSdk, MainnetSdk } from '@dethcrypto/eth-sdk-client'
import { SDKContext } from 'src/components/WalletConfig'
import { useContext } from 'react'

export type NounletsSDK = MainnetSdk['nounlets'] | GoerliSdk['nounlets']

export default function useSdk() {
  const sdk = useContext(SDKContext)
  return sdk
}
