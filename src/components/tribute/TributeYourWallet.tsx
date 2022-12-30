import { getGoerliSdk } from '@dethcrypto/eth-sdk-client'
import { useEthers } from '@usedapp/core'
import { IS_DEVELOP } from 'config'
import { getNFTBalance, OpenseaCardData } from 'graphql/src/queries'
import { sleep } from 'radash'
import Button from 'src/components/common/buttons/Button'
import useSdk from 'src/hooks/utils/useSdk'
import useToasts from 'src/hooks/utils/useToasts'
import { getBatchTributeInfo } from 'src/lib/utils/buyoutInfoUtils'
import { useAppStore } from 'src/store/application.store'
import useSWR from 'swr'
import SimpleAddress from '../common/simple/SimpleAddress'
import TributeOpenseaCard from './TributeOpenseaCard'

/*

TODOS:
- Add skeletons when loading
- Add "vault noun" functionality
- Wire all the tx to txWithErrorHandling
- Add spinners to buttons
- Add pagination to opensea data
- Add fake pagination to tributed Nouns

*/

function TributeYourWallet() {
  const sdk = useSdk()
  const { account: account, library } = useEthers()
  const { toastSuccess, toastError } = useToasts()
  const { setConnectModalOpen } = useAppStore()

  // nounders.eth
  // const account = '0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5'

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
    if (!IS_DEVELOP) throw new Error('sorry, only in dev')
    if (library == null || sdk == null || account == null) throw new Error('sdk or account missing')

    const mintHelper = getGoerliSdk(library).v2.nounlets.MintHelper.connect(library.getSigner())
    const nounsToken = getGoerliSdk(library).v2.nounlets.NounsToken

    const tx = await mintHelper.mint()
    const result = await tx.wait()
    await sleep(10000)
    await mutate()
    toastSuccess('Minted', "Bam, it's yours!")
  }

  if (account == null) {
    return (
      <div className="flex flex-col items-center space-y-8 overflow-hidden rounded-[20px] bg-gray-1 p-6">
        <h1 className="text-center font-londrina text-px32 font-900">Please connect your wallet</h1>
        <Button className="primary" onClick={() => setConnectModalOpen(true)}>
          Connect wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-8 overflow-hidden rounded-[20px] bg-gray-1 p-6">
      <h1 className="text-center font-londrina text-px32 font-900">Nouns in your wallet</h1>
      <div>
        <SimpleAddress address={account} avatarSize={24} className="space-x-2 font-700" />
      </div>
      {IS_DEVELOP && (
        <Button className="primary" onClick={mintANoun}>
          DEV mint
        </Button>
      )}

      {data && data.length === 0 && (
        <h1 className="text-center font-londrina text-px22 font-900">You don`t own any Nouns :(</h1>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {data.map((nounData: any) => (
            <div key={nounData.token_id} className="w-[300px]">
              <TributeOpenseaCard data={nounData} onTributeSuccess={() => mutate()} />
            </div>
          ))}

          <div className="w-[300px]">
            <TributeOpenseaCard.Skeleton />
          </div>

          <div className="w-[300px]">
            <TributeOpenseaCard.Skeleton />
          </div>
        </div>
      )}
    </div>
  )
}

export default TributeYourWallet
