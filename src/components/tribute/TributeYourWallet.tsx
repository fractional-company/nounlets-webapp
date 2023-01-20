import { getGoerliSdk } from '@dethcrypto/eth-sdk-client'
import { useEthers } from '@usedapp/core'
import { IS_DEVELOP } from 'config'
import { getNFTBalance, OpenseaCardData } from 'graphql/src/queries'
import { sleep } from 'radash'
import { useMemo, useState } from 'react'
import Button from 'src/components/common/buttons/Button'
import useNounTribute from 'src/hooks/tribute/useNounTribute'
import useTributedNounsList from 'src/hooks/tribute/useTributedNounsList'
import useWalletNounsList from 'src/hooks/tribute/useWalletNounsList'
import useSdk from 'src/hooks/utils/useSdk'
import useToasts, { toastError, toastSuccess } from 'src/hooks/utils/useToasts'
import { useAppStore } from 'src/store/application.store'
import useSWR from 'swr'
import SimpleAddress from '../common/simple/SimpleAddress'
import TributeOpenseaCard from './TributeOpenseaCard'

function TributeYourWallet() {
  const { account } = useEthers()
  const { setConnectModalOpen } = useAppStore()
  const { mintANoun, vaultNounV1 } = useNounTribute()
  const { data: tributedNounsList } = useTributedNounsList()
  const [isMinting, setIsMinting] = useState(false)
  const {
    concatenatedData: walletNounsList,
    hasMore,
    size,
    isLoadingMore,
    setSize,
    mutate
  } = useWalletNounsList(tributedNounsList != null)

  const handleMintANoun = async () => {
    setIsMinting(true)
    try {
      const result = await mintANoun()
      await sleep(15000)
      await mutate()
      toastSuccess('Minted', 'Refresh the page until you see it')
    } catch {
      toastError('Error', 'Ask the dev what happened')
    } finally {
      setIsMinting(false)
    }
  }

  const handleLoadMore = async () => {
    if (hasMore) {
      setSize(size + 1)
    }
  }

  if (account == null) {
    return (
      <div className="flex flex-col items-center space-y-8 overflow-hidden rounded-[20px] bg-gray-1 p-6">
        <h1 className="text-center font-londrina text-px32 font-900 lg:text-[48px] lg:leading-[58px]">
          Please connect your wallet
        </h1>
        <Button className="primary" onClick={() => setConnectModalOpen(true)}>
          Connect wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-8 overflow-hidden rounded-[20px] bg-gray-1 p-6">
      <h1 className="text-center font-londrina text-px32 font-900 lg:text-[48px] lg:leading-[58px]">
        Nouns in your wallet
      </h1>
      <div>
        <SimpleAddress address={account} avatarSize={24} className="space-x-2 font-700" />
      </div>
      {IS_DEVELOP && (
        <Button className="primary" onClick={handleMintANoun} loading={isMinting}>
          DEV mint
        </Button>
      )}

      {walletNounsList == null && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <div className="w-[300px]">
            <TributeOpenseaCard.Skeleton />
          </div>
        </div>
      )}

      {walletNounsList && walletNounsList.length === 0 && (
        <h1 className="text-center font-londrina text-px22 font-900">You don`t own any Nouns :(</h1>
      )}

      {walletNounsList && (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {walletNounsList.map((nounData: any) => (
              <div key={nounData.token_id} className="w-[300px]">
                <TributeOpenseaCard data={nounData} />
              </div>
            ))}
            {isLoadingMore && (
              <div className="w-[300px]">
                <TributeOpenseaCard.Skeleton />
              </div>
            )}
          </div>
          {hasMore && !isLoadingMore && (
            <Button className="default-outline text-black" onClick={handleLoadMore}>
              Show more
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export default TributeYourWallet
