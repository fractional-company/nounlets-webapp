import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import { CHAIN_ID } from 'config'
import { ethers } from 'ethers'
import { OpenseaCardData } from 'graphql/src/queries'
import Image from 'next/image'
import { sleep } from 'radash'
import { useCallback } from 'react'
import useProofs from 'src/hooks/useProofs'
import useSdk from 'src/hooks/utils/useSdk'
import useToasts from 'src/hooks/utils/useToasts'
import Button from '../common/buttons/Button'
import IconCheckmark from '../common/icons/IconCheckmark'

export default function TributeOpenseaCard(props: {
  data: OpenseaCardData
  onTributeSuccess: (tokenId: string, flag: boolean) => void
}) {
  const { token_id, image_url, permalink, isTributed } = props.data
  const onTributeSuccess = props.onTributeSuccess
  const sdk = useSdk()
  const { account, library } = useEthers()
  const { toastSuccess, toastError } = useToasts()
  const { getMerkleRoot } = useProofs()

  const onTribute = useCallback(async () => {
    console.log('tributing')
    const result = await getMerkleRoot()
    console.log('got', { result })
    // const nounsToken = sdk.NounsToken.connect(library!.getSigner())
    // const nounletProtoform = sdk.NounletProtoform

    // const tx = await nounsToken.approve(nounletProtoform.address, token_id)
    // const result = await tx.wait()

    // console.log('result', result)
    // await sleep(10000)
    // toastSuccess('Tributed!', "Bam, it's tributed!")
    // onTributeSuccess(token_id, true)
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

  const className = isTributed ? 'bg-gray-4 text-white' : 'bg-white'

  return (
    <div className={classNames(className, 'overflow-hidden rounded-[24px] p-4')}>
      <div className="flex flex-col space-y-4">
        <div className="overflow-hidden rounded-[16px]">
          <Image
            className="image-pixelated"
            src={image_url}
            alt={`noun ${token_id}`}
            layout="responsive"
            width={320}
            height={320}
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
            <Button className="primary-danger flex-1 !text-white" onClick={onRemoveTribute}>
              Un-tribute
            </Button>
            {CHAIN_ID !== 1 && (
              <Button className="basic text-black" onClick={onRemoveTribute}>
                Vault
              </Button>
            )}
          </div>
        ) : (
          <Button className="primary" onClick={onTribute}>
            Tribute
          </Button>
        )}
      </div>
    </div>
  )
}
