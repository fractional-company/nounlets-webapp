import type {GetServerSideProps, NextPage} from 'next'
import { useEthers } from '@usedapp/core'
import OnMounted from '../components/utils/on-mounted'

import { gql } from "@apollo/client";
import client from "../apollo-client";

import HomeHero from 'components/home/home-hero'
import HomeLeaderboard from 'components/home/home-leaderboard'
import HomeWTF from 'components/home/home-wtf'
import HomeCollectiveOwnership from 'components/home/home-collective-ownership'

export const getServerSideProps: GetServerSideProps = async () => {
    const { data } = await client.query({
        query: gql`
        query MyQuery {
            vault(id: "0x067b73fbc3accf78b4b8ebfb7964a03fb4554a0e") {
                id
                noun {
                    id
                    nounlets {
                        id
                    }
                }
            }
        }
    `,
    });

    return {
        props: {
            vault: data.vault,
        },
    };
}

// @ts-ignore
const Home: NextPage = ({vault}) => {
    console.log(vault)
  const { account } = useEthers()
  return (
    <div>
        <HomeHero />
        <HomeLeaderboard />
        <HomeCollectiveOwnership />
        <HomeWTF />
      <p>This is new page</p>
      <OnMounted>
        <p>{account}</p>
      </OnMounted>
    </div>
  )
}

export default Home

