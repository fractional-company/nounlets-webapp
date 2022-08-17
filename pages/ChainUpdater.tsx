import { useEthers } from '@usedapp/core'
import Button from 'components/buttons/button'
import { BigNumber } from 'ethers'
import { generateNounletAuctionInfoKey } from 'hooks/useDisplayedNounlet'
import useSdk from 'hooks/useSdk'
import { getNouletAuctionDataFromBC, getVaultData } from 'lib/graphql/queries'
import { useEffect } from 'react'
import { useAuctionStateStore } from 'store/auctionStateStore'
import useSWR, { useSWRConfig } from 'swr'
import { SettledEvent } from 'typechain/interfaces/NounletAuctionAbi'

export default function ChainUpdater() {
  const { mutate } = useSWRConfig()
  const { account, library } = useEthers()
  const sdk = useSdk()
  const {
    setVaultAddress,
    setVaultTokenId,
    setLatestNounletId,
    setIsLoading,
    vaultAddress,
    vaultTokenAddress,
    vaultTokenId,
    latestNounletId
  } = useAuctionStateStore()

  const { mutate: refreshNounletAuctionState } = useSWR(
    sdk && { name: 'NounletAuctionState' },
    async (args) => {
      if (sdk == null) return null
      console.log('SWR', { args })

      const [apiData, blockchainData] = await Promise.all([
        getVaultData(vaultAddress),
        sdk.nounletAuction.vaultInfo(vaultAddress)
      ])
      console.log({ apiData, blockchainData })

      // If the api last auction id === blockchain currentId all is right in the world
      // if not, we have to do some manual fixing

      let lastNounletAuctioned = apiData.vault.noun.nounlets.at(-1)
      const lastNounletId = lastNounletAuctioned?.id.split('-')[1] || 1
      const blockchainCurrentId = blockchainData.currentId

      if (BigNumber.from(lastNounletId).eq(BigNumber.from(blockchainCurrentId))) {
        console.log('🌞 API is in sync')
      } else {
        console.log('💫 API out of sync. ramoving last item')
        // apiData.vault.noun.nounlets = apiData.vault.noun.nounlets.slice(0, -1)
      }

      return {
        apiData,
        latestNounletId: blockchainData.currentId.toString()
      }
    },
    {
      onSuccess: (data) => {
        if (data == null) {
          console.log('Null data')
          return
        }

        console.log('Initial data finished', data)
        const vault = data.apiData.vault
        const latestNounletId = data.latestNounletId

        // prepopulate SWR cache
        vault.noun.nounlets.map((nounlet, index) => {
          if (index >= vault.noun.nounlets.length - 1) {
            console.log('skip populating latest nounlet')
            return
          }

          console.log('🍄 populating nounlet', index + 1)
          const key = generateNounletAuctionInfoKey({
            vaultAddress: vault.id,
            vaultTokenId: vault.noun.id,
            nounletId: `${index + 1}`
          })

          mutate(key, nounlet, {
            revalidate: false
          })

          console.log({ key })
        })

        setVaultAddress(vault.id)
        setVaultTokenId(vault.noun.id)
        setLatestNounletId(latestNounletId)
        setIsLoading(false)
      },
      onError(error) {
        console.error(error)
      },
      errorRetryCount: 0
    }
  )

  // auction settled listener
  useEffect(() => {
    if (sdk == null) return
    if (latestNounletId === '0') return

    console.log('🍁 setting settled listener for ', latestNounletId)
    const nounletAuction = sdk.nounletAuction
    const settledFilter = sdk.nounletAuction.filters.Settled(
      vaultAddress,
      vaultTokenAddress,
      latestNounletId
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
    }

    nounletAuction.on(settledFilter, listener)

    return () => {
      console.log('🍂 removing listener for', latestNounletId)
      nounletAuction.off(settledFilter, listener)
    }
  }, [vaultAddress, vaultTokenAddress, vaultTokenId, latestNounletId, sdk])

  const handleForceUpdate = async () => {
    console.log('handling forced update')
    refreshNounletAuctionState()
  }

  const handleGetAuctionInfo = async () => {
    if (sdk == null) return

    console.log('handling forced update')
    const result = await getNouletAuctionDataFromBC(
      vaultAddress,
      vaultTokenAddress,
      '0',
      '1',
      sdk.nounletAuction,
      latestNounletId.toString()
    )

    console.log('result', result)
  }

  const handleTest = async () => {
    if (sdk == null) return

    console.log('handling test')
    const nounletAuction = sdk.nounletAuction
    const settledFilter = sdk.nounletAuction.filters.Settled(vaultAddress, vaultTokenAddress, '1')

    console.log('result', await nounletAuction.queryFilter(settledFilter))
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
