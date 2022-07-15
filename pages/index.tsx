import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useEthers } from '@usedapp/core'
import OnMounted from '../components/utils/on-mounted'

const Home: NextPage = () => {
  const { account } = useEthers()
  return (
    <div className={styles.container}>
      <p>This is new page</p>
      <OnMounted>
        <p>{account}</p>
      </OnMounted>
    </div>
  )
}

export default Home
