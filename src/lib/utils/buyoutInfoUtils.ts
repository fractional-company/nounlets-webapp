import { NEXT_PUBLIC_REJECTION_PERIOD } from 'config'
import OptimisticBidABI from 'eth-sdk/abis/goerli/v2/nounlets/OptimisticBid.json'
import { BigNumber } from 'ethers'
import { Contract as MulticallContract, Provider as MulticallProvider } from 'ethers-multicall'
import { NounletsSDK } from 'src/hooks/utils/useSdk'
import {
  BuyoutInfo,
  BuyoutInfoPartial,
  BuyoutOffer,
  BuyoutState
} from 'src/store/buyout/buyout.store'

export async function getBuyoutBidInfo(
  sdk: NounletsSDK,
  vaultAddress: string,
  nounletTokenAddres: string,
  nounTokenId: string
): Promise<BuyoutInfo> {
  const bidInfo = await getBidInfo(sdk, nounTokenId, vaultAddress)
  const startEvents = await getStartEvents(sdk, nounTokenId, vaultAddress)
  const lastStartEvent = startEvents.at(-1)
  let fractionsOffered: BigNumber[] = []
  let fractionsRemaining: BigNumber[] = []
  let fractionsOfferedCount = BigNumber.from(0)
  let fractionsOfferedPrice = BigNumber.from(0)
  let wasNounWithdrawn = false

  // Is the buyout in progress or end state?
  if (bidInfo.state !== 0 && lastStartEvent) {
    if (
      lastStartEvent.proposer === bidInfo.proposer &&
      lastStartEvent.startTime.eq(bidInfo.startTime)
    ) {
      const [offered, remaining] = await getStartEventFractions(
        sdk,
        nounTokenId,
        nounletTokenAddres,
        lastStartEvent
      )
      fractionsOffered = offered
      fractionsRemaining = remaining
      fractionsOfferedCount = BigNumber.from(offered.length)
      fractionsOfferedPrice = fractionsOfferedCount.mul(bidInfo.fractionPrice)
      bidInfo.initialEthBalance = lastStartEvent.buyoutPrice.sub(fractionsOfferedPrice)
    }

    if (bidInfo.state === BuyoutState.SUCCESS) {
      try {
        const currentOwner = (
          await sdk.getFor(nounTokenId).NounsToken.ownerOf(nounTokenId)
        ).toLowerCase()
        const isHeldByVault = currentOwner === vaultAddress.toLowerCase()
        wasNounWithdrawn = !isHeldByVault
      } catch (error) {}
    }
  }

  const offers: BuyoutOffer[] = startEvents.map((event) => {
    if (event === lastStartEvent) {
      return {
        id: event.tx.transactionHash,
        sender: event.proposer,
        value: event.buyoutPrice,
        txHash: event.tx.transactionHash,
        state: bidInfo.state
      }
    }

    return {
      id: event.tx.transactionHash,
      sender: event.proposer,
      value: event.buyoutPrice,
      txHash: event.tx.transactionHash,
      state: BuyoutState.INACTIVE
    }
  })

  return {
    ...bidInfo,
    fractionsOffered,
    fractionsRemaining,
    fractionsOfferedCount,
    fractionsOfferedPrice,
    offers,
    wasNounWithdrawn
  }
}

async function getBidInfo(
  sdk: NounletsSDK,
  nounTokenId: string,
  vaultAddress: string
): Promise<BuyoutInfoPartial> {
  const bidInfo = await sdk.getFor(nounTokenId).OptimisticBid.bidInfo(vaultAddress)
  const endTime = bidInfo.startTime.add(NEXT_PUBLIC_REJECTION_PERIOD)
  return {
    startTime: bidInfo.startTime,
    endTime: endTime,
    proposer: bidInfo.proposer,
    state: bidInfo.state,
    fractionPrice: bidInfo.fractionPrice,
    ethBalance: bidInfo.ethBalance,
    lastTotalSupply: bidInfo.lastTotalSupply,
    initialEthBalance: bidInfo.ethBalance
  }
}

