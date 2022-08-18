import { useEthers } from '@usedapp/core'
import Button from 'components/buttons/button'
import { BigNumber } from 'ethers'
import { generateNounletAuctionInfoKey } from 'hooks/useDisplayedNounlet'
import useSdk from 'hooks/useSdk'
import { getNouletAuctionDataFromBC, getVaultData, getVaultMetadata } from 'lib/graphql/queries'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuctionStateStore } from 'store/auctionStateStore'
import { useVaultMetadataStore } from 'store/VaultMetadataStore'
import useSWR, { useSWRConfig } from 'swr'
import { SettledEvent } from 'typechain/interfaces/NounletAuctionAbi'

export default function ChainUpdater() {
  const router = useRouter()
  const sdk = useSdk()
  const { mutate: mutateSWRGlobal } = useSWRConfig()
  const {
    isLoading,
    setNounletTokenAddress,
    setBackendLatestNounletTokenId,
    setLatestNounletTokenId,
    setIsLoading,
    vaultAddress,
    nounletTokenAddress,
    latestNounletTokenId
  } = useVaultMetadataStore()

  // url nid listener
  const { nid } = router.query

  useEffect(() => {
    console.log(router.isReady, nid)
    if (nid == null || latestNounletTokenId == '') return
    if (nid === '0' || +nid > +latestNounletTokenId) {
      router.push('/')
    }
  }, [router, nid, latestNounletTokenId])

  const { mutate: refreshVaultMetadata } = useSWR(
    router.isReady &&
      sdk != null && {
        name: 'VaultMetadata',
        vaultAddress: vaultAddress
      },
    async (key) => {
      if (sdk == null) throw new Error('sdk not initialized')

      console.log('🏳️ fetching vault metadata ...')
      console.log({ ...key })

      const [vaultMetadata, vaultInfo] = await Promise.all([
        getVaultMetadata(key.vaultAddress),
        sdk.nounletAuction.vaultInfo(vaultAddress)
      ])

      return {
        ...vaultMetadata,
        latestNounletId: vaultInfo.currentId.toString()
      }
    },
    {
      errorRetryCount: 0, // TODO change to 2
      onError: (error) => {
        console.error(error)
      },
      onSuccess: (data) => {
        console.log('🏴 fetched vault metadata ...')
        console.table(data)

        if (data.nounletCount > 0) {
          setNounletTokenAddress(data.nounletTokenAddress)
          setBackendLatestNounletTokenId(`${data.nounletCount}`)
          setLatestNounletTokenId(`${data.latestNounletId}`)
          setIsLoading(false)
        } else {
          console.log('an auction should already be running')
        }
      }
    }
  )

  useEffect(() => {
    if (isLoading) return
    if (nid == null) return
    const targetNid = +(nid as string)
    if (targetNid > +latestNounletTokenId) {
      console.log('TODO: overshoot. navigate to index')
    }
  }, [nid, isLoading, latestNounletTokenId])

  // const { mutate: refreshNounletAuctionState } = useSWR(
  //   false && router.isReady && sdk && { name: 'NounletAuctionState' },
  //   async (args) => {
  //     if (sdk == null) return null
  //     console.log('SWR', { args })

  //     const [apiData, blockchainData] = await Promise.all([
  //       getVaultData(vaultAddress),
  //       sdk.nounletAuction.vaultInfo(vaultAddress)
  //     ])
  //     console.log({ apiData, blockchainData })

  //     // If the api last auction id === blockchain currentId all is right in the world
  //     // if not, we have to do some manual fixing
  //     // EDIT: actually it fixes itself by fetching blockchain data
  //     let lastNounletAuctioned = apiData.vault.noun.nounlets.at(-1)
  //     const lastNounletId = lastNounletAuctioned?.id.split('-')[1] || 1
  //     const blockchainCurrentId = blockchainData.currentId

  //     if (BigNumber.from(lastNounletId).eq(BigNumber.from(blockchainCurrentId))) {
  //       console.log('🌞 API is in sync')
  //     } else {
  //       console.log('💫 API out of sync. ramoving last item')
  //       // apiData.vault.noun.nounlets = apiData.vault.noun.nounlets.slice(0, -1)
  //     }

  //     return {
  //       apiData,
  //       latestNounletId: blockchainData.currentId.toString()
  //     }
  //   },
  //   {
  //     onSuccess: (data) => {
  //       if (data == null) {
  //         console.log('Null data')
  //         return
  //       }

  //       console.log('Initial data finished', data)
  //       const vault = data.apiData.vault
  //       const latestNounletId = data.latestNounletId

  //       // prepopulate SWR cache
  //       vault.noun.nounlets.map((nounlet, index) => {
  //         if (index >= vault.noun.nounlets.length - 1) {
  //           console.log('skip populating latest nounlet')
  //           return
  //         }

  //         console.log('🍄 populating nounlet', index + 1)
  //         const key = generateNounletAuctionInfoKey({
  //           vaultAddress: vault.id,
  //           vaultTokenId: vault.noun.id,
  //           nounletId: `${index + 1}`
  //         })

  //         mutateSWRGlobal(key, nounlet, {
  //           revalidate: false
  //         })

  //         console.log({ key })
  //       })

  //       setVaultAddress(vault.id)
  //       setVaultTokenId(vault.noun.id)
  //       setLatestNounletId(latestNounletId)
  //       setIsLoading(false)
  //     },
  //     onError(error) {
  //       console.error(error)
  //     },
  //     errorRetryCount: 0
  //   }
  // )

  // auction settled listener
  useEffect(() => {
    if (sdk == null) return
    if (latestNounletTokenId === '') return

    console.log('🍁 setting settled listener for ', latestNounletTokenId)
    const nounletAuction = sdk.nounletAuction
    const settledFilter = sdk.nounletAuction.filters.Settled(
      vaultAddress,
      nounletTokenAddress,
      latestNounletTokenId
    )
    const listener = (
      vault: string,
      token: string,
      id: BigNumber,
      winner: string,
      amount: BigNumber,
      event: SettledEvent
    ) => {
      console.log('settled event!', vault, token, id, winner, amount, event)
      nounletAuction.off(settledFilter, listener)
      refreshVaultMetadata()
    }

    nounletAuction.on(settledFilter, listener)

    return () => {
      console.log('🍂 removing listener for', latestNounletTokenId)
      nounletAuction.off(settledFilter, listener)
    }
  }, [vaultAddress, nounletTokenAddress, latestNounletTokenId, sdk, refreshVaultMetadata])

  const handleForceUpdate = async () => {
    console.log('handling forced update')
    // refreshNounletAuctionState()
  }

  const handleGetAuctionInfo = async () => {
    if (sdk == null) return

    // console.log('handling forced update')
    // const result = await getNouletAuctionDataFromBC(
    //   vaultAddress,
    //   vaultTokenAddress,
    //   '0',
    //   '1',
    //   sdk.nounletAuction,
    //   latestNounletId.toString()
    // )

    // console.log('result', result)
  }

  const handleTest = async () => {
    if (sdk == null) return

    console.log('handling test')
    // const nounletAuction = sdk.nounletAuction
    // const settledFilter = sdk.nounletAuction.filters.Settled(vaultAddress, vaultTokenAddress, '1')

    // console.log('result', await nounletAuction.queryFilter(settledFilter))
  }

  return (
    <>
      <Button className="primary" onClick={() => handleForceUpdate()}>
        Force update
      </Button>
      <Button className="primary" onClick={() => handleGetAuctionInfo()}>
        Get auction info
      </Button>
      <Button className="primary" onClick={() => handleTest()}>
        TEST
      </Button>
    </>
  )
}
