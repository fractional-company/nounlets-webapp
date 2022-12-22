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

type OpenseaCardData = {
  token_id: string
  permalink: string
  image_url: string
  isTributed: boolean
}

const Tribute: NextPage = () => {
  const { account } = useEthers()

  return (
    <div className="page-tribute w-screen space-y-8 bg-white lg:space-y-16">
      <div></div>

      {account && <YourWallet />}
      <div>tributed nouns</div>

      <div>{/* <NounImage id="2" /> */}</div>
    </div>
  )
}

export default Tribute

function YourWallet() {
  const sdk = useSdk()
  const { account, library } = useEthers()
  const { toastSuccess, toastError } = useToasts()

  const { data, mutate } = useSWR<OpenseaCardData[]>(
    account && `wallet/${account!.toLowerCase()}`,
    async () => {
      const openseaData = await getNFTBalance(sdk, account!)
      console.log({ openseaData })

      const batchTokenIds = openseaData.map((data) => data.token_id)
      const result = await getBatchTributeInfo(sdk, library!, batchTokenIds)

      const mapped = openseaData.map((noun, index) => {
        return {
          ...noun,
          isTributed: result[index]
        }
      })
      return mapped
    }
  )

  const mintANoun = async () => {
    if (CHAIN_ID !== 5) throw new Error('sorry, only in dev')
    if (library == null || sdk == null || account == null) throw new Error('sdk or account missing')

    const mintHelper = getGoerliSdk(library).v2.nounlets.MintHelper.connect(library.getSigner())
    const nounsToken = getGoerliSdk(library).v2.nounlets.NounsToken

    const tx = await mintHelper.mint()
    const result = await tx.wait()
    await sleep(10000)
    await mutate()
    toastSuccess('Minted', "Bam, it's yours!")
  }

  const tmpGetBatchTributeInfo = async () => {
    console.log('batch tribute info')
    const result = await getBatchTributeInfo(sdk, library!, ['2', '3'])
  }

  const onTributeSuccess = useCallback(
    async (tokenId: string, flag: boolean) => {
      mutate()
    },
    [mutate]
  )

  return (
    <div className="overflow-hidden rounded-[20px] bg-gray-1 p-6">
      <h1 className="font-londrina text-px32 font-900">Nouns in your wallet</h1>
      <Button className="primary" onClick={mintANoun}>
        Mint another!
      </Button>

      <Button onClick={tmpGetBatchTributeInfo}>tribute info</Button>

      <div onClick={() => mutate()}>
        whwhwhwhwh
        {/* <pre>{JSON.stringify(data || {}, null, 4)}</pre> */}
      </div>

      {data && (
        <div className="grid grid-cols-2">
          {data.map((nounData: any) => (
            <div key={nounData.token_id} className="w-[300px]">
              <OpenseaCard data={nounData} onTributeSuccess={onTributeSuccess} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function OpenseaCard(props: {
  data: OpenseaCardData
  onTributeSuccess: (tokenId: string, flag: boolean) => void
}) {
  const { token_id, image_url, permalink, isTributed } = props.data
  const onTributeSuccess = props.onTributeSuccess
  const sdk = useSdk()
  const { account, library } = useEthers()
  const { toastSuccess, toastError } = useToasts()

  const onTribute = useCallback(async () => {
    console.log('tributing')
    const nounsToken = sdk.NounsToken.connect(library!.getSigner())
    const nounletProtoform = sdk.NounletProtoform

    const tx = await nounsToken.approve(nounletProtoform.address, token_id)
    const result = await tx.wait()

    console.log('result', result)
    await sleep(10000)
    toastSuccess('Tributed!', "Bam, it's tributed!")
    onTributeSuccess(token_id, true)
  }, [sdk, library, token_id, toastSuccess, onTributeSuccess])

  const onRemoveTribute = useCallback(async () => {
    console.log('un-tributing')
    const nounsToken = sdk.NounsToken.connect(library!.getSigner())
    const tx = await nounsToken.approve(ethers.constants.AddressZero, token_id)
    const result = await tx.wait()

    console.log('result', result)
    await sleep(10000)
    toastSuccess('UN-Tributed!', "Bam, it's UN-tributed!")
    onTributeSuccess(token_id, false)
  }, [sdk, library, token_id, toastSuccess, onTributeSuccess])

  return (
    <div className="flex flex-col">
      <Image
        className="image-pixelated"
        src={image_url}
        alt={`noun ${token_id}`}
        layout="responsive"
        width={320}
        height={320}
      />
      {isTributed ? (
        <Button className="primary-danger" onClick={onRemoveTribute}>
          Withdraw
        </Button>
      ) : (
        <Button className="primary" onClick={onTribute}>
          Tribute
        </Button>
      )}
    </div>
  )
}

const axiosConfig: any = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 5000
}

export const OPENSEA_API_URL = {
  [1]: 'https://api.opensea.io/api/v1',
  [5]: 'https://testnets-api.opensea.io/api/v1'
}

export const OPENSEA_URL = {
  [1]: 'https://opensea.io',
  [5]: 'https://testnets-opensea.io'
}

async function getNFTBalance(sdk: NounletsSDK, walletAddress: string) {
  const apiUrl = OPENSEA_API_URL[CHAIN_ID]
  const axiosConf = axiosConfig
  axiosConf.headers['X-API-KEY'] = NEXT_PUBLIC_OPENSEA_KEY
  axiosConf.baseURL = apiUrl

  if (CHAIN_ID !== 1) {
    delete axiosConfig.headers['X-API-KEY']
  }

  const contractAddress = sdk.NounsToken.address
  const contracts = `&asset_contract_addresses=${contractAddress}`

  const limit = 50
  let offset = 0
  const queryParams = `owner=${walletAddress}${contracts}`
  const client = axios.create(axiosConfig)

  let assets = []
  let hasMoreItems = true

  const url = `/assets?${queryParams}&offset=${offset}&limit=${limit}`
  const { data } = await client.get<{
    assets: Omit<OpenseaCardData, 'isTributed'>[]
  }>(url)

  console.log('got OS data', data)
  return data.assets.map((asset) => {
    return {
      token_id: asset.token_id,
      permalink: asset.permalink,
      image_url: asset.image_url
    }
  })

  // if (parseInt(CHAIN_ID) !== CHAINS.MAINNET) {
  //   delete axiosConfig.headers["X-API-KEY"];
  // }
}
