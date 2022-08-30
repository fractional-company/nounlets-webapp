import { BigNumber } from '@ethersproject/bignumber'
// import { generateEmptyNounderAuction, isNounderNoun, isNounsDAONoun } from '../utils/nounderNoun'
// import { Bid, BidEvent } from '../utils/types'
// import { Auction } from './nounsAuction'
// import { useAuctionState } from '../../store/auction'
// import { usePastAuctions } from '../../store/pastAuctions'

// const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
//   return {
//     amount: BigNumber.from(reduxSafeAuction.amount),
//     bidder: reduxSafeAuction.bidder,
//     startTime: BigNumber.from(reduxSafeAuction.startTime),
//     endTime: BigNumber.from(reduxSafeAuction.endTime),
//     id: BigNumber.from(reduxSafeAuction.id || 0),
//     settled: false
//   }
// }

// const deserializeBid = (reduxSafeBid: BidEvent): Bid => {
//   return {
//     nounId: BigNumber.from(reduxSafeBid.nounId),
//     sender: reduxSafeBid.sender,
//     value: BigNumber.from(reduxSafeBid.value),
//     extended: reduxSafeBid.extended,
//     transactionHash: reduxSafeBid.transactionHash,
//     timestamp: BigNumber.from(reduxSafeBid.timestamp)
//   }
// }
// const deserializeBids = (reduxSafeBids: BidEvent[]): Bid[] => {
//   return reduxSafeBids
//     .map((bid) => deserializeBid(bid))
//     .sort((a: Bid, b: Bid) => {
//       return b.timestamp.toNumber() - a.timestamp.toNumber()
//     })
// }

// const useOnDisplayAuction = (): Auction | undefined => {
//   const { activeAuction: currentAuction } = useAuctionState()
//   // TODO: REMOVE MOCK || 0
//   const lastAuctionNounId = currentAuction?.nounId || 0
//   const { bids } = useAuctionState()
//   const onDisplayAuctionNounId = 3
//   // TODO: REMOVE MOCK || []
//   const { pastAuctions } = usePastAuctions() || []

//   if (
//     onDisplayAuctionNounId === undefined ||
//     lastAuctionNounId === undefined ||
//     currentAuction === undefined ||
//     !pastAuctions
//   ) {
//     return undefined
//   }

//   // current auction
//   if (BigNumber.from(onDisplayAuctionNounId).eq(lastAuctionNounId)) {
//     return deserializeAuction(currentAuction)
//   } else {
//     // past auction
//     const reduxSafeAuction: Auction | undefined = pastAuctions.find((auction) => {
//       const nounId = auction.activeAuction && BigNumber.from(auction.activeAuction.nounId)
//       return nounId && nounId.toNumber() === onDisplayAuctionNounId
//     })?.activeAuction

//     return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined
//   }
// }

// export const useAuctionBids = (auctionNounId: BigNumber): Bid[] | undefined => {
//   const lastAuctionNounId = 3
//   const { bids } = useAuctionState()
//   const { pastAuctions } = usePastAuctions()

//   // auction requested is active auction
//   if (lastAuctionNounId === auctionNounId.toNumber()) {
//     return deserializeBids(bids)
//   } else {
//     // find bids for past auction requested
//     const bidEvents: BidEvent[] | undefined = pastAuctions.find((auction) => {
//       const nounId = auction.activeAuction && BigNumber.from(auction.activeAuction.nounId)
//       return nounId && nounId.eq(auctionNounId)
//     })?.bids

//     return bidEvents && deserializeBids(bidEvents)
//   }
// }

// export default useOnDisplayAuction
