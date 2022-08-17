import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppHeader from 'components/app-header'
import { getMainnetSdk, getRinkebySdk, RinkebySdk } from '@dethcrypto/eth-sdk-client'
import AppFooter from 'components/app-footer'
import WalletConfig from '../components/WalletConfig'
import { DAppProvider, ChainId, Config, useEthers } from '@usedapp/core'
import { WebSocketProvider } from '@ethersproject/providers'
import config from '../config'
import { providers, Signer } from 'ethers'
import { useNounletTokenContract } from '../lib/utils/nounletContracts'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import {
  reduxSafeAuction,
  reduxSafeBid,
  reduxSafeNewAuction,
  useAuctionState
} from '../store/auction'
import { useDisplayAuction } from '../store/onDisplayAuction'
import { nounletPath } from '../lib/utils/history'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'

import { configureChains, chain } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { useEffect, useState } from 'react'

import useSWR, { SWRConfig, useSWRConfig } from 'swr'
import { useAuctionStateStore } from 'store/auctionStateStore'
import { generateNounletAuctionInfoKey } from 'hooks/useDisplayedNounlet'
import { getVaultData } from 'lib/graphql/queries'
import ChainUpdater from './ChainUpdater'

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4')
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
const BLOCKS_PER_DAY = 6_500

const useDappConfig: Config = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    // [ChainId.Rinkeby]: 'https://eth-rinkeby.alchemyapi.io/v2/WCQsygq3peGhgnTkPKsFj6OsWrLXgkzt',
    [ChainId.Rinkeby]: 'https://rinkeby.infura.io/v3/' + infuraId,
    [ChainId.Mainnet]: 'https://eth-mainnet.g.alchemy.com/v2/JBgRzZwEiE7Im5glhOhqaTHdtvEsHYNs'
  },
  autoConnect: true
}

