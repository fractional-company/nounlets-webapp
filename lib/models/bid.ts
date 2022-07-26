import {Auction} from "./auction";
import {Account} from "./account";

export interface Bid {
    id: string
    auction: Auction
    bidder: Account
    amount: BigInt
    blockNumber: BigInt
    blockTimestamp: BigInt
    txIndex: BigInt
}
