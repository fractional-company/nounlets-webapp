import { getVaultList } from 'graphql/src/queries'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import { NounImage } from 'src/components/common/NounletImage'
import useSWR from 'swr'
import { sleep } from 'radash'
import { NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import { Contract, Provider as MulticallProvider } from 'ethers-multicall'
import { useCalls as executeCalls, useEthers } from '@usedapp/core'
import useSdk, { NounletsSDK } from 'src/hooks/utils/useSdk'

import NounletAuctionABI from 'eth-sdk/abis/goerli/v2/nounlets/NounletAuction.json'
import OptimisticBidABI from 'eth-sdk/abis/goerli/v2/nounlets/OptimisticBid.json'
import { BigNumber, ethers, Contract as EthersContract } from 'ethers'
import { getGoerliSdk } from '@dethcrypto/eth-sdk-client'
import { getBatchNounBidInfo } from 'src/lib/utils/buyoutInfoUtils'

const Home: NextPage<{ url: string }> = () => {
  const sdk = useSdk()
  const { library } = useEthers()
  // const neki = useQuery(
  //   ['neki', 2],
  //   async ({ queryKey }) => {
  //     console.log('hi', queryKey)
  //     await sleep(1000)
  //     return 42
  //   },
  //   {
  //     enabled: true,
  //     cacheTime: 0,
  //     onSuccess(data) {
  //       console.log('1', data)
  //     }
  //   }
  // )

  // const neki2 = useQuery(['neki', 2], {
  //   onSuccess(data) {
  //     console.log('2', data)
  //   }
  // })

  // console.log({ neki, neki2 })

  const { data } = useSWR(
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

      const vaultsInProgress = transformed.filter((vault) => vault.state === 'BUYOUT_IN_PROGRESS')
      const bidInfoResult = await getBatchNounBidInfo(
        sdk!,
        new MulticallProvider(library!),
        vaultsInProgress.map((vault) => vault.id)
      )

      vaultsInProgress.forEach((vault, index) => {
        vault.buyoutInfo = bidInfoResult[index]
      })

      console.log({ transformed })

      const splitData: { [key: string]: any[] } = {
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

      return {
        ...result,
        vaults: transformed,
        buckets: splitData
      }
    },
    {}
  )

  useEffect(() => {
    console.log({ buckets: data?.buckets })
  }, [data])

  const tmpData = useMemo(() => {
    if (data == null) return []

    const list = data.vaults
      // .sort((a, b) => {
      //   const aId = +(a.noun?.id || 0)
      //   const bId = +(b.noun?.id || 0)

      //   return bId - aId
      // })
      .filter((vault) => vault.noun != null)

    return list
  }, [data])

  // Nounlets on auction now

  const vaultList = useMemo(() => {
    const list = tmpData.map((vault) => {
      return <VaultListTile vaultId={vault.id} nounId={vault.noun!.id} key={vault.id} />
    })

    return <div className="grid grid-cols-4 gap-4">{list}</div>
  }, [tmpData])

  const testMulticall = async () => {
    // const provider = ethers.getDefaultProvider()
    if (sdk == null || library == null) return
    if (data == null) return

    const vaults = data.vaults.slice(0, 5).map((vault) => {
      return vault.id
    })

    const result = await getBatchNounBidInfo(
      sdk,
      new MulticallProvider(library),
      data.vaults.slice(0, 5).map((vault) => vault.id)
    )

    console.log({ result })
    // console.log('testing', sdk.OptimisticBid.address, OptimisticBidABI, library)
    // const ethcallProvider = new MulticallProvider(library)
    // await ethcallProvider.init()

    // const uniswapDaiPool = '0x2a1530c4c41db0b0b2bb646cb5eb1a67b7158667'
    // const ethBalanceCall = ethcallProvider.getEthBalance(uniswapDaiPool)

    // const cc2 = new Contract(sdk.NounletAuction.address, NounletAuctionABI)
    // const cc = new Contract(sdk.OptimisticBid.address, OptimisticBidABI.slice(0, -1))
    // const vaults = data.vaults.slice(0, 5).map((vault) => {
    //   return vault.id
    // })

    // const calls = vaults.map((vault) => {
    //   return cc.bidInfo(vault)
    // })

    // const response = await provider.getBlockNumber()
    // console.log({ response })

    // const call = cc.vaultInfo('0x120287afe666d557974affe201c3de3e5a9e564e')
    // const call2 = cc.vaultInfo('0x120287afe666d557974affe201c3de3e5a9e564e')
    // const test = sdk.NounletAuction.functions.vaultInfo(
    //   '0x120287afe666d557974affe201c3de3e5a9e564e'
    // )

    // const response = ['0x497F34f8A6EaB10652f846fD82201938e58d72E0', BigNumber.from('10')] as any
    // response.curator = '0x497F34f8A6EaB10652f846fD82201938e58d72E0'
    // response.currentId = BigNumber.from('10')

    // const parsed = (response as unknown) as Awaited<ReturnType<typeof sdk.NounletAuction.vaultInfo>>
    // console.log(parsed)

    // const vaultInfoArray = (await ethcallProvider.all(calls)) as Awaited<
    //   ReturnType<typeof sdk.NounletAuction.vaultInfo>
    // >[]

    // console.log(vaultInfoArray)
    // console.log(ethBalance, response)

    // const test = sdk.NounletAuction.callStatic.vaultInfo(
    //   '0x120287afe666d557974affe201c3de3e5a9e564e'
    // )

    // const result = await test
    // console.log(result)
  }

  return (
    <div className="page-home w-screen">
      <div className="space-y-4 px-6 pt-4 pb-12 text-center">
        <h1 className="font-londrina text-[64px] font-900 leading-[70px]" onClick={testMulticall}>
          OWN A PIECE OF A NOUN
        </h1>
        <p className="font-londrina text-[34px] font-900 leading-[40px] text-[#202A46]">
          Each Noun is split in 100 pieces = 100 Nounlets
        </p>
        <p className="font-londrina text-[30px] font-900 leading-[36px] text-[#313C5C]">
          Nounlets are put on auction every 25 min
        </p>
        <p className="font-londrina text-[16px] font-900 leading-[18px] text-[#58627E] opacity-60">
          When 100 Nounlets of a Noun are sold, a buyout for the Noun is possible
        </p>
      </div>

      <div className="bg-black px-6 py-12">
        <h2 className="text-center font-londrina text-[48px] font-900 leading-[52px] text-gray-0.5">
          Nounlets ON AUCTION now!
        </h2>
        <div>{/* <TmpNounCard /> */}</div>
      </div>

      <div className="p-4">{vaultList}</div>
    </div>
  )
}

export default Home

function VaultListTile(props: { vaultId: string; nounId: string }) {
  return (
    <Link href={`/noun/${props.nounId}`}>
      <div className="vault-list-tile flex cursor-pointer flex-col gap-3 rounded-xl bg-gray-1 p-2">
        <div>
          <NounImage id={props.nounId} />
        </div>
        <p className={'text-center font-londrina text-px28 font-700'}>{props.nounId}</p>
      </div>
    </Link>
  )
}
