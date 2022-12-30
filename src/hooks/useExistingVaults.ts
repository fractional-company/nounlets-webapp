import { useEthers } from '@usedapp/core'
import { NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import { Provider as MulticallProvider } from 'ethers-multicall'
import { getVaultList } from 'graphql/src/queries'
import useSdk from 'src/hooks/utils/useSdk'
import useSWR from 'swr'

import { BigNumber, ethers } from 'ethers'
import { getBatchNounBidInfo } from 'src/lib/utils/buyoutInfoUtils'

export type VaultData = Awaited<ReturnType<typeof getVaultList>>['vaults'][0] & {
  buyoutInfo: {
    state: number
    proposer: string
    ethBalance: BigNumber
    fractionPrice: BigNumber
    lastTotalSupply: BigNumber
    startTime: BigNumber
  }
}

type VaultBuckets = {
  idle: VaultData[]
  auctionInProgress: VaultData[]
  buyoutIdle: VaultData[]
  buyoutInProgress: VaultData[]
  finished: VaultData[]
}

type ExistingVaultsData = {
  buckets: VaultBuckets
} & Awaited<ReturnType<typeof getVaultList>>

export default function useExistingVaults() {
  const sdk = useSdk()
  const { library } = useEthers()

  const swrHook = useSWR(
    library && 'ExistingVaults',
    async () => {
      const result = await getVaultList()
      console.log({ result })

      const transformed = result.vaults
        .map((vault) => {
          // console.log({ vault })

          if (vault.noun == null) {
            if (!vault.nounInVault) {
              return {
                state: 'FINISHED',
                ...vault
              }
            }

            return {
              state: 'IDLE',
              ...vault
            }
          }

          // We are at the last nounlet. Was the auction settled?
          if (vault.noun.nounlets.length === NEXT_PUBLIC_MAX_NOUNLETS) {
            const last = vault.noun.nounlets.at(-1)
            if (last!.auction.settled) {
              return {
                state: 'BUYOUT_IN_PROGRESS',
                ...vault
              }
            }
          }

          // Auctions still in progress
          return {
            state: 'AUCTION_IN_PROGRESS',
            ...vault
          }
        })
        .map((vault) => {
          return {
            ...vault,
            buyoutInfo: {
              state: 0,
              proposer: ethers.constants.AddressZero,
              ethBalance: BigNumber.from(0),
              fractionPrice: BigNumber.from(0),
              lastTotalSupply: BigNumber.from(0),
              startTime: BigNumber.from(0)
            }
          }
        })

      // console.log('Multicall start')
      // const vaultsInProgress = transformed.filter((vault) => vault.state === 'BUYOUT_IN_PROGRESS')
      // const bidInfoResult = await getBatchNounBidInfo(
      //   sdk!,
      //   new MulticallProvider(library!),
      //   vaultsInProgress.map((vault) => vault.id)
      // )
      // console.log('Multicall end')

      // vaultsInProgress.forEach((vault, index) => {
      //   vault.buyoutInfo = bidInfoResult[index]
      // })

      console.log({ transformed })

      const splitData: VaultBuckets = {
        idle: [],
        auctionInProgress: [],
        buyoutIdle: [],
        buyoutInProgress: [],
        finished: []
      }

      transformed.forEach((v) => {
        if (v.state === 'IDLE') {
          splitData.idle.push(v)
        }
        if (v.state === 'AUCTION_IN_PROGRESS') {
          splitData.auctionInProgress.push(v)
        }
        if (v.state === 'BUYOUT_IN_PROGRESS') {
          if (v.buyoutInfo.state === 0) {
            splitData.buyoutIdle.push(v)
          } else {
            splitData.buyoutInProgress.push(v)
          }
        }
        if (v.state === 'FINISHED') {
          splitData.finished.push(v)
        }
      })

      console.log(splitData)

      return {
        ...result,
        vaults: transformed,
        buckets: splitData
      } as ExistingVaultsData
    },
    {}
  )

  return {
    ...swrHook
  }
}