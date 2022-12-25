import { getGoerliSdk } from '@dethcrypto/eth-sdk-client'
import { useEthers } from '@usedapp/core'
import { CHAIN_ID, NEXT_PUBLIC_OPENSEA_KEY } from 'config'
import { NextPage } from 'next'
import Button from 'src/components/common/buttons/Button'
import useSdk, { NounletsSDK } from 'src/hooks/utils/useSdk'
import useToasts from 'src/hooks/utils/useToasts'
import useSWR from 'swr'
import axios from 'axios'
import { NounImage } from 'src/components/common/NounletImage'
import { sleep } from 'radash'
import Image from 'next/image'
import { useCallback } from 'react'
import { getBatchTributeInfo } from 'src/lib/utils/buyoutInfoUtils'
import { ethers } from 'ethers'
import classNames from 'classnames'
import IconCheckmark from 'src/components/common/icons/IconCheckmark'
import TributeOpenseaCard from 'src/components/tribute/TributeOpenSeaCard'
import { getNFTBalance, OpenseaCardData } from 'graphql/src/queries'
import TributeYourWallet from 'src/components/tribute/TributeYourWallet'

const Tribute: NextPage = () => {
  const { account } = useEthers()

  return (
    <div className="page-tribute w-screen space-y-8 bg-white lg:space-y-16">
      <div className="bg-gray-1 px-4 pt-4 pb-12">
        <h1 className="text-center font-londrina text-[56px] font-700 uppercase leading-[62px]">
          Want to Tribute your Noun?
        </h1>
      </div>

      <div className="px-4 lg:container lg:mx-auto">
        <TributeYourWallet />
        <div>tributed nouns</div>

        <div>{/* <NounImage id="2" /> */}</div>
      </div>
    </div>
  )
}

export default Tribute
