import { getGoerliSdk } from '@dethcrypto/eth-sdk-client'
import { useEthers } from '@usedapp/core'
import Button from 'components/buttons/button'
import OnMounted from 'components/utils/on-mounted'
import { CHAIN_ID, NEXT_PUBLIC_NOUN_VAULT_ADDRESS } from 'config'
import { BigNumber } from 'ethers'
import useLeaderboard from 'hooks/useLeaderboard'
import useSdk from 'hooks/useSdk'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useVaultStore } from 'store/vaultStore'

const Settings: NextPage<{ url: string }> = ({ url }) => {
  const router = useRouter()

  useEffect(() => {
    if (CHAIN_ID === 1) {
      router.replace('/')
    }
  }, [router])

  if (CHAIN_ID === 1) return <div>hi</div>
  return (
    <OnMounted>
      <_Settings />
    </OnMounted>
  )
}
export default Settings

const _Settings = () => {
  const { account, library } = useEthers()
  const sdk = useSdk()
  const { isLive, isLoading, vaultAddress, nounletTokenAddress, latestNounletTokenId } =
    useVaultStore()
  const environment = {
    NEXT_PUBLIC_NOUN_VAULT_ADDRESS: process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS,
    NEXT_PUBLIC_NOUN_VAULT_ADDRESS_OVERRIDE: NEXT_PUBLIC_NOUN_VAULT_ADDRESS,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_CACHE_VERSION: process.env.NEXT_PUBLIC_CACHE_VERSION,
    NEXT_PUBLIC_SHOW_DEBUG: process.env.NEXT_PUBLIC_SHOW_DEBUG,
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

  const [nounId, setNounId] = useState('Press the button')
  const mintANoun = async () => {
    let lastEvent = null
    try {
      setNounId('Minting...')
      if (library == null || sdk == null || account == null)
        throw new Error('sdk or account missing')
      const mintHelper = getGoerliSdk(library).nounlets.MintHelper.connect(library.getSigner())
      const nounsToken = getGoerliSdk(library).nounlets.NounsToken

      const tx = await mintHelper.mint()
      const result = await tx.wait()

      // // // const result = testObj
      // console.log({ result })
      lastEvent = result.logs
        .map((log) => nounsToken.interface.parseLog(log))
        .filter((log) => {
          return log.name === nounsToken.interface.events['Approval(address,address,uint256)'].name
        })
        .at(-1)
    } catch (error) {
      setNounId('Error')
    }

    setNounId('' + (lastEvent!.args[2] as BigNumber).toNumber())
    return (lastEvent!.args[2] as BigNumber).toNumber()
  }

  const [nounIdToVault, setNounIdToVault] = useState('')
  const [newVaultAddress, setNewVaultAddress] = useState('Press the button')
  const createVault = async () => {
    if (library == null || sdk == null || account == null) throw new Error('sdk or account missing')
    console.log('creating vault')
    setNewVaultAddress('Creating ...')
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
      nounIdToVault
    )

    return tx
      .wait()
      .then((res) => {
        console.log('Vault deployed', res)
        const vaultDeployedLog = res.logs[10]
        console.log(vaultDeployedLog)
        const log = sdk!.NounletProtoform.interface.parseLog(vaultDeployedLog)
        const vault = log.args._vault
        // nounletAuction.createAuction()

        setNewVaultAddress(vault)
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  const [currentOverride, setCurrentOverride] = useState(
    localStorage.getItem('NEXT_PUBLIC_NOUN_VAULT_ADDRESS_OVERRIDE') || ''
  )
  const [overrideAddress, setOverrideAddress] = useState(currentOverride)

  const handleOverride = async (address: string) => {
    if (address == null || address.trim() === '') {
      localStorage.removeItem('NEXT_PUBLIC_NOUN_VAULT_ADDRESS_OVERRIDE')
      setCurrentOverride('')
      return
    }

    localStorage.setItem('NEXT_PUBLIC_NOUN_VAULT_ADDRESS_OVERRIDE', address.trim())
    setCurrentOverride(address.trim())
  }

  const test = async () => {
    const res = {
      to: '0xe5DBA9c4c859dc14DD1f45AB624b0833Df856D99',
      from: '0x497F34f8A6EaB10652f846fD82201938e58d72E0',
      contractAddress: null,
      transactionIndex: 46,
      gasUsed: {
        type: 'BigNumber',
        hex: '0x0a31cf'
      },
      logsBloom:
        '0x000000000000220010002000000000000100020000000220000000002000040000400000000002010000040000800000210840000100000000000000002420000280200000000000400010080020002000000200000400000000000000000000000000000200400000400800000008000008000000000010000000100010000010000008000010000000000000c0000000000000000000000000000000000000060000008000000000000000000000000000000000000000002000000000000080000082000000000000000000000801000000200008000000000000000064680010000000000000000000000004000000000000000040000800080000002100',
      blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45',
      transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
      logs: [
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x97c5c18FdC04b9Bd2B09C7f4C96EAA1f2041F8ED',
          topics: ['0xa5cc5eda71539c8269d42d17b901a4f0ad8b0049bc072740431f853ee3bebfbe'],
          data: '0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 67,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x2796cFF562dB391d233d9578Bfa8B7D1d0247525',
          topics: [
            '0xc836d877ec2901a6c3f2e17c94bf617570a3664e9c75f6a9c5e48696cde1343d',
            '0x000000000000000000000000497f34f8a6eab10652f846fd82201938e58d72e0',
            '0x000000000000000000000000920ae8df5bb3ea54b02995488f656af04767f7cf',
            '0x000000000000000000000000920ae8df5bb3ea54b02995488f656af04767f7cf'
          ],
          data: '0x00000000000000000000000000000000000000000000000000000000000000047883592b414e7949e629c9b1e42755362438285d1e3764315adf8c69c145010500000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed',
          logIndex: 68,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x920AE8dF5bb3ea54b02995488f656Af04767f7CF',
          topics: [
            '0x09d75e12e349f79020715b0ea7b2c707e8acf1889b6d6f1337fce7f4e1b9e5c7',
            '0x00000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed',
            '0x0000000000000000000000006ab294d5298cde07a9dfa35804d5bc750eebaeba'
          ],
          data: '0x',
          logIndex: 69,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0xcB828eB951D629F45b4995C0B8E1dd4E1356B311',
          topics: [
            '0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724',
            '0x000000000000000000000000497f34f8a6eab10652f846fd82201938e58d72e0'
          ],
          data: '0x00000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000004',
          logIndex: 70,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0xcB828eB951D629F45b4995C0B8E1dd4E1356B311',
          topics: [
            '0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724',
            '0x00000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed'
          ],
          data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
          logIndex: 71,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0xcB828eB951D629F45b4995C0B8E1dd4E1356B311',
          topics: [
            '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
            '0x000000000000000000000000497f34f8a6eab10652f846fd82201938e58d72e0',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x000000000000000000000000000000000000000000000000000000000000000c'
          ],
          data: '0x',
          logIndex: 72,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0xcB828eB951D629F45b4995C0B8E1dd4E1356B311',
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x000000000000000000000000497f34f8a6eab10652f846fd82201938e58d72e0',
            '0x00000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed',
            '0x000000000000000000000000000000000000000000000000000000000000000c'
          ],
          data: '0x',
          logIndex: 73,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x6Ab294D5298cdE07a9DFa35804d5BC750EebaEBa',
          topics: [
            '0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724',
            '0x0000000000000000000000005b5a2f444753e600a85e30b7127f6597338e5b51'
          ],
          data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
          logIndex: 74,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x6Ab294D5298cdE07a9DFa35804d5BC750EebaEBa',
          topics: [
            '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
            '0x000000000000000000000000920ae8df5bb3ea54b02995488f656af04767f7cf',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000005b5a2f444753e600a85e30b7127f6597338e5b51'
          ],
          data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001',
          logIndex: 75,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x5b5a2f444753e600a85E30B7127F6597338E5b51',
          topics: [
            '0x7b5c62c6d40d7529b5a806d3480360990bb603feb8eefc47d0f213c4d4e6e066',
            '0x00000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed',
            '0x0000000000000000000000006ab294d5298cde07a9dfa35804d5bc750eebaeba',
            '0x0000000000000000000000000000000000000000000000000000000000000001'
          ],
          data: '0x000000000000000000000000000000000000000000000000000000006336dcb0',
          logIndex: 76,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0xe5DBA9c4c859dc14DD1f45AB624b0833Df856D99',
          topics: [
            '0x52365e9ef2d02ef2b8eb0ee7b91a0809adf17e90a5418ed54c7c137fe66aaa90',
            '0x00000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed'
          ],
          data: '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000030000000000000000000000005b5a2f444753e600a85e30b7127f6597338e5b51000000000000000000000000e15aabde61acfb2429d38c0e38fcaf5bec42ab32000000000000000000000000ddf0e892f0c514dd7197799762d2a3c9dc823699',
          logIndex: 77,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        }
      ],
      blockNumber: 7686292,
      confirmations: 2,
      cumulativeGasUsed: {
        type: 'BigNumber',
        hex: '0x5f2fd6'
      },
      effectiveGasPrice: {
        type: 'BigNumber',
        hex: '0x02b9a10aa1'
      },
      status: 1,
      type: 2,
      byzantium: true,
      events: [
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x97c5c18FdC04b9Bd2B09C7f4C96EAA1f2041F8ED',
          topics: ['0xa5cc5eda71539c8269d42d17b901a4f0ad8b0049bc072740431f853ee3bebfbe'],
          data: '0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          logIndex: 67,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x2796cFF562dB391d233d9578Bfa8B7D1d0247525',
          topics: [
            '0xc836d877ec2901a6c3f2e17c94bf617570a3664e9c75f6a9c5e48696cde1343d',
            '0x000000000000000000000000497f34f8a6eab10652f846fd82201938e58d72e0',
            '0x000000000000000000000000920ae8df5bb3ea54b02995488f656af04767f7cf',
            '0x000000000000000000000000920ae8df5bb3ea54b02995488f656af04767f7cf'
          ],
          data: '0x00000000000000000000000000000000000000000000000000000000000000047883592b414e7949e629c9b1e42755362438285d1e3764315adf8c69c145010500000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed',
          logIndex: 68,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x920AE8dF5bb3ea54b02995488f656Af04767f7CF',
          topics: [
            '0x09d75e12e349f79020715b0ea7b2c707e8acf1889b6d6f1337fce7f4e1b9e5c7',
            '0x00000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed',
            '0x0000000000000000000000006ab294d5298cde07a9dfa35804d5bc750eebaeba'
          ],
          data: '0x',
          logIndex: 69,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0xcB828eB951D629F45b4995C0B8E1dd4E1356B311',
          topics: [
            '0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724',
            '0x000000000000000000000000497f34f8a6eab10652f846fd82201938e58d72e0'
          ],
          data: '0x00000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000004',
          logIndex: 70,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0xcB828eB951D629F45b4995C0B8E1dd4E1356B311',
          topics: [
            '0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724',
            '0x00000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed'
          ],
          data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
          logIndex: 71,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0xcB828eB951D629F45b4995C0B8E1dd4E1356B311',
          topics: [
            '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
            '0x000000000000000000000000497f34f8a6eab10652f846fd82201938e58d72e0',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x000000000000000000000000000000000000000000000000000000000000000c'
          ],
          data: '0x',
          logIndex: 72,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0xcB828eB951D629F45b4995C0B8E1dd4E1356B311',
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x000000000000000000000000497f34f8a6eab10652f846fd82201938e58d72e0',
            '0x00000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed',
            '0x000000000000000000000000000000000000000000000000000000000000000c'
          ],
          data: '0x',
          logIndex: 73,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x6Ab294D5298cdE07a9DFa35804d5BC750EebaEBa',
          topics: [
            '0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724',
            '0x0000000000000000000000005b5a2f444753e600a85e30b7127f6597338e5b51'
          ],
          data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
          logIndex: 74,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x6Ab294D5298cdE07a9DFa35804d5BC750EebaEBa',
          topics: [
            '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
            '0x000000000000000000000000920ae8df5bb3ea54b02995488f656af04767f7cf',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000005b5a2f444753e600a85e30b7127f6597338e5b51'
          ],
          data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001',
          logIndex: 75,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0x5b5a2f444753e600a85E30B7127F6597338E5b51',
          topics: [
            '0x7b5c62c6d40d7529b5a806d3480360990bb603feb8eefc47d0f213c4d4e6e066',
            '0x00000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed',
            '0x0000000000000000000000006ab294d5298cde07a9dfa35804d5bc750eebaeba',
            '0x0000000000000000000000000000000000000000000000000000000000000001'
          ],
          data: '0x000000000000000000000000000000000000000000000000000000006336dcb0',
          logIndex: 76,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45'
        },
        {
          transactionIndex: 46,
          blockNumber: 7686292,
          transactionHash: '0x49e2d4746af83a19be22770776c547edfd4810c70170e7553ed9ad4fec10576f',
          address: '0xe5DBA9c4c859dc14DD1f45AB624b0833Df856D99',
          topics: [
            '0x52365e9ef2d02ef2b8eb0ee7b91a0809adf17e90a5418ed54c7c137fe66aaa90',
            '0x00000000000000000000000097c5c18fdc04b9bd2b09c7f4c96eaa1f2041f8ed'
          ],
          data: '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000030000000000000000000000005b5a2f444753e600a85e30b7127f6597338e5b51000000000000000000000000e15aabde61acfb2429d38c0e38fcaf5bec42ab32000000000000000000000000ddf0e892f0c514dd7197799762d2a3c9dc823699',
          logIndex: 77,
          blockHash: '0xd407ffada232f0626f2b3997653f4b51478641ce0159938b0c163c68df650b45',
          args: [
            '0x97c5c18FdC04b9Bd2B09C7f4C96EAA1f2041F8ED',
            [
              '0x5b5a2f444753e600a85E30B7127F6597338E5b51',
              '0xE15aAbDE61Acfb2429D38c0e38FCaf5BEC42Ab32',
              '0xdDf0e892F0c514DD7197799762D2A3c9Dc823699'
            ]
          ],
          event: 'ActiveModules',
          eventSignature: 'ActiveModules(address,address[])'
        }
      ]
    }

    console.log('Vault deployed', res)
    const vaultDeployedLog = res.logs[10]
    console.log(vaultDeployedLog)
    const log = sdk!.NounletProtoform.interface.parseLog(vaultDeployedLog)
    const vault = log.args._vault
    console.log(vault)
  }

  return (
    <div className="p-4 flex flex-col gap-3 text-px16">
      <h1 className="font-600">Settings</h1>
      <div className="px-4">
        <h1 className="font-600">ENV</h1>
        <pre>{JSON.stringify(environment, null, 4)}</pre>
      </div>
      <div className="px-4">
        <h1 className="font-600">Vault METADATA</h1>
        <pre>{JSON.stringify(vaultMetadata, null, 4)}</pre>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-px32 font-500">MINTING</p>
        <Button className="primary" onClick={() => mintANoun()}>
          mintANoun
        </Button>
        <p className="text-px16">
          Minted ID: <span className="p-2 bg-gray-1 rounded-xl text-px24">{nounId}</span>
        </p>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-px32 font-500">VAULTING</p>
        <div>
          <input
            type="text"
            value={nounIdToVault}
            onChange={(e) => setNounIdToVault(e.target.value)}
            placeholder="Noun token ID from above"
            className="p-2 border-2 border-gray-3 rounded-md"
          />
        </div>
        <Button className="primary" onClick={() => createVault()}>
          Create a Vault
        </Button>
        <p className="text-px16">
          New Vault address:{' '}
          <span className="p-2 bg-gray-1 rounded-xl text-px24">{newVaultAddress}</span>
        </p>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-px32 font-500">OVERRIDE VAULT ADDRESS</p>
        <div>
          <input
            type="text"
            value={overrideAddress}
            onChange={(e) => setOverrideAddress(e.target.value)}
            placeholder="Override ENV address"
            className="p-2 border-2 border-gray-3 rounded-md w-[500px]"
          />
        </div>
        <Button className="primary" onClick={() => handleOverride(overrideAddress)}>
          Override
        </Button>
        <p className="text-px16">
          Current override:{' '}
          <span className="p-2 bg-gray-1 rounded-xl text-px24">{currentOverride}</span>
        </p>
      </div>
    </div>
  )
}
