import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import { CHAIN_ID } from 'config'
import { ethers } from 'ethers'
import { OpenseaCardData } from 'graphql/src/queries'
import Image from 'next/image'
import { sleep } from 'radash'
import { useCallback, useContext, useMemo, useState } from 'react'
import useTributedNounsList from 'src/hooks/tribute/useTributedNounsList'
import useNounTribute from 'src/hooks/tribute/useNounTribute'
import useProofs from 'src/hooks/useProofs'
import useSdk from 'src/hooks/utils/useSdk'
import useToasts, { toastError, toastSuccess } from 'src/hooks/utils/useToasts'
import Button from '../common/buttons/Button'
import IconCheckmark from '../common/icons/IconCheckmark'
import { NounImage } from '../common/NounletImage'
import { WrappedTransactionReceiptState } from 'src/lib/utils/txWithErrorHandling'

export default function TributeOpenseaCard(props: {
  data: OpenseaCardData
  onTributeSuccess: (tokenId: string, flag: boolean) => void
}) {
  const { token_id, image_url, permalink } = props.data
  const onTributeSuccess = props.onTributeSuccess
  const sdk = useSdk()
  const { data: tributedNounsList } = useTributedNounsList()
  const { account, library } = useEthers()
  const { tributeNoun, removeTributedNoun, mutateTributedList } = useNounTribute()
  const [isLoading, setIsLoading] = useState(false)

  const onTribute = useCallback(async () => {
    console.log('tributing')
    try {
      setIsLoading(true)
      const response = await tributeNoun(token_id)

      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        console.log('result', response)
        // await sleep(10000)
        mutateTributedList()
        toastSuccess('Tributed! 🎊', "Bam, it's tributed!")
      } else {
        throw response
      }
    } catch (e) {
      toastError('Tributing failed', 'Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [token_id, tributeNoun, mutateTributedList])

  const onRemoveTribute = useCallback(async () => {
    console.log('un-tributing')
    try {
      setIsLoading(true)
      const response = await removeTributedNoun(token_id)

      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        console.log('result', response)
        // await sleep(10000)
        mutateTributedList()
        toastSuccess('Un-tributed! ❌', 'Awww, I liked that one :(')
      } else {
        throw response
      }
    } catch (e) {
      toastError('Un-tributing failed', 'Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [token_id, removeTributedNoun, mutateTributedList])

  const isTributed = useMemo(() => {
    return tributedNounsList?.some((noun) => noun.id === token_id)
  }, [token_id, tributedNounsList])
  const className = isTributed ? 'bg-gray-4 text-white' : 'bg-white'

  return (
    <div className={classNames(className, 'overflow-hidden rounded-[24px] p-4')}>
      <div className="flex flex-col space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-[16px]">
          <Image
            className="image-pixelated"
            src={image_url}
            alt={`noun ${token_id}`}
            layout="fill"
          />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-londrina text-px24 leading-px26">NOUN {token_id}</h1>
          {isTributed && (
            <div className="flex items-center space-x-2 text-primary">
              <IconCheckmark />
              <p className="text-px1 font-londrina">TRIBUTED</p>
            </div>
          )}
        </div>
        {isTributed ? (
          <div className="flex gap-2">
            <Button
              className="primary-danger flex-1 !text-white"
              onClick={onRemoveTribute}
              loading={isLoading}
            >
              Un-tribute
            </Button>
            {CHAIN_ID !== 1 && (
              <Button className="basic text-black" onClick={onRemoveTribute} loading={isLoading}>
                Vault
              </Button>
            )}
          </div>
        ) : (
          <Button className="primary" onClick={onTribute} loading={isLoading}>
            Tribute
          </Button>
        )}
      </div>
    </div>
  )
}

TributeOpenseaCard.Skeleton = function TributeOpenseaCardSkeleton() {
  return (
    <div className={classNames('overflow-hidden rounded-[24px] p-4', 'bg-white')}>
      <div className="flex flex-col space-y-4">
        <div className="aspect-square overflow-hidden rounded-[16px] bg-gray-1">
          <NounImage />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-londrina text-px24 leading-px26">NOUN ???</h1>
        </div>
        <div className="h-[48px]"></div>
      </div>
    </div>
  )
}
