import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useEthers } from '@usedapp/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAppState } from '../../store/application'
import config, { CHAIN_ID } from '../../config'
import { useAccountState } from '../../store/account'
import classes from './WalletConfig.module.css'
import NetworkAlert from '../NetworkAlert'
import AlertModal from '../Modal'
import { AvatarProvider } from '@davatar/react'

export default function WalletConfig(props: { children: ReactNode }) {
  const { account, chainId, library } = useEthers()
  dayjs.extend(relativeTime)
  const { alertModal, setAlertModal } = useAppState()
  const { setActiveAccount } = useAccountState()

  const [emojiQueue, setEmojiQueue] = useState([''])
  // console.log(Number(CHAIN_ID), chainId)
  const isPreLaunch = config.isPreLaunch === 'true'
  useEffect(() => {
    // Local account array updated
    setActiveAccount(account)
  }, [account, setActiveAccount])

  return (
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
  )
}
