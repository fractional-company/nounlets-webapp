import { GoerliSdk, MainnetSdk } from '@dethcrypto/eth-sdk-client'
import { SDKContext } from 'src/components/common/WalletConfig'
import { useContext } from 'react'

export type NounletsSDK = MainnetSdk['v1']['nounlets'] | GoerliSdk['v1']['nounlets']

export default function useSdk() {
  const sdk = useContext(SDKContext)
  return sdk
}
