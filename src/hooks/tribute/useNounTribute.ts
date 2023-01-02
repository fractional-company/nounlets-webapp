import { getGoerliSdk } from '@dethcrypto/eth-sdk-client'
import { useEthers } from '@usedapp/core'
import { IS_DEVELOP } from 'config'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import txWithErrorHandling from 'src/lib/utils/txWithErrorHandling'
import { useSWRConfig } from 'swr'
import useSdk from '../utils/useSdk'

export default function useNounTribute() {
  const { account, library } = useEthers()
  const sdk = useSdk()
  const { mutate: mutateGlobal } = useSWRConfig()

  const mutateNounsInWalletList = useCallback(
    (address?: string) => {
      mutateGlobal(`wallet/${account!.toLowerCase()}`)
    },
    [account, mutateGlobal]
  )

  const mutateTributedList = useCallback(
    (address?: string) => {
      mutateGlobal('nouns/tributes')
    },
    [mutateGlobal]
  )

  const mintANoun = useCallback(async () => {
    if (!IS_DEVELOP) throw new Error('sorry, only in dev')
    if (library == null || sdk == null || account == null) throw new Error('sdk or account missing')

    const mintHelper = getGoerliSdk(library).v2.nounlets.MintHelper.connect(library.getSigner())
    const nounsToken = getGoerliSdk(library).v2.nounlets.NounsToken

    const tx = await mintHelper.mint()
    return txWithErrorHandling(tx)
  }, [sdk, library, account])

  const tributeNoun = useCallback(
    async (nounId: string) => {
      console.log('tributing', nounId)
      const nounsToken = sdk.NounsToken.connect(library!.getSigner())
      const nounletProtoform = sdk.NounletProtoform

      const tx = await nounsToken.approve(nounletProtoform.address, nounId)
      return txWithErrorHandling(tx, 2)
    },
    [sdk, library]
  )

  const removeTributedNoun = useCallback(
    async (nounId: string) => {
      console.log('un-tributing', nounId)
      const nounsToken = sdk.NounsToken.connect(library!.getSigner())
      const tx = await nounsToken.approve(ethers.constants.AddressZero, nounId)
      return txWithErrorHandling(tx, 2)
    },
    [sdk, library]
  )

  return {
    mintANoun,
    tributeNoun,
    removeTributedNoun,
    mutateNounsInWalletList,
    mutateTributedList
  }
}
