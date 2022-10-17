import { ChainId, Config, DAppProvider, useEthers } from '@usedapp/core'
import AppFooter from 'src/components/app-footer'
import AppHeader from 'src/components/app-header'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import WalletConfig from '../src/components/WalletConfig'
import '../styles/globals.css'

import { SWRConfig } from 'swr'
import ChainUpdater from '../src/components/ChainUpdater'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CHAIN_ID, NEXT_PUBLIC_CACHE_VERSION, NEXT_PUBLIC_NOUN_VAULT_ADDRESS } from 'config'
import { useAppStore } from 'src/store/application'
import CongratulationsModal from 'src/components/modals/congratulations-modal'
import useLocalStorage from 'src/hooks/useLocalStorage'

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(relativeTime)

const useDappConfig: Config = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [CHAIN_ID]: process.env.NEXT_PUBLIC_ALCHEMY_HTTPS ?? ''
  },
  autoConnect: true
}

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
