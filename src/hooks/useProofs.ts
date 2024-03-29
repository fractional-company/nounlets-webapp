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
    (version: 'v1' | 'v2' = 'v2') => {
      if (version === 'v1')
        return [
          sdk?.v1.NounletAuction.address,
          sdk?.v1.NounletGovernance.address,
          sdk?.v1.OptimisticBid.address
        ]

      return [
        sdk?.v2.NounletAuction.address,
        sdk?.v2.NounletGovernance.address,
        sdk?.v2.OptimisticBid.address
      ]
    },
    [sdk]
  )

  const getMerkleRoot = useCallback(
    async (version: 'v1' | 'v2' = 'v2') => {
      if (version === 'v1') {
        if (merkleRootV1 == null) {
          merkleRootV1 = new Promise(async (resolve, reject) => {
            // console.log('resolving getMerkleRootV1')
            resolve(await sdk.v1.NounletProtoform.generateMerkleTree(getProofOrder(version)))
          })
        }
        return merkleRootV1 as unknown as ReturnType<
          typeof sdk.v1.NounletProtoform.generateMerkleTree
        >
      }

      if (merkleRootV2 == null) {
        merkleRootV2 = new Promise(async (resolve, reject) => {
          // console.log('resolving getMerkleRootV2')
          resolve(await sdk.v2.NounletProtoform.generateMerkleTree(getProofOrder(version)))
        })
      }
      return merkleRootV2 as unknown as ReturnType<
        typeof sdk.v2.NounletProtoform.generateMerkleTree
      >
    },
    [sdk, getProofOrder]
  )

  const getMintProof = useCallback(
    async (version: 'v1' | 'v2' = 'v2') => {
      const merkleRoot = await getMerkleRoot(version)

      if (version === 'v1') {
        return sdk.v1.NounletProtoform.getProof(merkleRoot, 0)
      }
      return sdk.v2.NounletProtoform.getProof(merkleRoot, 0)
    },
    [sdk, getMerkleRoot]
  )

  const getDelegateProof = useCallback(
    async (version: 'v1' | 'v2' = 'v2') => {
      const merkleRoot = await getMerkleRoot(version)

      if (version === 'v1') {
        return sdk.v1.NounletProtoform.getProof(merkleRoot, 5)
      }

      return sdk.v2.NounletProtoform.getProof(merkleRoot, 5)
    },
    [sdk, getMerkleRoot]
  )

  const getBatchBurnProof = useCallback(
    async (version: 'v1' | 'v2' = 'v2') => {
      const merkleRoot = await getMerkleRoot(version)
      if (version === 'v1') {
        return sdk.v1.NounletProtoform.getProof(merkleRoot, 6)
      }

      return sdk.v2.NounletProtoform.getProof(merkleRoot, 6)
    },
    [sdk, getMerkleRoot]
  )

  const getWithdrawERC721Proof = useCallback(
    async (version: 'v1' | 'v2' = 'v2') => {
      const merkleRoot = await getMerkleRoot(version)
      if (version === 'v1') {
        return sdk.v1.NounletProtoform.getProof(merkleRoot, 7)
      }

      return sdk.v2.NounletProtoform.getProof(merkleRoot, 7)
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
