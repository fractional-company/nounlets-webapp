export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  BigInt: any
}
export type Vault = {
  __typename?: 'Vault'
  /** The Vault's address */
  id: Scalars['ID']
  /** A Noun that the Vault holds */
  tokenAddress: Scalars['String']
  /** A Noun that the Vault holds */
  noun?: Maybe<Noun>
}
export type Account = {
  __typename?: 'Account'
  /** An Account is any address that holds any amount of Nounlets, the id used is the blockchain address. */
  id: Scalars['ID']
  /** Total amount of Nounlets ever held by this address expressed as a BigInt normalized value for the Nounlets ERC1155 Token */
  totalNounletsHeld: Scalars['BigInt']
  /** The Nounlets held by this account */
  nounlets: Array<Nounlet>
}
export type Noun = {
  __typename?: 'Noun'
  /** The Noun's ERC721 token id */
  id: Scalars['ID']
  /** Fractions of a Noun */
  nounlets: Array<Nounlet>
}
export type Nounlet = {
  __typename?: 'Nounlet'
  /** The Nounlet's FERC1155 token id */
  id: Scalars['ID']
  /** The Noun ID that the Nounlet is derived from */
  noun?: Maybe<Noun>
  /** A Nounlet holder */
  holder?: Maybe<Account>
  /** Nounlet delegate */
  delegate?: Maybe<Delegate>
  /** Auction belonging to a Nounlet */
  auction?: Maybe<Auction>
  /** Delegate votes that the Nounlet casted */
  delegateVotes: Array<DelegateVote>
}
export type Auction = {
  __typename?: 'Auction'
  /** The Nounlet's FERC1155 token id */
  id: Scalars['ID']
  /** The Nounlet */
  nounlet: Nounlet
  /** The current highest bid amount */
  amount: Scalars['BigInt']
  /** The time that the auction started */
  startTime: Scalars['BigInt']
  /** The time that the auction is scheduled to end */
  endTime: Scalars['BigInt']
  /** The account with the current highest bid */
  bidder?: Maybe<Account>
  /** Whether or not the auction has been settled */
  settled: Scalars['Boolean']
  /** The auction bids */
  bids: Array<Bid>
}
export type Delegate = {
  __typename?: 'Delegate'
  /** Wallet address of the delegate + Noun ID */
  id: Scalars['ID']
  /** Nounlets that this delegate represents */
  nounletsRepresented: Array<Nounlet>
  /** Historic data about the votes for this delegate */
  votes: Array<DelegateVote>
}
export type DelegateVote = {
  __typename?: 'DelegateVote'
  /** Delegate ID + Nounlet ID */
  id: Scalars['ID']
  /** Nounlet that casts a vote */
  nounlet: Nounlet
  /** Delegate receiving a vote */
  delegate: Delegate
  /** The amount of votes */
  voteAmount: Scalars['BigInt']
  /** The optional vote reason */
  reason?: Maybe<Scalars['String']>
  /** Timestamp of the vote */
  timestamp: Scalars['BigInt']
}
export type Bid = {
  __typename?: 'Bid'
  /** Bid transaction hash */
  id: Scalars['ID']
  /** The auction being bid in */
  auction: Auction
  /** Bidder account */
  bidder?: Maybe<Account>
  /** Bid amount */
  amount: Scalars['BigInt']
  /** Block number of the bid */
  blockNumber: Scalars['BigInt']
  /** The timestamp of the block the bid is in */
  blockTimestamp: Scalars['BigInt']
  /** Index of transaction within block */
  txIndex: Scalars['BigInt']
}
