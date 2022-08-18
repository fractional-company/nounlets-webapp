import { ChainId, Config, DAppProvider } from '@usedapp/core'
import AppFooter from 'components/app-footer'
import AppHeader from 'components/app-header'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import WalletConfig from '../components/WalletConfig'
import '../styles/globals.css'

import { SWRConfig } from 'swr'
import ChainUpdater from './ChainUpdater'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'

dayjs.extend(duration)
dayjs.extend(utc)

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4')
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

const useDappConfig: Config = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    // [ChainId.Rinkeby]: 'https://eth-rinkeby.alchemyapi.io/v2/WCQsygq3peGhgnTkPKsFj6OsWrLXgkzt',
    [ChainId.Rinkeby]: 'https://rinkeby.infura.io/v3/' + infuraId,
    [ChainId.Mainnet]: 'https://eth-mainnet.g.alchemy.com/v2/JBgRzZwEiE7Im5glhOhqaTHdtvEsHYNs'
  },
  autoConnect: true
}

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
