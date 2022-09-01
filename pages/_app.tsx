import { ChainId, Config, DAppProvider, useEthers } from '@usedapp/core'
import AppFooter from 'components/app-footer'
import AppHeader from 'components/app-header'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import WalletConfig from '../components/WalletConfig'
import '../styles/globals.css'

import { SWRConfig } from 'swr'
import ChainUpdater from '../components/ChainUpdater'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import { NEXT_PUBLIC_CACHE_VERSION, NEXT_PUBLIC_NOUN_VAULT_ADDRESS } from 'config'
import { useAppStore } from 'store/application'
import CongratulationsModal from 'components/modals/congratulations-modal'
import useLocalStorage from 'hooks/useLocalStorage'

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(relativeTime)

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet

export const CHAIN_ID: SupportedChains = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '1')
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

// const cacheVersion = NEXT_PUBLIC_CACHE_VERSION
// const cacheKey = `nounlets-cache/v${cacheVersion}/${NEXT_PUBLIC_NOUN_VAULT_ADDRESS}`
// function localStorageProvider() {
//   return new Map()
//   if (typeof window === 'undefined') return new Map([])
//   if (cacheVersion === -1) {
//     // escape hatch if something goes wrong with the cache entirely
//     return new Map([])
//   }

//   // When initializing, we restore the data from `localStorage` into a map.
//   const map = new Map(JSON.parse(localStorage.getItem(cacheKey) || '[]'))

//   // Before unloading the app, we write back all the data into `localStorage`.
//   if (cacheVersion !== -1) {
//     window.addEventListener('beforeunload', () => {
//       const appCache = JSON.stringify(Array.from(map.entries()))
//       localStorage.setItem(cacheKey, appCache)
//     })
//   }

//   // We still use the map for write & read for performance.
//   return map
// }

function MyApp({ Component, pageProps }: AppProps) {
  const {} = useLocalStorage()
  const { congratulationsModal, setCongratulationsModalForNounletId } = useAppStore()
  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        dedupingInterval: 2000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
        // provider: localStorageProvider
      }}
    >
      <DAppProvider config={useDappConfig}>
        <WalletConfig>
          <ChainUpdater />
          <Toaster />
          <div className="bg-gray-1">
            <AppHeader />
          </div>
          <div id="backdrop-root"></div>
          <div id="overlay-root"></div>
          <Component {...pageProps} />
          <AppFooter />
          <CongratulationsModal
            isShown={congratulationsModal.show}
            onClose={() => {
              setCongratulationsModalForNounletId(false)
            }}
          />
        </WalletConfig>
      </DAppProvider>
    </SWRConfig>
  )
}

export default MyApp
