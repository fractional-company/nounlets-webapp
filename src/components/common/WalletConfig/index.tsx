import { createContext, ReactNode, useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { useAppStore } from '../../../store/application.store'
import { CHAIN_ID, IS_DEVELOP } from '../../../../config'
import classes from './WalletConfig.module.css'
import NetworkAlert from '../NetworkAlert'
import AlertModal from '../../modals/Modal'
import { AvatarProvider } from '@davatar/react'
import { NounletsSDK } from 'src/hooks/utils/useSdk'
import { getGoerliSdk, getMainnetSdk, GoerliSdk } from '@dethcrypto/eth-sdk-client'

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
        let ethSdk = null
        let fullSdk = null

        if (chainId === 1) {
          ethSdk = getMainnetSdk(library) as unknown as ReturnType<typeof getGoerliSdk>
        }

        if (chainId === 5) {
          ethSdk = getGoerliSdk(library)
        }

        if (ethSdk != null) {
          fullSdk = {
            v1: ethSdk.v1.nounlets,
            v2: ethSdk.v2.nounlets,
            getVersion: function (nounTokenId: string) {
              // v1 support for DEV is 39 and 28, LIVE is 315
              if (
                (IS_DEVELOP && (nounTokenId == '28' || nounTokenId == '39')) ||
                (!IS_DEVELOP && nounTokenId == '315')
              ) {
                return 'v1'
              }
              return 'v2'
            },
            getFor: function (nounTokenId: string) {
              if (this.getVersion(nounTokenId) === 'v1') {
                return this.v1
              }
              return this.v2
            }
          }
        }

        setSdk(fullSdk)
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