async function getStartEvents(sdk: NounletsSDK, nounTokenId: string, vaultAddress: string) {
  const filter = sdk.getFor(nounTokenId).OptimisticBid.filters.Start(vaultAddress)
  const events = await sdk.getFor(nounTokenId).OptimisticBid.queryFilter(filter)
  const formattedEvents = events
    .map((startEvent) => {
      return {
        vault: startEvent.args._vault,
        proposer: startEvent.args._proposer,
        buyoutPrice: startEvent.args._buyoutPrice,
        fractionPrice: startEvent.args._fractionPrice,
        startTime: startEvent.args._startTime,
        tx: startEvent
      }
    })
    .sort((a, b) => (a.startTime.gte(b.startTime) ? 1 : -1))
  return formattedEvents
}

async function getStartEventFractions(
  sdk: NounletsSDK,
  nounTokenId: string,
  nounletTokenAddres: string,
  event: Awaited<ReturnType<typeof getStartEvents>>[0]
) {
  const nounletToken = sdk.getFor(nounTokenId).NounletToken.attach(nounletTokenAddres)
  const tx = await event.tx.getTransactionReceipt()
  const fractionsOffered: BigNumber[] =
    tx.logs
      .filter((log) => {
        return log.address.toLowerCase() === nounletToken.address.toLowerCase()
      })
      .map((log) => nounletToken.interface.parseLog(log))
      .filter((log) => {
        return (
          log.name ===
          nounletToken.interface.events[
            'TransferBatch(address,address,address,uint256[],uint256[])'
          ].name
        )
      })
      .map((event) => {
        return event.args[3] || []
      })[0] || []

  const fractionsRemaining = await getOptimisticBidBalances(
    sdk,
    nounTokenId,
    nounletTokenAddres,
    fractionsOffered
  )

  return [fractionsOffered, fractionsRemaining]
}

async function getOptimisticBidBalances(
  sdk: NounletsSDK,
  nounTokenId: string,
  nounletTokenAddres: string,
  fractionsOffered: BigNumber[]
): Promise<BigNumber[]> {
  const nounletToken = sdk.getFor(nounTokenId).NounletToken.attach(nounletTokenAddres)
  const optimisticBid = sdk.getFor(nounTokenId).OptimisticBid
  const balances = await nounletToken.balanceOfBatch(
    fractionsOffered.map((_) => optimisticBid.address),
    fractionsOffered
  )

  const fractionsRemaining: BigNumber[] = []
  fractionsOffered.forEach((nounletId, index) => {
    if (balances[index].eq(1)) {
      fractionsRemaining.push(fractionsOffered[index])
    }
  })

  return fractionsRemaining
}

export async function getBatchNounBidInfo(
  sdk: NounletsSDK,
  multicallProvider: MulticallProvider,
  addresses: { id: string; nounTokenId: string }[]
) {
  try {
    await multicallProvider.init()
    const mcV1 = new MulticallContract(sdk.v1.OptimisticBid.address, OptimisticBidABI.slice(0, -1))
    const mcV2 = new MulticallContract(sdk.v2.OptimisticBid.address, OptimisticBidABI.slice(0, -1))

    console.log('addresses', addresses)

    const calls = addresses.map((address) => {
      return (sdk.getVersion(address.nounTokenId) === 'v1' ? mcV1 : mcV2).bidInfo(address.id)
    })

    const nounBidInfoArray = (await multicallProvider.all(calls)) as Awaited<
      ReturnType<typeof sdk.v2.OptimisticBid.bidInfo>
    >[]
    console.log('results', nounBidInfoArray)
    return nounBidInfoArray
  } catch (error) {
    console.log('multicallProvider error', error)
    throw error
  }
}

// export async function getBatchTributeInfo(sdk: NounletsSDK, library: any, tokenIds: string[]) {
//   const multicallProvider = new MulticallProvider(library!)
//   await multicallProvider.init()
//   const mc = new MulticallContract(sdk.v2.NounsToken.address, NounsTokenABI)
//   const calls = tokenIds.map((tokenId) => {
//     return mc.getApproved(tokenId)
//   })

//   const approveArray = (await multicallProvider.all(calls)) as Awaited<
//     ReturnType<typeof sdk.v2.NounsToken.getApproved>
//   >[]

//   return approveArray.map(
//     (approveAddress) =>
//       approveAddress.toLowerCase() === sdk.v2.NounletProtoform.address.toLowerCase()
//   )
// }
