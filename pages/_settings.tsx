import { getGoerliSdk, GoerliSdk } from '@dethcrypto/eth-sdk-client'
import { useEthers } from '@usedapp/core'
import Button from 'components/buttons/button'
import {
  NEXT_PUBLIC_BID_DECIMALS,
  NEXT_PUBLIC_BLOCKS_PER_DAY,
  NEXT_PUBLIC_NOUN_VAULT_ADDRESS
} from 'config'
import { BigNumber, ethers } from 'ethers'
import { LogDescription } from 'ethers/lib/utils'
import useLeaderboard from 'hooks/useLeaderboard'
import useSdk from 'hooks/useSdk'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useVaultStore } from 'store/vaultStore'
import SEO from '../components/seo'

const Settings: NextPage<{ url: string }> = ({ url }) => {
  // const router = useRouter()
  // useEffect(() => {
  //   router.replace('/')
  // })
  // return null
  const { account, library } = useEthers()
  const sdk = useSdk()
  const { isLive, isLoading, vaultAddress, nounletTokenAddress, latestNounletTokenId } =
    useVaultStore()
  const { delegateVotes } = useLeaderboard()
  const environment = {
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_CACHE_VERSION: process.env.NEXT_PUBLIC_CACHE_VERSION,
    NEXT_PUBLIC_SHOW_DEBUG: process.env.NEXT_PUBLIC_SHOW_DEBUG,
    NEXT_PUBLIC_NOUN_VAULT_ADDRESS: process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS,
    NEXT_PUBLIC_BLOCKS_PER_DAY: process.env.NEXT_PUBLIC_BLOCKS_PER_DAY,
    NEXT_PUBLIC_BID_DECIMALS: process.env.NEXT_PUBLIC_BID_DECIMALS
  }
  const vaultMetadata = {
    isLive,
    isLoading,
    vaultAddress, // VaultContract
    nounletTokenAddress, // NouneltTokenContract (proxy?)
    latestNounletTokenId
  }

  const mintANoun = async () => {
    if (library == null || sdk == null || account == null) throw new Error('sdk or account missing')
    const mintHelper = getGoerliSdk(library).nounlets.MintHelper.connect(library.getSigner())
    const nounsToken = getGoerliSdk(library).nounlets.NounsToken

    const tx = await mintHelper.mint()
    const result = await tx.wait()

    // // // const result = testObj
    // console.log({ result })
    const lastEvent = result.logs
      .map((log) => nounsToken.interface.parseLog(log))
      .filter((log) => {
        return log.name === nounsToken.interface.events['Approval(address,address,uint256)'].name
      })
      .at(-1)
    return (lastEvent!.args[2] as BigNumber).toNumber()
  }

  const createVault = async () => {
    if (library == null || sdk == null || account == null) throw new Error('sdk or account missing')
    console.log('creating vault')
    const isApprovedForAll = await sdk.NounsToken.isApprovedForAll(
      account,
      sdk.NounletProtoform.address
    )
    if (!isApprovedForAll) {
      console.log('not approved!')
      const tx = await sdk.NounsToken.connect(library.getSigner()).setApprovalForAll(
        sdk.NounletProtoform.address,
        true
      )
      await tx.wait()
    }
    console.log('approved!')

    // const newNounID = await mintANoun()

    // console.log('new noun ID', newNounID)
    // const leafs = await nounletAuction.getLeafNodes()
    // console.log('leafs!', leafs)
    const merkleTree = await sdk.NounletProtoform.generateMerkleTree([
      sdk.NounletAuction.address,
      sdk.NounletGovernance.address,
      sdk.OptimisticBid.address
    ])
    console.log('merklee!', merkleTree)
    /*
    // nounletAuction
    mintProof = protoform.getProof(merkleTree, 0);
    // nounletGovernance
    castVoteProof = protoform.getProof(merkleTree, 1);
    castVoteWithReasonProof = protoform.getProof(merkleTree, 2);
    cancelProof = protoform.getProof(merkleTree, 3);
    proposeProof = protoform.getProof(merkleTree, 4);
    delegateProof = protoform.getProof(merkleTree, 5);
    // optimisticBid
    batchBurnProof = protoform.getProof(merkleTree, 6);
    withdrawERC721Proof = protoform.getProof(merkleTree, 7);
    */
    const mintProof = await sdk.NounletProtoform.getProof(merkleTree, 0)
    console.log({ mintProof })
    // const gasPrice = await library.getGasPrice()
    const tx = await sdk.NounletProtoform.connect(library.getSigner()).deployVault(
      [sdk.NounletAuction.address, sdk.NounletGovernance.address, sdk.OptimisticBid.address],
      [],
      [],
      mintProof,
      sdk.NounsDescriptorV2.address,
      3
    )

    return tx
      .wait()
      .then((res: any) => {
        console.log('Vault deployed', res)
        // nounletAuction.createAuction()
      })
      .catch((e: any) => {
        console.log(e)
      })
  }
  return (
    <div className="p-4 flex flex-col gap-3 text-px12">
      <h1 className="font-600">Settings</h1>
      <div className="px-4">
        <h1 className="font-600">ENV</h1>
        <pre>{JSON.stringify(environment, null, 4)}</pre>
      </div>
      <div className="px-4">
        <h1 className="font-600">Vault METADATA</h1>
        <pre>{JSON.stringify(vaultMetadata, null, 4)}</pre>
      </div>
      <Button className="primary" onClick={() => mintANoun()}>
        mintANoun
      </Button>
      <Button className="primary" onClick={() => createVault()}>
        Create new vault
      </Button>
    </div>
  )
}
export default Settings
