import { createContext, ReactNode, useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { useAppStore } from '../../../store/application.store'
import { CHAIN_ID } from '../../../../config'
import classes from './WalletConfig.module.css'
import NetworkAlert from '../NetworkAlert'
import AlertModal from '../../modals/Modal'
import { AvatarProvider } from '@davatar/react'
import { NounletsSDK } from 'src/hooks/utils/useSdk'
import { getGoerliSdk, getMainnetSdk } from '@dethcrypto/eth-sdk-client'

export const SDKContext = createContext<NounletsSDK | null>(null)
export default function WalletConfig(props: { children: ReactNode }) {
  const { account, chainId, library } = useEthers()
  const [sdk, setSdk] = useState<NounletsSDK | null>(null)
  const { alertModal, setAlertModal } = useAppStore()
  const [wasWrongChainAlertShown, setWasWrongChainAlertShown] = useState(false)

  useEffect(() => {
    if (library) {
      if (chainId === CHAIN_ID) {
        if (wasWrongChainAlertShown) {
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        }
      } else {
        if (account != null) {
          setWasWrongChainAlertShown(true)
        }
      }
    }
  }, [account, library, chainId, wasWrongChainAlertShown])

  useEffect(() => {
    if (library) {
      if (chainId === CHAIN_ID) {
        if (chainId === 1) {
          setSdk(getMainnetSdk(library).v1.nounlets)
        } else if (chainId === 5) {
          setSdk(getGoerliSdk(library).v1.nounlets)
        } else {
          setSdk(null)
        }
      }
    }
  }, [library, chainId])

  return (
    <SDKContext.Provider value={sdk}>
      <div className={`${classes.wrapper}`}>
        {account && Number(CHAIN_ID) !== chainId && <NetworkAlert />}
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
