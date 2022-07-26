import {Nounlet} from "./nounlet";

export interface Delegate {
    id: string
    nounletsRepresented: Nounlet[]
    votes: DelegateVote[]
}

export interface DelegateVote {
    id: string
    nounlet: Nounlet
    delegate: Delegate
    voteAmount: BigInt
    reason: string
    timestamp: BigInt
}
