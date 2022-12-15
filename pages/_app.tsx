import { Config, DAppProvider } from '@usedapp/core'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import AppFooter from 'src/components/common/AppFooter'
import AppHeader from 'src/components/common/AppHeader'
import WalletConfig from '../src/components/common/WalletConfig'
import '../styles/globals.css'

import { SWRConfig } from 'swr'

import { CHAIN_ID } from 'config'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import ModalCongratulations from 'src/components/modals/ModalCongratulations'
import useLocalStorage from 'src/hooks/utils/useLocalStorage'
import { useAppStore } from 'src/store/application.store'

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
          <Toaster />
          <AppHeader />
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
  )
}

export default MyApp
