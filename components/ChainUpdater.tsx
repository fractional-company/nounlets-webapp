import Button from 'components/buttons/button'
import { BigNumber } from 'ethers'
import useDisplayedNounlet from 'hooks/useDisplayedNounlet'
import useSdk from 'hooks/useSdk'
import { getVaultMetadata } from 'lib/graphql/queries'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useVaultMetadataStore } from 'store/vaultMetadataStore'
import useSWR, { useSWRConfig } from 'swr'
// import { SettledEvent } from 'typechain/interfaces/NounletAuctionAbi'

export default function ChainUpdater() {
  const router = useRouter()
  const sdk = useSdk()
  const { mutate: mutateSWRGlobal } = useSWRConfig()
  const {
    isLoading,
    vaultAddress,
    nounletTokenAddress,
    currentDelegate,
    latestNounletTokenId,
    setIsLoading,
    setVaultCuratorAddress,
    setCurrentDelegate,
    setNounletTokenAddress,
    setBackendLatestNounletTokenId,
    setLatestNounletTokenId
  } = useVaultMetadataStore()

  // url nid listener
  const { nid } = useDisplayedNounlet()

  // If overshoot, redirect to "/"
  useEffect(() => {
    if (nid == null) return
    const targetNid = +nid
    if (targetNid <= 0 || targetNid > +latestNounletTokenId) {
      console.log('Not in range')
      router.replace('/')
    }
  }, [nid, isLoading, latestNounletTokenId, router])

  // ====================================================
  // Vault metadata
  // ====================================================

  const { mutate: refreshVaultMetadata } = useSWR(
    router.isReady &&
      sdk != null && {
        name: 'VaultMetadata',
        vaultAddress: vaultAddress
      },
    async (key) => {
      if (sdk == null) throw new Error('sdk not initialized')

      console.groupCollapsed('🏳️ fetching vault metadata ...')
      console.log({ ...key })
      console.groupEnd()

      const [vaultMetadata, vaultInfo, currentDelegate] = await Promise.all([
        getVaultMetadata(key.vaultAddress),
        sdk.NounletAuction.vaultInfo(vaultAddress),
        sdk.NounletGovernance.currentDelegate(vaultAddress)
      ])

      return {
        ...vaultMetadata,
        ...vaultInfo,
        currentDelegate
      }
    },
    {
      errorRetryCount: 0, // TODO change to 2
      onError: (error) => {
        console.error(error)
      },
      onSuccess: (data) => {
        console.groupCollapsed('🏴 fetched vault metadata ...')
        console.table(data)
        console.groupEnd()

        if (data.nounletCount > 0) {
          setNounletTokenAddress(data.nounletTokenAddress)
          setVaultCuratorAddress(data.curator)
          setCurrentDelegate(data.currentDelegate)
          setBackendLatestNounletTokenId(`${data.nounletCount}`)
          setLatestNounletTokenId(`${data.currentId.toString()}`)
          setIsLoading(false)
        } else {
          console.log('an auction should already be running')
        }
      }
    }
  )

  // ====================================================
  // Settled event
  // ====================================================

  useEffect(() => {
    if (sdk == null) return
    if (latestNounletTokenId === '') return

    console.log('🍁 setting SETTLED listener for ', latestNounletTokenId)
    const nounletAuction = sdk.NounletAuction
    const settledFilter = sdk.NounletAuction.filters.Settled(
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
      event: any
    ) => {
      console.log('settled event!', vault, token, id, winner, amount, event)
      nounletAuction.off(settledFilter, listener)
      refreshVaultMetadata()
    }

    nounletAuction.on(settledFilter, listener)

    return () => {
      console.log('🍂 removing SETTLED listener for', latestNounletTokenId)
      nounletAuction.off(settledFilter, listener)
    }
  }, [vaultAddress, nounletTokenAddress, latestNounletTokenId, sdk, refreshVaultMetadata])

  // ====================================================
  // Delegate change
  // ====================================================

  useEffect(() => {
    if (sdk == null) return
    if (latestNounletTokenId === '') return
    console.log('⚔️ setting DELEGATE listener TODO')
  }, [vaultAddress, nounletTokenAddress, latestNounletTokenId, sdk, refreshVaultMetadata])

  const handleTest = async () => {
    if (sdk == null) return

    refreshVaultMetadata()

    console.log('handling test')
    // const nounletAuction = sdk.NounletAuction
    // const settledFilter = sdk.NounletAuction.filters.Settled(vaultAddress, vaultTokenAddress, '1')

    // console.log('result', await NounletAuction.queryFilter(settledFilter))
  }

  return (
    <>
      <Button className="primary" onClick={() => handleTest()}>
        TEST
      </Button>
    </>
  )
}
