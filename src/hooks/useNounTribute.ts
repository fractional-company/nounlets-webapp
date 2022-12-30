import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import { useSWRConfig } from 'swr'
import useSdk from './utils/useSdk'

export default function useNounTribute() {
  const { account, library } = useEthers()
  const sdk = useSdk()
  const { mutate: mutateGlobal } = useSWRConfig()

  const mutateNounsInWalletList = useCallback(
    (address: string) => {
      mutateGlobal(`wallet/${account!.toLowerCase()}`)
    },
    [account, mutateGlobal]
  )

  const mutateTributedList = useCallback(
    (address: string) => {
      mutateGlobal('nouns/tributes')
    },
    [mutateGlobal]
  )

  const tributeNoun = useCallback(
    async (nounId: string) => {
      console.log('tributing', nounId)
      const nounsToken = sdk.NounsToken.connect(library!.getSigner())
      const nounletProtoform = sdk.NounletProtoform

      const tx = await nounsToken.approve(nounletProtoform.address, nounId)
      const result = await tx.wait()
      return result
    },
    [sdk, library]
  )

  const removeTributedNoun = useCallback(
    async (nounId: string) => {
      console.log('un-tributing', nounId)
      const nounsToken = sdk.NounsToken.connect(library!.getSigner())
      const tx = await nounsToken.approve(ethers.constants.AddressZero, nounId)
      const result = await tx.wait()
      return result
    },
    [sdk, library]
  )

  return {
    tributeNoun,
    removeTributedNoun,
    mutateNounsInWalletList,
    mutateTributedList
  }
}
