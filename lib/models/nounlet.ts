import {Noun} from "./noun";
import {Delegate, DelegateVote} from "./delegate";
import {Auction} from "./auction";
import {Account} from "./account";

export interface Nounlet {
    id: string
    seed: Seed
    noun: Noun
    holder: Account
    delegate: Delegate
    auction: Auction
    delegateVotes: DelegateVote[]
}

export interface Seed {
    id: string
    background: BigInt
    body: BigInt
    accessory: BigInt
    head: BigInt
    glasses: BigInt
}
