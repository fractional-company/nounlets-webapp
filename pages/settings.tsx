import { getMainnetSdk, getRinkebySdk } from '@dethcrypto/eth-sdk-client'
import { useEthers } from '@usedapp/core'
import Button from 'components/buttons/button'
import useSdk from 'hooks/useSdk'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const Settings: NextPage<{}, {}> = () => {
  const router = useRouter()
  const { account, library } = useEthers()
  const sdk = useSdk()

  const createVault = async () => {
    if (library == null || sdk == null || account == null) throw new Error('sdk or account missing')

    console.log('creating vault')

    // Approve protoform: 0xa9fA8E3e9ea15c37Ec6b65C8d754987bad679820
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
      4
    )

    return tx
      .wait()
      .then((res: any) => {
        console.log('Vault deployed', res)
        // debugger
        // nounletAuction.createAuction()
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      <h1>Settings</h1>

      <Button className="primary" onClick={() => createVault()}>
        Create new vault
      </Button>
    </div>
  )
}
export default Settings
