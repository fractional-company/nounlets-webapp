import { BigNumber } from 'ethers'
import { NounletsSDK } from 'hooks/useSdk'
import { BuyoutInfo, BuyoutInfoPartial, BuyoutOffer, BuyoutState } from 'store/buyout/buyout.store'

let REJECTION_PERIOD: number | null = null

export async function getBuyoutBidInfo(
  sdk: NounletsSDK,
  vaultAddress: string,
  nounletTokenAddres: string,
  nounTokenId: string
): Promise<BuyoutInfo> {
  const bidInfo = await getBidInfo(sdk, vaultAddress)
  const startEvents = await getStartEvents(sdk, vaultAddress)
  const lastStartEvent = startEvents.at(-1)
  let fractionsOffered: BigNumber[] = []
  let fractionsRemaining: BigNumber[] = []
  let fractionsOfferedCount = BigNumber.from(0)
  let fractionsOfferedPrice = BigNumber.from(0)
  let wasNounWithdrawn = false

  console.log({ bidInfo, startEvents, lastStartEvent })
  console.log('Current bid info', { bidInfo })

  // Is the buyout in progress or end state?
  if (bidInfo.state !== 0 && lastStartEvent) {
    console.log('getBuyoutBidInfo', bidInfo.state, lastStartEvent)
    if (
      lastStartEvent.proposer === bidInfo.proposer &&
      lastStartEvent.startTime.eq(bidInfo.startTime)
    ) {
      const [offered, remaining] = await getStartEventFractions(
        sdk,
        nounletTokenAddres,
        lastStartEvent
      )
      fractionsOffered = offered
      fractionsRemaining = remaining
      fractionsOfferedCount = BigNumber.from(offered.length)
      fractionsOfferedPrice = fractionsOfferedCount.mul(bidInfo.fractionPrice)
      bidInfo.initialEthBalance = lastStartEvent.buyoutPrice
    }

    if (bidInfo.state === BuyoutState.SUCCESS) {
      try {
        const currentOwner = (await sdk.NounsToken.ownerOf(nounTokenId)).toLowerCase()
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

async function getBidInfo(sdk: NounletsSDK, vaultAddress: string): Promise<BuyoutInfoPartial> {
  const bidInfo = await sdk.OptimisticBid.bidInfo(vaultAddress)

  if (REJECTION_PERIOD == null) {
    REJECTION_PERIOD = (await sdk.OptimisticBid.REJECTION_PERIOD()).toNumber()
  }

  const endTime = bidInfo.startTime.add(REJECTION_PERIOD)
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

async function getStartEvents(sdk: NounletsSDK, vaultAddress: string) {
  const filter = sdk.OptimisticBid.filters.Start(vaultAddress)
  const events = await sdk.OptimisticBid.queryFilter(filter)
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
  nounletTokenAddres: string,
  event: Awaited<ReturnType<typeof getStartEvents>>[0]
) {
  const nounletToken = sdk.NounletToken.attach(nounletTokenAddres)
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
    nounletTokenAddres,
    fractionsOffered
  )

  return [fractionsOffered, fractionsRemaining]
}

async function getOptimisticBidBalances(
  sdk: NounletsSDK,
  nounletTokenAddres: string,
  fractionsOffered: BigNumber[]
): Promise<BigNumber[]> {
  const nounletToken = sdk.NounletToken.attach(nounletTokenAddres)
  const optimisticBid = sdk.OptimisticBid
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

  console.log({ fractionsRemaining })

  return fractionsRemaining
}
