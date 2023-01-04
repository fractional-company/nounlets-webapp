import { useCallback, useMemo } from 'react'
import useSdk from './utils/useSdk'

let merkleRootV1: Promise<string[]> | null = null
let merkleRootV2: Promise<string[]> | null = null

/* V1
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

/* V2
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

// Update 04.01.2023 - Order should now be like it is in v1

export default function useProofs() {
  const sdk = useSdk()

  const getProofOrder = useCallback(
    (version: 'v1' | 'v2' = 'v1') => {
      if (version === 'v1')
        return [
          sdk?.NounletAuction.address,
          sdk?.NounletGovernance.address,
          sdk?.OptimisticBid.address
        ]

      return [
        sdk?.NounletAuction.address,
        sdk?.OptimisticBid.address,
        sdk?.NounletGovernance.address
      ]
    },
    [sdk]
  )

  const getMerkleRoot = useCallback(
    async (version: 'v1' | 'v2' = 'v1') => {
      if (version === 'v1') {
        if (merkleRootV1 == null) {
          merkleRootV1 = new Promise(async (resolve, reject) => {
            console.log('resolving getMerkleRootV1')
            resolve(await sdk.NounletProtoform.generateMerkleTree(getProofOrder(version)))
          })
        }
        return merkleRootV1 as unknown as ReturnType<typeof sdk.NounletProtoform.generateMerkleTree>
      }

      if (merkleRootV2 == null) {
        merkleRootV2 = new Promise(async (resolve, reject) => {
          console.log('resolving getMerkleRootV2')
          resolve(await sdk.NounletProtoform.generateMerkleTree(getProofOrder(version)))
        })
      }
      return merkleRootV2 as unknown as ReturnType<typeof sdk.NounletProtoform.generateMerkleTree>
    },
    [sdk, getProofOrder]
  )

  const getMintProof = useCallback(
    async (version: 'v1' | 'v2' = 'v1') => {
      const merkleRoot = await getMerkleRoot(version)
      return sdk.NounletProtoform.getProof(merkleRoot, 0)
    },
    [sdk, getMerkleRoot]
  )

  const getDelegateProof = useCallback(
    async (version: 'v1' | 'v2' = 'v1') => {
      const merkleRoot = await getMerkleRoot(version)
      return sdk.NounletProtoform.getProof(merkleRoot, version === 'v1' ? 5 : 7)
    },
    [sdk, getMerkleRoot]
  )

  const getBatchBurnProof = useCallback(
    async (version: 'v1' | 'v2' = 'v1') => {
      const merkleRoot = await getMerkleRoot(version)
      return sdk.NounletProtoform.getProof(merkleRoot, version === 'v1' ? 6 : 1)
    },
    [sdk, getMerkleRoot]
  )

  const getWithdrawERC721Proof = useCallback(
    async (version: 'v1' | 'v2' = 'v1') => {
      const merkleRoot = await getMerkleRoot(version)
      return sdk.NounletProtoform.getProof(merkleRoot, version === 'v1' ? 7 : 2)
    },
    [sdk, getMerkleRoot]
  )

  return {
    getProofOrder,
    getMerkleRoot,
    getMintProof,
    getDelegateProof,
    getBatchBurnProof,
    getWithdrawERC721Proof
  }
}
