import { BigNumber } from 'ethers'
import { NounletsSDK } from 'hooks/useSdk'

const REJECTION_PERIOD = 3600 // TODO get from SC

type DepositedNounlet = { id: number; isOwnedByOptimisticBid: boolean }
type FullBidInfo = {
  hasEnded: boolean
  hasSettled: boolean
  startTime: number
  endTime: number
  proposer: string
  state: number
  fractionPrice: BigNumber
  ethBalance: BigNumber
  lastTotalSupply: BigNumber
  depositedNounlets: DepositedNounlet[]
  doesOptimisticBidOwnAnyNounlets: boolean
}

export async function getBuyoutBidInfo(
  sdk: NounletsSDK,
  vaultAddress: string,
  nounletTokenAddres: string
) {
  const bidInfo = await getBidInfo(sdk, vaultAddress)
  const startEvents = await getStartEvents(sdk, vaultAddress)
  const lastStartEvent = startEvents.at(-1)

  console.log({ bidInfo, startEvents, lastStartEvent })

  console.log('Current bid info', { bidInfo })

  // Is the buyout in progress or end state?
  if (bidInfo.state !== 0 && lastStartEvent) {
    if (
      lastStartEvent.proposer === bidInfo.proposer &&
      lastStartEvent.startTime === bidInfo.startTime
    ) {
      const nounletToken = sdk.NounletToken.attach(nounletTokenAddres)
      const tx = await lastStartEvent.tx.getTransactionReceipt()

      const depositedNounletIds: number[] =
        tx.logs
          .filter((log) => {
            return log.address.toLowerCase() === nounletToken.address.toLowerCase()
          })
          .map((log) => nounletToken.interface.parseLog(log))
          .filter(
            (log) =>
              log.name ===
              nounletToken.interface.events[
                'TransferBatch(address,address,address,uint256[],uint256[])'
              ].name
          )
          .map((event) => event.args[3].map((bn: BigNumber) => bn.toNumber()))[0] || []

      const balances = await getOptimisticBidBalances(sdk, nounletTokenAddres, depositedNounletIds)
      bidInfo.depositedNounlets = balances
      bidInfo.doesOptimisticBidOwnAnyNounlets = balances.some(
        (balance) => balance.isOwnedByOptimisticBid
      )
    }
  }

  return {
    bidInfo
    // events
  }
}

export async function getOptimisticBidBalances(
  sdk: NounletsSDK,
  nounletTokenAddres: string,
  depositedNounletIds: number[]
): Promise<DepositedNounlet[]> {
  const nounletToken = sdk.NounletToken.attach(nounletTokenAddres)
  const optimisticBid = sdk.OptimisticBid

  console.log('sdfsdfs', depositedNounletIds)

  const balances = await nounletToken.balanceOfBatch(
    depositedNounletIds.map((_) => optimisticBid.address),
    depositedNounletIds
  )

  return depositedNounletIds.map((nounletId, index) => ({
    id: nounletId,
    isOwnedByOptimisticBid: balances[index].eq(1)
  }))
}

export async function getBidInfo(sdk: NounletsSDK, vaultAddress: string): Promise<FullBidInfo> {
  const bidInfo = await sdk.OptimisticBid.bidInfo(vaultAddress)
  const endTime = bidInfo.startTime.toNumber() + REJECTION_PERIOD
  const hasEnded = Date.now() >= endTime * 1000
  const hasSettled = bidInfo.state === 2
  return {
    hasEnded,
    hasSettled,
    startTime: bidInfo.startTime.toNumber(),
    endTime: bidInfo.startTime.toNumber() + REJECTION_PERIOD,
    proposer: bidInfo.proposer,
    state: bidInfo.state,
    fractionPrice: bidInfo.fractionPrice,
    ethBalance: bidInfo.ethBalance,
    lastTotalSupply: bidInfo.lastTotalSupply,
    depositedNounlets: [] as DepositedNounlet[],
    doesOptimisticBidOwnAnyNounlets: true
  }
}

export async function getStartEvents(sdk: NounletsSDK, vaultAddress: string) {
  const filter = sdk.OptimisticBid.filters.Start(vaultAddress)
  const events = await sdk.OptimisticBid.queryFilter(filter)
  const formattedEvents = events
    .map((startEvent) => {
      return {
        vault: startEvent.args._vault,
        proposer: startEvent.args._proposer,
        buyoutPrice: startEvent.args._buyoutPrice,
        fractionPrice: startEvent.args._fractionPrice,
        startTime: startEvent.args._startTime.toNumber(),
        tx: startEvent
      }
    })
    .sort((a, b) => b.startTime - a.startTime)
  return formattedEvents
}
