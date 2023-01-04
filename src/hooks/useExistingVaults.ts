import { useEthers } from '@usedapp/core'
import { NEXT_PUBLIC_MAX_NOUNLETS, NEXT_PUBLIC_REJECTION_PERIOD } from 'config'
import { Provider as MulticallProvider } from 'ethers-multicall'
import { getVaultList } from 'graphql/src/queries'
import useSdk from 'src/hooks/utils/useSdk'
import useSWR from 'swr'

import { BigNumber, ethers } from 'ethers'
import { getBatchNounBidInfo } from 'src/lib/utils/buyoutInfoUtils'

const tmpObj = {
  state: 'AUCTION_IN_PROGRESS',
  id: '0x120287afe666d557974affe201c3de3e5a9e564e',
  nounInVault: true,
  token: {
    id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b',
    __typename: 'Token'
  },
  noun: {
    id: '37',
    currentDelegate: '0x0000000000000000000000000000000000000000',
    nounlets: [
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-1',
        auction: {
          startTime: '1670860392',
          endTime: '1670860392',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-2',
        auction: {
          startTime: '1670862924',
          endTime: '1670862924',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-3',
        auction: {
          startTime: '1670936700',
          endTime: '1670936700',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-4',
        auction: {
          startTime: '1670936772',
          endTime: '1670936772',
          highestBidAmount: '0',
          settled: false,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      }
    ],
    __typename: 'Noun'
  },
  __typename: 'Vault',
  buyoutInfo: {
    state: 0,
    proposer: '0x0000000000000000000000000000000000000000',
    ethBalance: {
      type: 'BigNumber',
      hex: '0x00'
    },
    fractionPrice: {
      type: 'BigNumber',
      hex: '0x00'
    },
    lastTotalSupply: {
      type: 'BigNumber',
      hex: '0x00'
    },
    startTime: {
      type: 'BigNumber',
      hex: '0x00'
    },
    endTime: {
      type: 'BigNumber',
      hex: '0x6345d440'
    }
  }
}

const tmpObjAuctionInProgress = {
  state: 'AUCTION_IN_PROGRESS',
  id: '0x120287afe666d557974affe201c3de3e5a9e564e',
  nounInVault: true,
  token: {
    id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b',
    __typename: 'Token'
  },
  noun: {
    id: '2',
    currentDelegate: '0x0000000000000000000000000000000000000000',
    nounlets: [
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-1',
        auction: {
          startTime: '1670860392',
          endTime: '1670860392',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-2',
        auction: {
          startTime: '1670862924',
          endTime: '1670862924',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-3',
        auction: {
          startTime: '1670936700',
          endTime: '1670936700',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-4',
        auction: {
          startTime: '1670936772',
          endTime: '1670936772',
          highestBidAmount: '0',
          settled: false,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      }
    ],
    __typename: 'Noun'
  },
  __typename: 'Vault',
  buyoutInfo: {
    state: 0,
    proposer: '0x0000000000000000000000000000000000000000',
    ethBalance: {
      type: 'BigNumber',
      hex: '0x016bcc41e90000'
    },
    fractionPrice: {
      type: 'BigNumber',
      hex: '0x5af3107a4000'
    },
    lastTotalSupply: {
      type: 'BigNumber',
      hex: '0x05'
    },
    startTime: {
      type: 'BigNumber',
      hex: '0x6345d440'
    }
  }
}

const tmpObjBuyoutInProgress = {
  state: 'BUYOUT_IN_PROGRESS',
  id: '0x120287afe666d557974affe201c3de3e5a9e564e',
  nounInVault: true,
  token: {
    id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b',
    __typename: 'Token'
  },
  noun: {
    id: '2',
    currentDelegate: '0x0000000000000000000000000000000000000000',
    nounlets: [
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-1',
        auction: {
          startTime: '1670860392',
          endTime: '1670860392',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-2',
        auction: {
          startTime: '1670862924',
          endTime: '1670862924',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-3',
        auction: {
          startTime: '1670936700',
          endTime: '1670936700',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-4',
        auction: {
          startTime: '1670936772',
          endTime: '1670936772',
          highestBidAmount: '0',
          settled: false,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-5',
        auction: {
          startTime: '1670936772',
          endTime: '1670936772',
          highestBidAmount: '0',
          settled: false,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      }
    ],
    __typename: 'Noun'
  },
  __typename: 'Vault',
  buyoutInfo: {
    state: 1,
    proposer: '0x0000000000000000000000000000000000000000',
    ethBalance: {
      type: 'BigNumber',
      hex: '0x016bcc41e90000'
    },
    fractionPrice: {
      type: 'BigNumber',
      hex: '0x5af3107a4000'
    },
    lastTotalSupply: {
      type: 'BigNumber',
      hex: '0x05'
    },
    startTime: {
      type: 'BigNumber',
      hex: '0x6345d440'
    },
    endTime: {
      type: 'BigNumber',
      hex: '0x6345d440'
    }
  }
}

export type VaultData = Awaited<ReturnType<typeof getVaultList>>['vaults'][0] & {
  buyoutInfo: {
    state: number
    proposer: string
    ethBalance: BigNumber
    fractionPrice: BigNumber
    lastTotalSupply: BigNumber
    startTime: BigNumber
    endTime: BigNumber
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
    sdk && library && 'ExistingVaults',
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
              startTime: BigNumber.from(0),
              endTime: BigNumber.from(0)
            }
          }
        })

      console.log('Multicall start')
      const vaultsInProgress = transformed.filter((vault) => vault.state === 'BUYOUT_IN_PROGRESS')
      const bidInfoResult = await getBatchNounBidInfo(
        sdk!,
        new MulticallProvider(library!),
        vaultsInProgress.map((vault) => vault.id)
      )
      console.log('Multicall end')

      vaultsInProgress.forEach((vault, index) => {
        vault.buyoutInfo = {
          ...bidInfoResult[index],
          endTime: bidInfoResult[index].startTime.add(NEXT_PUBLIC_REJECTION_PERIOD)
        }
      })

      console.log({ transformed })

      // transformed.push(tmpObjBuyoutInProgress)

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
          } else if (v.buyoutInfo.state === 1) {
            splitData.buyoutInProgress.push(v)
          } else {
            splitData.finished.push(v)
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
    {
      dedupingInterval: 10000,
      refreshInterval(latestData) {
        return 60000
      }
    }
  )

  return {
    ...swrHook
  }
}
