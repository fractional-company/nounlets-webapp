import { getMainnetSdk, getRinkebySdk, RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { useEthers } from '@usedapp/core'
import { CHAIN_ID } from 'config'
import { useEffect, useState } from 'react'

export default function useSdk() {
  const { account, library } = useEthers()
  const [sdk, setSdk] = useState<RinkebySdk | null>(null)

  useEffect(() => {
    if (library == null) {
      setSdk(null)
    } else {
      setSdk(CHAIN_ID === 4 ? getRinkebySdk(library) : (getMainnetSdk(library) as RinkebySdk))
    }
  }, [library])

  return sdk
}
