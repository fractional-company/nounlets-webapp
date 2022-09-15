import { useEthers } from '@usedapp/core'
import Button from 'components/buttons/button'
import {
  NEXT_PUBLIC_BID_DECIMALS,
  NEXT_PUBLIC_BLOCKS_PER_DAY,
  NEXT_PUBLIC_NOUN_VAULT_ADDRESS
} from 'config'
import useLeaderboard from 'hooks/useLeaderboard'
import useSdk from 'hooks/useSdk'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useVaultStore } from 'store/vaultStore'
import SEO from '../components/seo'

export const getServerSideProps = (context: any) => {
  return {
    props: {
      url: context?.req?.headers?.host
    }
  }
}

const Settings: NextPage<{ url: string }> = ({ url }) => {
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

    // const leafs = await nounletAuction.getLeafNodes()

    // console.log('leafs!', leafs)

    const merkleTree = await sdk.NounletProtoform.generateMerkleTree([
      sdk.NounletAuction.address,
      sdk.OptimisticBid.address,
      sdk.NounletGovernance.address
    ])
    console.log('merklee!', merkleTree)

    /*
    // nounletAuction
    mintProof = protoform.getProof(merkleTree, 0);

    // optimisticBid
    batchBurnProof = protoform.getProof(merkleTree, 1);
    withdrawERC721Proof = protoform.getProof(merkleTree, 2);

    // nounletGovernance
    castVoteProof = protoform.getProof(merkleTree, 3);
    castVoteWithReasonProof = protoform.getProof(merkleTree, 4);
    cancelProof = protoform.getProof(merkleTree, 5);
    proposeProof = protoform.getProof(merkleTree, 6);
    delegateProof = protoform.getProof(merkleTree, 7);
    */

    const mintProof = await sdk.NounletProtoform.getProof(merkleTree, 0)
    console.log({ mintProof })

    // const gasPrice = await library.getGasPrice()

    const tx = await sdk.NounletProtoform.connect(library.getSigner()).deployVault(
      [sdk.NounletAuction.address, sdk.OptimisticBid.address, sdk.NounletGovernance.address],
      [],
      [],
      mintProof,
      sdk.NounsDescriptorV2.address,
      1
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
      <SEO
        url={`${url}/post`}
        openGraphType="website"
        title="Settings"
        description="The only thing we learn from history, it has been said, 'is that men never learn from history'..."
        image={`${url}/img/noun.jpg`}
      />
      <h1 className="font-600">Settings</h1>

      <div className="px-4">
        <h1 className="font-600">ENV</h1>
        <pre>{JSON.stringify(environment, null, 4)}</pre>
      </div>

      <div className="px-4">
        <h1 className="font-600">Vault METADATA</h1>
        <pre>{JSON.stringify(vaultMetadata, null, 4)}</pre>
      </div>

      <Button className="primary" onClick={() => createVault()}>
        Create new vault
      </Button>
    </div>
  )
}
export default Settings
