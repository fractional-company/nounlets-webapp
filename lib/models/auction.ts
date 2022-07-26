import {Nounlet} from "./nounlet";
import {Account} from "./account";
import {Bid} from "./bid";

export interface Auction {
    id: string
    nounlet: Nounlet
    amount: BigInt
    startTime: BigInt
    endTime: BigInt
    bidder: Account
    settled: boolean
    bids: Bid[]
}
