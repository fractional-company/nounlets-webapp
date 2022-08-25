import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'
import { useEthers } from '@usedapp/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAppStore } from '../../store/application'
import config, { CHAIN_ID } from '../../config'
import { useAccountState } from '../../store/account'
import classes from './WalletConfig.module.css'
import NetworkAlert from '../NetworkAlert'
import AlertModal from '../Modal'
import { AvatarProvider } from '@davatar/react'
import { NounletsSDK } from 'hooks/useSdk'
import { getMainnetSdk, getRinkebySdk, RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { useRouter } from 'next/router'

export const SDKContext = createContext<NounletsSDK | null>(null)
export default function WalletConfig(props: { children: ReactNode }) {
  const { account, chainId, library } = useEthers()
  const [sdk, setSdk] = useState<NounletsSDK | null>(null)
  const { alertModal, setAlertModal } = useAppStore()
  const { setActiveAccount } = useAccountState()

  const [wasWrongChainAlertShown, setWasWrongChainAlertShown] = useState(false)

  const [emojiQueue, setEmojiQueue] = useState([''])
  useEffect(() => {
    // Local account array updated
    setActiveAccount(account)
  }, [account, setActiveAccount])

  useEffect(() => {
    if (library) {
      if (chainId === CHAIN_ID) {
        if (wasWrongChainAlertShown) {
          console.log('refresh page')
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        }
      } else {
        setWasWrongChainAlertShown(true)
      }
    }
  }, [library, chainId, wasWrongChainAlertShown])

  useEffect(() => {
    if (library) {
      if (chainId === CHAIN_ID) {
        console.log('Setting SDK')
        setSdk(
          (CHAIN_ID === 4 ? getRinkebySdk(library) : (getMainnetSdk(library) as RinkebySdk))
            .nounlets
        )
      }
    }
  }, [library, chainId])

  return (
    <SDKContext.Provider value={sdk}>
      <div className={`${classes.wrapper}`}>
        {Number(CHAIN_ID) !== chainId && <NetworkAlert />}
        {alertModal.show && (
          <>
            <AlertModal
              title={alertModal.title}
              content={
                <>
                  <p>{alertModal.message}</p>

                  {alertModal.isActionPrompt && (
                    <>
                      {
                        <div className="flex grid-cols-2">
                          <div className="col-span-1">
                            <button
                              className={classes.alertButton}
                              onClick={() => setAlertModal({ ...alertModal, show: false })}
                            >
                              Cancel
                            </button>
                          </div>
                          <div className="col-span-1">
                            <button className={classes.alertButton} onClick={alertModal.action}>
                              {alertModal.actionMessage}
                            </button>
                          </div>
                        </div>
                      }
                    </>
                  )}
                </>
              }
              onDismiss={() => setAlertModal({ ...alertModal, show: false })}
            />
          </>
        )}

        <AvatarProvider provider={chainId === 1 ? (library as any) : undefined} batchLookups={true}>
          {props.children}
        </AvatarProvider>
      </div>
    </SDKContext.Provider>
  )
}
