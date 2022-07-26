import {Nounlet} from "./nounlet";

export interface Account {
    id: string
    totalNounletsHeld: BigInt
    nounlets: Nounlet[]
}
