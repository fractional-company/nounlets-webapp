import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import { sleep } from 'radash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useNounTribute from 'src/hooks/tribute/useNounTribute'
import { toastError, toastSuccess } from 'src/hooks/utils/useToasts'
import { WrappedTransactionReceiptState } from 'src/lib/utils/txWithErrorHandling'
import Button from '../common/buttons/Button'
import { NounImage } from '../common/NounletImage'
import SimpleAddress from '../common/simple/SimpleAddress'

// TODO ask Lilly for more
const trubitedMemes = [
  'Gracefully added by',
  'Sneakily added by',
  'Promoted by',
  'Something something by',
  '`Lilly come up with more plx` by'
]

export default function TributedNounCard(props: {
  noun: {
    id: string
    tributed: boolean
    currentDelegate: string
  }
}) {
  const { account } = useEthers()
  const { removeTributedNoun, mutateTributedList } = useNounTribute()
  const { noun } = props
  const [isLoading, setIsLoading] = useState(false)
  const isTributedByMe = noun.currentDelegate.toLowerCase() === (account || '').toLowerCase()
  const className = isTributedByMe ? 'bg-gray-4 text-white' : 'bg-gray-1'

  // const onRemoveTribute = useCallback(async () => {
  //   console.log('un-tributing')
  //   const result = await removeTributedNoun(noun.id)
  //   console.log('result', result)
  //   await sleep(10000)
  //   toastSuccess('UN-Tributed!', "Bam, it's UN-tributed!")
  // }, [noun.id, removeTributedNoun])

  // TODO test if this work
  // This should update the loading indicator when the tributed list updates
  // so that we dont have a race condition between the BC and Subgraph
  useEffect(() => {
    setIsLoading(false)
  }, [isTributedByMe])

  const onRemoveTribute = useCallback(async () => {
    console.log('un-tributing')
    try {
      setIsLoading(true)
      const response = await removeTributedNoun(noun.id)

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
  }, [noun.id, removeTributedNoun, mutateTributedList])

  const randomTributeText = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * trubitedMemes.length)
    return trubitedMemes[randomIndex]
  }, [])

  return (
    <div className={classNames(className, 'overflow-hidden rounded-[24px] p-4')}>
      <div className="flex flex-col space-y-4">
        <div className="overflow-hidden rounded-[16px]">
          <NounImage id={noun.id} />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-londrina text-px24 leading-px26">NOUN {noun.id}</h1>
        </div>
        {isTributedByMe ? (
          <div className="flex items-center gap-2">
            <Button
              className="primary-danger flex-1 !text-white"
              onClick={onRemoveTribute}
              loading={isLoading}
            >
              Un-tribute
            </Button>
          </div>
        ) : (
          <div className="flex h-[48px] flex-col">
            <p
              className={classNames(
                'text-px14 font-500 leading-px20',
                isTributedByMe ? 'text-white' : 'text-gray-3'
              )}
            >
              {randomTributeText}
            </p>

            <SimpleAddress
              avatarSize={16}
              address={noun.currentDelegate}
              className="space-x-2 text-px16 font-700 text-black"
            />
          </div>
        )}
      </div>
    </div>
  )
}

TributedNounCard.Skeleton = function TributedNounCardSkeleton() {
  return (
    <div className={classNames('overflow-hidden rounded-[24px] p-4', 'bg-gray-1')}>
      <div className="flex flex-col space-y-4">
        <div className="aspect-square overflow-hidden rounded-[16px] bg-white">
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