const ChainUpdater2: React.FC = () => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const { account, library } = useEthers()
  const [sdk, setSdk] = useState<RinkebySdk | null>(null)
  const {
    setVaultAddress,
    setVaultTokenId,
    setLatestNounletId,
    setIsLoading,
    vaultAddress,
    vaultTokenAddress,
    vaultTokenId,
    latestNounletId
  } = useAuctionStateStore()

  const { data: serverData } = useSWR(`serverData`, () => {})

  // const {
  //   nounsToken,
  //   nounletAuction,
  //   nounletToken,
  //   nounletProtoform,
  //   optimisticBid,
  //   nounsDescriptiorV2,
  //   nounletGovernance
  // } = CHAIN_ID === 4 ? getRinkebySdk(library) : (getMainnetSdk(library) as RinkebySdk)

  useEffect(() => {
    if (library != null) {
      setSdk(CHAIN_ID === 4 ? getRinkebySdk(library) : (getMainnetSdk(library) as RinkebySdk))
    }
  }, [library])

  const { mutate: refreshNounletAuctionState } = useSWR(
    { name: 'NounletAuctionState' },
    async (args) => {
      console.log('SWR', { args })
      // Mock response

      return {
        vault: {
          id: '0x34f67ab3458eC703EBc2bd2683B117d8F0764614',
          noun: {
            id: '0',
            nounlets: [
              {
                id: '1',
                auction: {
                  amount: '300000000000000',
                  startTime: '1660726678',
                  endTime: '1660741078',
                  bidder: {
                    id: '0x6d2343beeced0e805f3cccff870ccb974b5795e6'
                  },
                  settled: true,
                  bids: [
                    {
                      id: '0x7a68646c9da387c30b75170240a7293170e6ca68055361d04b0baf3926b0dffa',
                      bidder: {
                        id: '0x497f34f8a6eab10652f846fd82201938e58d72e0'
                      },
                      amount: '100000000000000',
                      blockNumber: '11213957',
                      blockTimestamp: '1660674514'
                    },
                    {
                      id: '0xad69d23da6d90074f330359b4c9e62d14dcf2412b33e54c036a066196a067d62',
                      bidder: {
                        id: '0x497f34f8a6eab10652f846fd82201938e58d72e0'
                      },
                      amount: '200000000000000',
                      blockNumber: '11213984',
                      blockTimestamp: '1660674919'
                    },
                    {
                      id: '0xb8c83c018000653b2faca5761fd9014d41971a4217e573da600a1c359c10a4aa',
                      bidder: {
                        id: '0x6d2343beeced0e805f3cccff870ccb974b5795e6'
                      },
                      amount: '300000000000000',
                      blockNumber: '11214062',
                      blockTimestamp: '1660676089'
                    }
                  ]
                }
              },
              {
                id: '2',
                auction: {
                  amount: '0',
                  startTime: '1660741078',
                  endTime: '1660745078',
                  bidder: {
                    id: '0x6d2343beeced0e805f3cccff870ccb974b5795e6'
                  },
                  settled: false,
                  bids: []
                }
              }
            ]
          }
        }
      }

      // return {
      //   vaultAddress: '0x332F26aA917d20806954E8fAcCE349b5C3Ba0FDC',
      //   vaultTokenAddress: '0xdcb57d0a870e19ca4accb440e6fb54d41e86ffea',
      //   vaultTokenId: BigNumber.from(1),
      //   auctionInfo: {
      //     amount: BigNumber.from(0),
      //     bidder: '0x0000000000000000000000000000000000000000',
      //     endTime: BigNumber.from(0)
      //   },
      //   vaultInfo: {
      //     curator: '0xAa1660e1c0A6F7026de04A95576DB6Ee4Afb502C',
      //     currentId: BigNumber.from(0) // Default to 1 if 0 (first auction not started)
      //   }
      // }

      // return {
      //   vaultAddress: '0x332F26aA917d20806954E8fAcCE349b5C3Ba0FDC',
      //   vaultTokenAddress: '0xdcb57d0a870e19ca4accb440e6fb54d41e86ffea',
      //   vaultTokenId: BigNumber.from(1),
      //   auctionInfo: {
      //     amount: BigNumber.from(0),
      //     bidder: '0xAa1660e1c0A6F7026de04A95576DB6Ee4Afb502C',
      //     endTime: 1660099449
      //   },
      //   vaultInfo: {
      //     curator: '0xAa1660e1c0A6F7026de04A95576DB6Ee4Afb502C',
      //     currentId: BigNumber.from(1)
      //   }
      // }

      // const provider = new WebSocketProvider(config.app.wsRpcUri)
      // const { nounletAuction, nounletToken, nounletProtoform } =
      //   CHAIN_ID === 4 ? getRinkebySdk(provider) : (getMainnetSdk(provider) as RinkebySdk)

      // const [createdAuction] = await nounletAuction.queryFilter(
      //   nounletAuction.filters.Created(null, null, null)
      // )

      // if (createdAuction == null || createdAuction?.args?._vault == null) {
      //   console.log('no auction yet')
      //   return null
      // }

      // const vaultAddress = createdAuction.args._vault
      // // const vaultTokenAddress = createdAuction.args._token
      // const vaultTokenId = createdAuction.args._id
      // const auctionInfo = await nounletAuction.auctionInfo(vaultAddress, vaultTokenId)
      // const vaultInfo = await nounletAuction.vaultInfo(vaultAddress)

      // console.log({ auctionInfo, vaultInfo })
      // return {
      //   vaultAddress,
      //   // vaultTokenAddress,
      //   vaultTokenId,
      //   auctionInfo,
      //   vaultInfo
      // }
    },
    {
      onSuccess: (data) => {
        if (data == null) {
          console.log('Null data')
          return
        }

        console.log('Initial data finished', data)

        const latestNounlet = data.vault.noun.nounlets.at(-1)
        if (latestNounlet == null) return // shouldn't happen

        const latestNounletId = latestNounlet.id
        const latestAuction = latestNounlet.auction

        // prepopulate SWR cache
        data.vault.noun.nounlets.map((nounlet, index) => {
          if (index === data.vault.noun.nounlets.length - 1) {
            console.log('skip populating latest nounlet')
          }

          console.log('🍄 populating nounlet', index + 1)
          const key = generateNounletAuctionInfoKey({
            vaultAddress: data.vault.id,
            vaultTokenId: data.vault.noun.id,
            nounletId: `${index + 1}`
          })

          mutate(key, nounlet, {
            revalidate: false
          })

          console.log({ key })
        })

        setVaultAddress(data.vault.id)
        setVaultTokenId(data.vault.noun.id)
        setLatestNounletId(latestNounletId)
        setIsLoading(false)
      }
    }
  )

  useEffect(() => {
    console.log('sdk change', sdk)
    if (sdk == null) return
    if (
      vaultAddress == null ||
      vaultTokenAddress == null ||
      vaultTokenId == null ||
      latestNounletId == null
    )
      return

    const { nounletAuction } = sdk
    const settledFilter = nounletAuction.filters.Settled(
      vaultAddress,
      vaultTokenAddress,
      vaultTokenId
    )

    const handler = (event: any) => {
      console.log('event')
    }

    console.log('subbing')
    nounletAuction.on(settledFilter, handler)

    return () => {
      console.log('unsubbing')
      nounletAuction.off(settledFilter, handler)
    }
  }, [sdk, vaultAddress, vaultTokenAddress, vaultTokenId, latestNounletId])

  const loadState = async () => {
    console.log('load state')
    const provider = new WebSocketProvider(config.app.wsRpcUri)
    const { nounletAuction, nounletToken, nounletProtoform } =
      CHAIN_ID === 4 ? getRinkebySdk(provider) : (getMainnetSdk(provider) as RinkebySdk)

    const bidFilter = nounletAuction.filters.Bid(null, null, null, null, null)
    // const extendedFilter = nounletAuction.filters.AuctionExtended(null, null)
    const createdFilter = nounletAuction.filters.Created(null, null, null)
    const settledFilter = nounletAuction.filters.Settled(null, null, null)
    const deployFilter = nounletProtoform.filters.ActiveModules(null, null)
    // const [createdAuction] = await nounletAuction.queryFilter(createdFilter)
    const response = await nounletAuction.queryFilter(createdFilter)
    const [createdAuction] = response
    const [deployVault] = await nounletProtoform.queryFilter(createdFilter)

    console.log('createdAuction', response, createdAuction)
    const vaultAddress = createdAuction?.args?._vault
    // debugger
    if (vaultAddress) {
      const auctionInfo = await nounletAuction.auctionInfo(vaultAddress, 1)
      console.log({ auctionInfo })
      if (auctionInfo) {
        // setFullAuction(auctionInfo)
        // setLastAuctionNounId(0)
        // setLastAuctionStartTime(auctionInfo.startTime.toNumber())
        // setOnDisplayAuctionNounId(0)
        // setOnDisplayAuctionStartTime(auctionInfo.startTime.toNumber())
        // setFullAuction(reduxSafeAuction(currentAuction))
        // setLastAuctionNounId(currentAuction.nounId.toNumber())
      }
    }
    // setIsLoaded()

    // const processBidFilter = async (
    //   nounId: BigNumberish,
    //   sender: string,
    //   value: BigNumberish,
    //   extended: boolean,
    //   event: any
    // ) => {
    //   const timestamp = (await event.getBlock()).timestamp
    //   const transactionHash = event.transactionHash
    //   appendBid(reduxSafeBid({ nounId, sender, value, extended, transactionHash, timestamp }))
    // }
    // const processAuctionCreated = (
    //   nounId: BigNumberish,
    //   startTime: BigNumberish,
    //   endTime: BigNumberish
    // ) => {
    //   // setActiveAuction(reduxSafeNewAuction({ nounId, startTime, endTime, settled: false }))
    //   const nounIdNumber = BigNumber.from(nounId).toNumber()
    //   const startTimeNumber = BigNumber.from(startTime).toNumber()
    //   router.push(nounletPath(nounIdNumber))
    //   setOnDisplayAuctionNounId(nounIdNumber)
    //   setOnDisplayAuctionStartTime(startTimeNumber)

    //   setLastAuctionNounId(nounIdNumber)
    //   setLastAuctionStartTime(startTimeNumber)
    // }
    // const processAuctionExtended = (nounId: BigNumberish, endTime: BigNumberish) => {
    //   setAuctionExtended({ nounId, endTime })
    // }
    // const processAuctionSettled = (nounId: BigNumberish, winner: string, amount: BigNumberish) => {
    //   setAuctionSettled({ nounId, amount, winner })
    // }

    // Fetch the previous 24hours of  bids
    // const previousBids = await nounletAuction.queryFilter(bidFilter, 0 - BLOCKS_PER_DAY)
    // for (const event of previousBids) {
    //   if (event.args === undefined) return
    // processBidFilter(...(event.args as [BigNumber, string, BigNumber, boolean]), event);
    // }

    // nounletAuction.on(bidFilter, (nounId, sender, value, extended, event) =>
    //   processBidFilter(nounId, sender, value, false, event)
    // )
    // nounletAuction.on(createdFilter, (nounId, startTime, endTime) =>
    //   processAuctionCreated(nounId, startTime, endTime)
    // )
    // nounletAuction.on(extendedFilter, (nounId, endTime) => processAuctionExtended(nounId, endTime))
    // nounletAuction.on(settledFilter, (nounId, winner, amount) =>
    //   processAuctionSettled(nounId, winner, amount)
    // )
  }

  const testMutate = async () => {
    const apiResponse = await getVaultData(vaultAddress)
    console.log('🦚', { apiResponse })

    // const provider = new WebSocketProvider(config.app.wsRpcUri)
    // const { nounletAuction } =
    //   CHAIN_ID === 4 ? getRinkebySdk(provider) : (getMainnetSdk(provider) as RinkebySdk)

    // // const bidFilter = nounletAuction.filters
    // //   .Bid
    // //   // null, // vaultAddress,
    // //   // null, //vaultTokenAddress,
    // //   // null, //BigNumber.from(vaultTokenId),
    // //   // null,
    // //   // null
    // //   ()
    // console.log(nounletAuction.filters.Bid())
    // const previousBids = await nounletAuction.queryFilter(nounletAuction)
    // console.log(previousBids)

    // const result = await mutate('test', [1, 3, 4, 5, 6, 6])
    // console.log('awaited', result)
  }

  return (
    <>
      <button onClick={() => testMutate()}>(Re)load curret nounlet auction state</button>
    </>
  )
}

// console.log('infura id', infuraId)

// const { chains, provider, webSocketProvider } = configureChains(
//   [chain.mainnet, chain.rinkeby],
//   [infuraProvider({ infuraId })]
// )

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        dedupingInterval: 2000, // 10 * 60 * 1000, // 10 min dedup
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      }}
    >
      <DAppProvider config={useDappConfig}>
        <ChainUpdater />
        <WalletConfig>
          <Toaster />
          <div className="bg-gray-1">
            <AppHeader />
          </div>
          <div id="backdrop-root"></div>
          <div id="overlay-root"></div>
          <Component {...pageProps} />
          <AppFooter />
        </WalletConfig>
      </DAppProvider>
    </SWRConfig>
  )

  // return (
  //     <DAppProvider config={useDappConfig}>
  //         <div id="backdrop-root"></div>
  //         <div id="overlay-root"></div>
  //         <WalletConfig>
  //             <Component {...pageProps} />
  //         </WalletConfig>
  //     </DAppProvider>
  // )
}

export default MyApp
