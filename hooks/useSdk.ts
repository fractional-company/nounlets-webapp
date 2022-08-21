import { getMainnetSdk, getRinkebySdk, RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { useEthers } from '@usedapp/core'
import { CHAIN_ID } from 'config'
import { useEffect, useState } from 'react'

export type NounletsSDK = RinkebySdk['nounlets']

export default function useSdk() {
  const { account, library } = useEthers()
  const [sdk, setSdk] = useState<NounletsSDK | null>(
    library == null
      ? null
      : (CHAIN_ID === 4 ? getRinkebySdk(library) : (getMainnetSdk(library) as RinkebySdk)).nounlets
  )

  useEffect(() => {
    if (library == null) {
      setSdk(null)
    } else {
      setSdk(
        (CHAIN_ID === 4 ? getRinkebySdk(library) : (getMainnetSdk(library) as RinkebySdk)).nounlets
      )
    }
  }, [library])

  return sdk
}
