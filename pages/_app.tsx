import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppHeader from 'components/app-header'
import { getMainnetSdk, getRinkebySdk, RinkebySdk } from '@dethcrypto/eth-sdk-client'
import AppFooter from 'components/app-footer'
import WalletConfig from '../components/WalletConfig'
import { DAppProvider, ChainId, Config, useEthers } from '@usedapp/core'
import { WebSocketProvider } from '@ethersproject/providers'
import config from '../config'
import { providers, Signer} from 'ethers'
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
import {useEffect} from "react";

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4')

const useDappConfig: Config = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [ChainId.Rinkeby]: 'https://eth-rinkeby.alchemyapi.io/v2/WCQsygq3peGhgnTkPKsFj6OsWrLXgkzt',
    [ChainId.Mainnet]: 'https://eth-mainnet.g.alchemy.com/v2/JBgRzZwEiE7Im5glhOhqaTHdtvEsHYNs',
  },
  autoConnect: true
}

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;
const BLOCKS_PER_DAY = 6_500;

const ChainUpdater: React.FC = () => {
  const router = useRouter()
  const { setActiveAuction, setFullAuction, appendBid, setAuctionSettled, setAuctionExtended } =
    useAuctionState()
  const {
    setOnDisplayAuctionNounId,
    setOnDisplayAuctionStartTime,
    setLastAuctionNounId,
    setLastAuctionStartTime
  } = useDisplayAuction()

  useEffect(() => {
    loadState()
  }, [])

  const loadState = async () => {
    const provider = new WebSocketProvider(config.app.wsRpcUri)
    const { nounletAuction, nounletToken } =
      CHAIN_ID === 4 ? getRinkebySdk(provider) : (getMainnetSdk(provider) as RinkebySdk)

    const bidFilter = nounletAuction.filters.AuctionBid(null, null, null, null, null)
    const extendedFilter = nounletAuction.filters.AuctionExtended(null, null)
    const createdFilter = nounletAuction.filters.AuctionCreated(null, null, null)
    const settledFilter = nounletAuction.filters.AuctionSettled(null, null, null)
    const [createdAuction] = await nounletAuction.queryFilter(createdFilter)
    const vaultAddress = createdAuction?.args?._vault
    if (vaultAddress) {
      const auctionInfo = await nounletAuction.auctionInfo(vaultAddress)
      if (auctionInfo) {
        setFullAuction(auctionInfo)
        setLastAuctionNounId(0)
        setLastAuctionStartTime(auctionInfo.startTime.toNumber())
        setOnDisplayAuctionNounId(0)
        setOnDisplayAuctionStartTime(auctionInfo.startTime.toNumber())
        // setFullAuction(reduxSafeAuction(currentAuction))
        // setLastAuctionNounId(currentAuction.nounId.toNumber())
      }
    }

    const processBidFilter = async (
      nounId: BigNumberish,
      sender: string,
      value: BigNumberish,
      extended: boolean,
      event: any
    ) => {
      const timestamp = (await event.getBlock()).timestamp
      const transactionHash = event.transactionHash
      appendBid(reduxSafeBid({ nounId, sender, value, extended, transactionHash, timestamp }))
    }
    const processAuctionCreated = (
      nounId: BigNumberish,
      startTime: BigNumberish,
      endTime: BigNumberish
    ) => {
      // setActiveAuction(reduxSafeNewAuction({ nounId, startTime, endTime, settled: false }))
      const nounIdNumber = BigNumber.from(nounId).toNumber()
      const startTimeNumber = BigNumber.from(startTime).toNumber()
      router.push(nounletPath(nounIdNumber))
      setOnDisplayAuctionNounId(nounIdNumber)
      setOnDisplayAuctionStartTime(startTimeNumber)

      setLastAuctionNounId(nounIdNumber)
      setLastAuctionStartTime(startTimeNumber)
    }
    const processAuctionExtended = (nounId: BigNumberish, endTime: BigNumberish) => {
      setAuctionExtended({ nounId, endTime })
    }
    const processAuctionSettled = (nounId: BigNumberish, winner: string, amount: BigNumberish) => {
      setAuctionSettled({ nounId, amount, winner })
    }


    // Fetch the previous 24hours of  bids
    const previousBids = await nounletAuction.queryFilter(bidFilter, 0 - BLOCKS_PER_DAY)
    for (const event of previousBids) {
      if (event.args === undefined) return
      // processBidFilter(...(event.args as [BigNumber, string, BigNumber, boolean]), event);
    }

    nounletAuction.on(bidFilter, (nounId, sender, value, extended, event) =>
      processBidFilter(nounId, sender, value, false, event)
    )
    nounletAuction.on(createdFilter, (nounId, startTime, endTime) =>
      processAuctionCreated(nounId, startTime, endTime)
    )
    nounletAuction.on(extendedFilter, (nounId, endTime) => processAuctionExtended(nounId, endTime))
    nounletAuction.on(settledFilter, (nounId, winner, amount) =>
      processAuctionSettled(nounId, winner, amount)
    )
  }

  return <></>
}

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.rinkeby],
  [infuraProvider({infuraId})]
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
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
