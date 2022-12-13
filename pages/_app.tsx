import { ChainId, Config, DAppProvider, useEthers } from '@usedapp/core'
import AppFooter from 'src/components/common/AppFooter'
import AppHeader from 'src/components/common/AppHeader'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import WalletConfig from '../src/components/common/WalletConfig'
import '../styles/globals.css'

import { SWRConfig } from 'swr'
import ChainUpdater from '../src/components/ChainUpdater'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CHAIN_ID, NEXT_PUBLIC_CACHE_VERSION, NEXT_PUBLIC_NOUN_VAULT_ADDRESS } from 'config'
import { useAppStore } from 'src/store/application'
import ModalCongratulations from 'src/components/modals/ModalCongratulations'
import useLocalStorage from 'src/hooks/utils/useLocalStorage'

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(relativeTime)

const queryClient = new QueryClient()

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
    <QueryClientProvider client={queryClient}>
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
            {/*<ChainUpdater />*/}
            <Toaster />
            <div className="bg-gray-1">
              <AppHeader />
            </div>
            <div id="backdrop-root"></div>
            <div id="overlay-root"></div>
            <Component {...pageProps} />
            <AppFooter />
            <ModalCongratulations
              isShown={congratulationsModal.show}
              onClose={() => {
                setCongratulationsModalForNounletId(false)
              }}
            />
          </WalletConfig>
        </DAppProvider>
      </SWRConfig>
    </QueryClientProvider>
  )
}

export default MyApp
