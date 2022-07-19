import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppHeader from 'components/app-header'
import { getMainnetSdk } from '@dethcrypto/eth-sdk-client'
import AppFooter from 'components/app-footer'
import WalletConfig from "../components/WalletConfig";
import {DAppProvider, ChainId} from "@usedapp/core";

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet | ChainId.Hardhat

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4')

const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [ChainId.Rinkeby]: 'https://eth-rinkeby.alchemyapi.io/v2/oj6wP54JEn9E4QLpWJDr4Z7AvMZOjnad',
    [ChainId.Mainnet]: 'https://eth-mainnet.alchemyapi.io/v2/jO-pIswuUui5ipthjbcIOZEeuuxWibBd',
    [ChainId.Hardhat]: 'http://localhost:8545'
  }
}
function MyApp({ Component, pageProps }: AppProps) {
  return (
      <DAppProvider config={useDappConfig}>
          <WalletConfig>
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
