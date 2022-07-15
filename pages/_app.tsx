import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {ChainId, DAppProvider, useEthers} from '@usedapp/core';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {useAppState} from "../store/application";
import {useState} from "react";
import config from "../config";
import WalletConfig from "../components/WalletConfig";

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet | ChainId.Hardhat;

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4');

const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [ChainId.Rinkeby]: 'https://eth-rinkeby.alchemyapi.io/v2/oj6wP54JEn9E4QLpWJDr4Z7AvMZOjnad',
    [ChainId.Mainnet]: 'https://eth-mainnet.alchemyapi.io/v2/jO-pIswuUui5ipthjbcIOZEeuuxWibBd',
    [ChainId.Hardhat]: 'http://localhost:8545',
  },
};
function MyApp({ Component, pageProps }: AppProps) {

  return (
      <DAppProvider config={useDappConfig}>
          <div id="backdrop-root"></div>
          <div id="overlay-root"></div>
          <WalletConfig>
              <Component {...pageProps} />
          </WalletConfig>
      </DAppProvider>
  )
}

export default MyApp
