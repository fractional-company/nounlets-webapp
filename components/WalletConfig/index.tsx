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
import { Col, Row } from 'react-bootstrap'
import { AvatarProvider } from '@davatar/react'
import NavBar from '../NavBar'
import Footer from '../Footer'

export default function WalletConfig(props: { children: ReactNode }) {
  const { account, chainId, library } = useEthers()
  dayjs.extend(relativeTime)
  const { alertModal, setAlertModal } = useAppState()
  const { setActiveAccount } = useAccountState()

  const [emojiQueue, setEmojiQueue] = useState([''])

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
                      <Row>
                        <Col>
                          <button
                            className={classes.alertButton}
                            onClick={() => setAlertModal({ ...alertModal, show: false })}
                          >
                            Cancel
                          </button>
                        </Col>
                        <Col>
                          <button className={classes.alertButton} onClick={alertModal.action}>
                            {alertModal.actionMessage}
                          </button>
                        </Col>
                      </Row>
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
        <NavBar />
        {props.children}
        <Footer />
      </AvatarProvider>
    </div>
  )
}
