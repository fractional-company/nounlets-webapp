import { NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import { BigNumber } from 'ethers'
import { getVaultData } from 'graphql/src/queries'
import { useEffect, useState } from 'react'
import useSdk from 'src/hooks/utils/useSdk'
import { useNounStore } from 'src/store/noun.store'
import { useNounletStore } from 'src/store/nounlet.store'
import useSWR from 'swr'

export function useNounData(enabled: boolean, callback?: (data: any) => void) {
  const sdk = useSdk()
  const {
    isLive,
    isLoading,
    nounletTokenAddress,
    vaultAddress,
    nounTokenId,
    latestNounletTokenId,
    isGovernanceEnabled,
    setIsReady,
    setIsLive,
    setIsLoading,
    setVaultAddress,
    setWereAllNounletsAuctioned,
    setVaultCuratorAddress,
    setNounTokenId,
    setCurrentDelegate,
    setNounletTokenAddress,
    setBackendLatestNounletTokenId,
    setLatestNounletTokenId,
    setIsGovernanceEnabled
  } = useNounStore()

  // useEffect(() => {
  //   console.log('ran', nounTokenId)
  //   setIsLive(false)
  //   setIsLoading(true)
  // }, [nounTokenId])

  const { data, mutate } = useSWR(
    enabled && sdk && nounTokenId != null && `noun/${nounTokenId}`,
    async (key) => {
      // console.log('useNounData fetcher ran', key)
      const vaultData = await getVaultData(nounTokenId!)

      if (vaultData == null) throw new Error('vault not found')

      const vaultInfo = await sdk!.NounletAuction.vaultInfo(vaultData.vaultAddress)

      const tmp = {
        ...vaultInfo,
        blockchainCurrentID: vaultInfo.currentId
      }

      // Don't go past max nounlets - SC goes on after 100
      if (+tmp.currentId.toString() >= NEXT_PUBLIC_MAX_NOUNLETS) {
        tmp.currentId = BigNumber.from(NEXT_PUBLIC_MAX_NOUNLETS)
        tmp.blockchainCurrentID = tmp.currentId
      }

      // If BE has lower nounletId than BC, just set it to the BE value
      if (+tmp.currentId.toString() > vaultData.nounletCount) {
        console.log(
          'BE is behind, wait up',
          tmp.currentId.toString(),
          vaultData.nounletCount.toString()
        )
        tmp.currentId = BigNumber.from(vaultData.nounletCount)
      }

      return {
        ...vaultData,
        ...tmp
      }
    },
    {
      refreshInterval: 5 * 60000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.status === 404) return
        if (error.message === 'vault not found') {
          console.log('🐉 Checking for vault again in 30 seconds 🐉')
          setTimeout(() => revalidate({ retryCount }), 30000)
          return
        }
        if (retryCount >= 3) return
        setTimeout(() => revalidate({ retryCount }), 5000)
      },
      onSuccess: (data, key, config) => {
        console.groupCollapsed('🏴 fetched vault metadata ...')
        console.table(data)
        console.groupEnd()

        if (data.isLive) {
          setVaultAddress(data.vaultAddress)
          setNounletTokenAddress(data.nounletTokenAddress)
          setNounTokenId(data.nounTokenId)
          setVaultCuratorAddress(data.curator)
          setCurrentDelegate(data.backendCurrentDelegate)
          setBackendLatestNounletTokenId(`${data.nounletCount}`)
          setLatestNounletTokenId(`${data.currentId.toString()}`)
          setWereAllNounletsAuctioned(data.wereAllNounletsAuctioned)
          setIsLive(true)
          setIsLoading(false)
          setIsGovernanceEnabled(!data.wereAllNounletsAuctioned || isGovernanceEnabled)
        } else {
          console.log('Server returned null')
          // Retry after 15 seconds.
          setTimeout(() => mutate(), 15000)
        }

        if (!data.currentId.eq(data.blockchainCurrentID)) {
          console.log(
            'Server is behind, try again in 15 sec',
            data.currentId,
            data.blockchainCurrentID
          )
          setTimeout(() => mutate(), 15000)
        }

        if (callback) {
          callback(data)
        }
      }
    }
  )
}
