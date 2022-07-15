import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import {useEthers} from "@usedapp/core";

const Home: NextPage = () => {
    const {account} = useEthers()
  return (
    <div className={styles.container}>
      <p>This is new page</p>
        <p>{account}</p>
    </div>
  )
}

export default Home
