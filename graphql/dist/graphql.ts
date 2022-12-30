/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type Account = {
  __typename?: 'Account';
  /** Bids the Account has offered */
  bids: Array<Bid>;
  /** The delegate this Account voted for with their Nounlets */
  delegate?: Maybe<Delegate>;
  /** Delegate votes this Account is a delegator of */
  delegateVotes: Array<DelegateVote>;
  /** Token Address + Wallet Address */
  id: Scalars['ID'];
  /** The Nounlets held by this account */
  nounletsHeld: Array<Nounlet>;
  /** IDs of Nounlets held (subgraph cannot fetch them from derived fields) */
  nounletsHeldIDs: Array<Scalars['String']>;
  /** The Token that the Delegate depends on */
  token: Token;
};


export type AccountBidsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Bid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Bid_Filter>;
};


export type AccountDelegateVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DelegateVote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DelegateVote_Filter>;
};


export type AccountNounletsHeldArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nounlet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Nounlet_Filter>;
};

export type Account_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  bids_?: InputMaybe<Bid_Filter>;
  delegate?: InputMaybe<Scalars['String']>;
  delegateVotes_?: InputMaybe<DelegateVote_Filter>;
  delegate_?: InputMaybe<Delegate_Filter>;
  delegate_contains?: InputMaybe<Scalars['String']>;
  delegate_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_ends_with?: InputMaybe<Scalars['String']>;
  delegate_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_gt?: InputMaybe<Scalars['String']>;
  delegate_gte?: InputMaybe<Scalars['String']>;
  delegate_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_lt?: InputMaybe<Scalars['String']>;
  delegate_lte?: InputMaybe<Scalars['String']>;
  delegate_not?: InputMaybe<Scalars['String']>;
  delegate_not_contains?: InputMaybe<Scalars['String']>;
  delegate_not_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_not_starts_with?: InputMaybe<Scalars['String']>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_starts_with?: InputMaybe<Scalars['String']>;
  delegate_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nounletsHeldIDs?: InputMaybe<Array<Scalars['String']>>;
  nounletsHeldIDs_contains?: InputMaybe<Array<Scalars['String']>>;
  nounletsHeldIDs_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  nounletsHeldIDs_not?: InputMaybe<Array<Scalars['String']>>;
  nounletsHeldIDs_not_contains?: InputMaybe<Array<Scalars['String']>>;
  nounletsHeldIDs_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  nounletsHeld_?: InputMaybe<Nounlet_Filter>;
  token?: InputMaybe<Scalars['String']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Account_OrderBy {
  Bids = 'bids',
  Delegate = 'delegate',
  DelegateVotes = 'delegateVotes',
  Id = 'id',
  NounletsHeld = 'nounletsHeld',
  NounletsHeldIDs = 'nounletsHeldIDs',
  Token = 'token'
}

export type Auction = {
  __typename?: 'Auction';
  /** A collection of Bids on the Auction */
  bids: Array<Bid>;
  /** The time that the auction is scheduled to end */
  endTime: Scalars['BigInt'];
  /** The current highest bid amount */
  highestBidAmount: Scalars['BigInt'];
  /** The account with the current highest bid */
  highestBidder?: Maybe<Account>;
  /** Token Address + Token ID */
  id: Scalars['ID'];
  /** A Nounlet this Auction is meant for */
  nounlet: Nounlet;
  /** Whether or not the auction has been settled */
  settled: Scalars['Boolean'];
  /** The transaction hash the auction was settled in */
  settledTransactionHash: Scalars['String'];
  /** The time that the auction started */
  startTime: Scalars['BigInt'];
};


export type AuctionBidsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Bid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Bid_Filter>;
};

export type Auction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  bids_?: InputMaybe<Bid_Filter>;
  endTime?: InputMaybe<Scalars['BigInt']>;
  endTime_gt?: InputMaybe<Scalars['BigInt']>;
  endTime_gte?: InputMaybe<Scalars['BigInt']>;
  endTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  endTime_lt?: InputMaybe<Scalars['BigInt']>;
  endTime_lte?: InputMaybe<Scalars['BigInt']>;
  endTime_not?: InputMaybe<Scalars['BigInt']>;
  endTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  highestBidAmount?: InputMaybe<Scalars['BigInt']>;
  highestBidAmount_gt?: InputMaybe<Scalars['BigInt']>;
  highestBidAmount_gte?: InputMaybe<Scalars['BigInt']>;
  highestBidAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  highestBidAmount_lt?: InputMaybe<Scalars['BigInt']>;
  highestBidAmount_lte?: InputMaybe<Scalars['BigInt']>;
  highestBidAmount_not?: InputMaybe<Scalars['BigInt']>;
  highestBidAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  highestBidder?: InputMaybe<Scalars['String']>;
  highestBidder_?: InputMaybe<Account_Filter>;
  highestBidder_contains?: InputMaybe<Scalars['String']>;
  highestBidder_contains_nocase?: InputMaybe<Scalars['String']>;
  highestBidder_ends_with?: InputMaybe<Scalars['String']>;
  highestBidder_ends_with_nocase?: InputMaybe<Scalars['String']>;
  highestBidder_gt?: InputMaybe<Scalars['String']>;
  highestBidder_gte?: InputMaybe<Scalars['String']>;
  highestBidder_in?: InputMaybe<Array<Scalars['String']>>;
  highestBidder_lt?: InputMaybe<Scalars['String']>;
  highestBidder_lte?: InputMaybe<Scalars['String']>;
  highestBidder_not?: InputMaybe<Scalars['String']>;
  highestBidder_not_contains?: InputMaybe<Scalars['String']>;
  highestBidder_not_contains_nocase?: InputMaybe<Scalars['String']>;
  highestBidder_not_ends_with?: InputMaybe<Scalars['String']>;
  highestBidder_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  highestBidder_not_in?: InputMaybe<Array<Scalars['String']>>;
  highestBidder_not_starts_with?: InputMaybe<Scalars['String']>;
  highestBidder_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  highestBidder_starts_with?: InputMaybe<Scalars['String']>;
  highestBidder_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nounlet?: InputMaybe<Scalars['String']>;
  nounlet_?: InputMaybe<Nounlet_Filter>;
  nounlet_contains?: InputMaybe<Scalars['String']>;
  nounlet_contains_nocase?: InputMaybe<Scalars['String']>;
  nounlet_ends_with?: InputMaybe<Scalars['String']>;
  nounlet_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nounlet_gt?: InputMaybe<Scalars['String']>;
  nounlet_gte?: InputMaybe<Scalars['String']>;
  nounlet_in?: InputMaybe<Array<Scalars['String']>>;
  nounlet_lt?: InputMaybe<Scalars['String']>;
  nounlet_lte?: InputMaybe<Scalars['String']>;
  nounlet_not?: InputMaybe<Scalars['String']>;
  nounlet_not_contains?: InputMaybe<Scalars['String']>;
  nounlet_not_contains_nocase?: InputMaybe<Scalars['String']>;
  nounlet_not_ends_with?: InputMaybe<Scalars['String']>;
  nounlet_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nounlet_not_in?: InputMaybe<Array<Scalars['String']>>;
  nounlet_not_starts_with?: InputMaybe<Scalars['String']>;
  nounlet_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  nounlet_starts_with?: InputMaybe<Scalars['String']>;
  nounlet_starts_with_nocase?: InputMaybe<Scalars['String']>;
  settled?: InputMaybe<Scalars['Boolean']>;
  settledTransactionHash?: InputMaybe<Scalars['String']>;
  settledTransactionHash_contains?: InputMaybe<Scalars['String']>;
  settledTransactionHash_contains_nocase?: InputMaybe<Scalars['String']>;
  settledTransactionHash_ends_with?: InputMaybe<Scalars['String']>;
  settledTransactionHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  settledTransactionHash_gt?: InputMaybe<Scalars['String']>;
  settledTransactionHash_gte?: InputMaybe<Scalars['String']>;
  settledTransactionHash_in?: InputMaybe<Array<Scalars['String']>>;
  settledTransactionHash_lt?: InputMaybe<Scalars['String']>;
  settledTransactionHash_lte?: InputMaybe<Scalars['String']>;
  settledTransactionHash_not?: InputMaybe<Scalars['String']>;
  settledTransactionHash_not_contains?: InputMaybe<Scalars['String']>;
  settledTransactionHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  settledTransactionHash_not_ends_with?: InputMaybe<Scalars['String']>;
  settledTransactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  settledTransactionHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  settledTransactionHash_not_starts_with?: InputMaybe<Scalars['String']>;
  settledTransactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  settledTransactionHash_starts_with?: InputMaybe<Scalars['String']>;
  settledTransactionHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  settled_in?: InputMaybe<Array<Scalars['Boolean']>>;
  settled_not?: InputMaybe<Scalars['Boolean']>;
  settled_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  startTime?: InputMaybe<Scalars['BigInt']>;
  startTime_gt?: InputMaybe<Scalars['BigInt']>;
  startTime_gte?: InputMaybe<Scalars['BigInt']>;
  startTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startTime_lt?: InputMaybe<Scalars['BigInt']>;
  startTime_lte?: InputMaybe<Scalars['BigInt']>;
  startTime_not?: InputMaybe<Scalars['BigInt']>;
  startTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Auction_OrderBy {
  Bids = 'bids',
  EndTime = 'endTime',
  HighestBidAmount = 'highestBidAmount',
  HighestBidder = 'highestBidder',
  Id = 'id',
  Nounlet = 'nounlet',
  Settled = 'settled',
  SettledTransactionHash = 'settledTransactionHash',
  StartTime = 'startTime'
}

export type Bid = {
  __typename?: 'Bid';
  /** Bid amount */
  amount: Scalars['BigInt'];
  /** The auction being bid in */
  auction: Auction;
  /** Bidder account */
  bidder: Account;
  /** Block number of the bid */
  blockNumber: Scalars['BigInt'];
  /** The timestamp of the block the bid is in */
  blockTimestamp: Scalars['BigInt'];
  /** Bid transaction hash */
  id: Scalars['ID'];
  /** Index of transaction within block */
  txIndex: Scalars['BigInt'];
};

export type Bid_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  auction?: InputMaybe<Scalars['String']>;
  auction_?: InputMaybe<Auction_Filter>;
  auction_contains?: InputMaybe<Scalars['String']>;
  auction_contains_nocase?: InputMaybe<Scalars['String']>;
  auction_ends_with?: InputMaybe<Scalars['String']>;
  auction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  auction_gt?: InputMaybe<Scalars['String']>;
  auction_gte?: InputMaybe<Scalars['String']>;
  auction_in?: InputMaybe<Array<Scalars['String']>>;
  auction_lt?: InputMaybe<Scalars['String']>;
  auction_lte?: InputMaybe<Scalars['String']>;
  auction_not?: InputMaybe<Scalars['String']>;
  auction_not_contains?: InputMaybe<Scalars['String']>;
  auction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  auction_not_ends_with?: InputMaybe<Scalars['String']>;
  auction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  auction_not_in?: InputMaybe<Array<Scalars['String']>>;
  auction_not_starts_with?: InputMaybe<Scalars['String']>;
  auction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  auction_starts_with?: InputMaybe<Scalars['String']>;
  auction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  bidder?: InputMaybe<Scalars['String']>;
  bidder_?: InputMaybe<Account_Filter>;
  bidder_contains?: InputMaybe<Scalars['String']>;
  bidder_contains_nocase?: InputMaybe<Scalars['String']>;
  bidder_ends_with?: InputMaybe<Scalars['String']>;
  bidder_ends_with_nocase?: InputMaybe<Scalars['String']>;
  bidder_gt?: InputMaybe<Scalars['String']>;
  bidder_gte?: InputMaybe<Scalars['String']>;
  bidder_in?: InputMaybe<Array<Scalars['String']>>;
  bidder_lt?: InputMaybe<Scalars['String']>;
  bidder_lte?: InputMaybe<Scalars['String']>;
  bidder_not?: InputMaybe<Scalars['String']>;
  bidder_not_contains?: InputMaybe<Scalars['String']>;
  bidder_not_contains_nocase?: InputMaybe<Scalars['String']>;
  bidder_not_ends_with?: InputMaybe<Scalars['String']>;
  bidder_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  bidder_not_in?: InputMaybe<Array<Scalars['String']>>;
  bidder_not_starts_with?: InputMaybe<Scalars['String']>;
  bidder_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  bidder_starts_with?: InputMaybe<Scalars['String']>;
  bidder_starts_with_nocase?: InputMaybe<Scalars['String']>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  txIndex?: InputMaybe<Scalars['BigInt']>;
  txIndex_gt?: InputMaybe<Scalars['BigInt']>;
  txIndex_gte?: InputMaybe<Scalars['BigInt']>;
  txIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txIndex_lt?: InputMaybe<Scalars['BigInt']>;
  txIndex_lte?: InputMaybe<Scalars['BigInt']>;
  txIndex_not?: InputMaybe<Scalars['BigInt']>;
  txIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Bid_OrderBy {
  Amount = 'amount',
  Auction = 'auction',
  Bidder = 'bidder',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  TxIndex = 'txIndex'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Delegate = {
  __typename?: 'Delegate';
  /** Token Address + Wallet Address */
  id: Scalars['ID'];
  /** Nounlets that this delegate represents */
  nounletsRepresented: Array<Nounlet>;
  /** IDs of the represented Nounlets (subgraph cannot fetch them from derived fields) */
  nounletsRepresentedIDs: Array<Scalars['String']>;
  /** The Token that the Delegate depends on */
  token: Token;
  /** Historic data about the votes for this delegate */
  votes: Array<DelegateVote>;
};


export type DelegateNounletsRepresentedArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nounlet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Nounlet_Filter>;
};


export type DelegateVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DelegateVote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DelegateVote_Filter>;
};

export type DelegateVote = {
  __typename?: 'DelegateVote';
  /** Delegate receiving a vote */
  delegate: Delegate;
  /** The Account that delegated the vote */
  delegator?: Maybe<Account>;
  /** Delegate ID + Nounlet ID */
  id: Scalars['ID'];
  /** Nounlet that casts a vote. Can be NULL if vote was casted as a consequence of  */
  nounlet: Nounlet;
  /** The optional vote reason */
  reason?: Maybe<Scalars['String']>;
  /** Timestamp of the vote */
  timestamp: Scalars['BigInt'];
  /** The amount of votes */
  voteAmount: Scalars['BigInt'];
};

export type DelegateVote_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  delegate?: InputMaybe<Scalars['String']>;
  delegate_?: InputMaybe<Delegate_Filter>;
  delegate_contains?: InputMaybe<Scalars['String']>;
  delegate_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_ends_with?: InputMaybe<Scalars['String']>;
  delegate_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_gt?: InputMaybe<Scalars['String']>;
  delegate_gte?: InputMaybe<Scalars['String']>;
  delegate_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_lt?: InputMaybe<Scalars['String']>;
  delegate_lte?: InputMaybe<Scalars['String']>;
  delegate_not?: InputMaybe<Scalars['String']>;
  delegate_not_contains?: InputMaybe<Scalars['String']>;
  delegate_not_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_not_starts_with?: InputMaybe<Scalars['String']>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_starts_with?: InputMaybe<Scalars['String']>;
  delegate_starts_with_nocase?: InputMaybe<Scalars['String']>;
  delegator?: InputMaybe<Scalars['String']>;
  delegator_?: InputMaybe<Account_Filter>;
  delegator_contains?: InputMaybe<Scalars['String']>;
  delegator_contains_nocase?: InputMaybe<Scalars['String']>;
  delegator_ends_with?: InputMaybe<Scalars['String']>;
  delegator_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegator_gt?: InputMaybe<Scalars['String']>;
  delegator_gte?: InputMaybe<Scalars['String']>;
  delegator_in?: InputMaybe<Array<Scalars['String']>>;
  delegator_lt?: InputMaybe<Scalars['String']>;
  delegator_lte?: InputMaybe<Scalars['String']>;
  delegator_not?: InputMaybe<Scalars['String']>;
  delegator_not_contains?: InputMaybe<Scalars['String']>;
  delegator_not_contains_nocase?: InputMaybe<Scalars['String']>;
  delegator_not_ends_with?: InputMaybe<Scalars['String']>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegator_not_in?: InputMaybe<Array<Scalars['String']>>;
  delegator_not_starts_with?: InputMaybe<Scalars['String']>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  delegator_starts_with?: InputMaybe<Scalars['String']>;
  delegator_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nounlet?: InputMaybe<Scalars['String']>;
  nounlet_?: InputMaybe<Nounlet_Filter>;
  nounlet_contains?: InputMaybe<Scalars['String']>;
  nounlet_contains_nocase?: InputMaybe<Scalars['String']>;
  nounlet_ends_with?: InputMaybe<Scalars['String']>;
  nounlet_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nounlet_gt?: InputMaybe<Scalars['String']>;
  nounlet_gte?: InputMaybe<Scalars['String']>;
  nounlet_in?: InputMaybe<Array<Scalars['String']>>;
  nounlet_lt?: InputMaybe<Scalars['String']>;
  nounlet_lte?: InputMaybe<Scalars['String']>;
  nounlet_not?: InputMaybe<Scalars['String']>;
  nounlet_not_contains?: InputMaybe<Scalars['String']>;
  nounlet_not_contains_nocase?: InputMaybe<Scalars['String']>;
  nounlet_not_ends_with?: InputMaybe<Scalars['String']>;
  nounlet_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nounlet_not_in?: InputMaybe<Array<Scalars['String']>>;
  nounlet_not_starts_with?: InputMaybe<Scalars['String']>;
  nounlet_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  nounlet_starts_with?: InputMaybe<Scalars['String']>;
  nounlet_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reason?: InputMaybe<Scalars['String']>;
  reason_contains?: InputMaybe<Scalars['String']>;
  reason_contains_nocase?: InputMaybe<Scalars['String']>;
  reason_ends_with?: InputMaybe<Scalars['String']>;
  reason_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reason_gt?: InputMaybe<Scalars['String']>;
  reason_gte?: InputMaybe<Scalars['String']>;
  reason_in?: InputMaybe<Array<Scalars['String']>>;
  reason_lt?: InputMaybe<Scalars['String']>;
  reason_lte?: InputMaybe<Scalars['String']>;
  reason_not?: InputMaybe<Scalars['String']>;
  reason_not_contains?: InputMaybe<Scalars['String']>;
  reason_not_contains_nocase?: InputMaybe<Scalars['String']>;
  reason_not_ends_with?: InputMaybe<Scalars['String']>;
  reason_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reason_not_in?: InputMaybe<Array<Scalars['String']>>;
  reason_not_starts_with?: InputMaybe<Scalars['String']>;
  reason_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reason_starts_with?: InputMaybe<Scalars['String']>;
  reason_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  voteAmount?: InputMaybe<Scalars['BigInt']>;
  voteAmount_gt?: InputMaybe<Scalars['BigInt']>;
  voteAmount_gte?: InputMaybe<Scalars['BigInt']>;
  voteAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  voteAmount_lt?: InputMaybe<Scalars['BigInt']>;
  voteAmount_lte?: InputMaybe<Scalars['BigInt']>;
  voteAmount_not?: InputMaybe<Scalars['BigInt']>;
  voteAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum DelegateVote_OrderBy {
  Delegate = 'delegate',
  Delegator = 'delegator',
  Id = 'id',
  Nounlet = 'nounlet',
  Reason = 'reason',
  Timestamp = 'timestamp',
  VoteAmount = 'voteAmount'
}

export type Delegate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nounletsRepresentedIDs?: InputMaybe<Array<Scalars['String']>>;
  nounletsRepresentedIDs_contains?: InputMaybe<Array<Scalars['String']>>;
  nounletsRepresentedIDs_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  nounletsRepresentedIDs_not?: InputMaybe<Array<Scalars['String']>>;
  nounletsRepresentedIDs_not_contains?: InputMaybe<Array<Scalars['String']>>;
  nounletsRepresentedIDs_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  nounletsRepresented_?: InputMaybe<Nounlet_Filter>;
  token?: InputMaybe<Scalars['String']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  votes_?: InputMaybe<DelegateVote_Filter>;
};

export enum Delegate_OrderBy {
  Id = 'id',
  NounletsRepresented = 'nounletsRepresented',
  NounletsRepresentedIDs = 'nounletsRepresentedIDs',
  Token = 'token',
  Votes = 'votes'
}

export type Noun = {
  __typename?: 'Noun';
  /** The current delegate address of the Noun (Zero Address by default) */
  currentDelegate: Scalars['String'];
  /** The Noun's ERC721 token id */
  id: Scalars['ID'];
  /** Fractions of a Noun */
  nounlets: Array<Nounlet>;
  /** Whether a Noun is currently tributed */
  tributed: Scalars['Boolean'];
};


export type NounNounletsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nounlet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Nounlet_Filter>;
};

export type Noun_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  currentDelegate?: InputMaybe<Scalars['String']>;
  currentDelegate_contains?: InputMaybe<Scalars['String']>;
  currentDelegate_contains_nocase?: InputMaybe<Scalars['String']>;
  currentDelegate_ends_with?: InputMaybe<Scalars['String']>;
  currentDelegate_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentDelegate_gt?: InputMaybe<Scalars['String']>;
  currentDelegate_gte?: InputMaybe<Scalars['String']>;
  currentDelegate_in?: InputMaybe<Array<Scalars['String']>>;
  currentDelegate_lt?: InputMaybe<Scalars['String']>;
  currentDelegate_lte?: InputMaybe<Scalars['String']>;
  currentDelegate_not?: InputMaybe<Scalars['String']>;
  currentDelegate_not_contains?: InputMaybe<Scalars['String']>;
  currentDelegate_not_contains_nocase?: InputMaybe<Scalars['String']>;
  currentDelegate_not_ends_with?: InputMaybe<Scalars['String']>;
  currentDelegate_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentDelegate_not_in?: InputMaybe<Array<Scalars['String']>>;
  currentDelegate_not_starts_with?: InputMaybe<Scalars['String']>;
  currentDelegate_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentDelegate_starts_with?: InputMaybe<Scalars['String']>;
  currentDelegate_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nounlets_?: InputMaybe<Nounlet_Filter>;
  tributed?: InputMaybe<Scalars['Boolean']>;
  tributed_in?: InputMaybe<Array<Scalars['Boolean']>>;
  tributed_not?: InputMaybe<Scalars['Boolean']>;
  tributed_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
};

export enum Noun_OrderBy {
  CurrentDelegate = 'currentDelegate',
  Id = 'id',
  Nounlets = 'nounlets',
  Tributed = 'tributed'
}

export type Nounlet = {
  __typename?: 'Nounlet';
  /** Auction belonging to a Nounlet */
  auction: Auction;
  /** Nounlet delegate */
  delegate?: Maybe<Delegate>;
  /** Delegate votes that the Nounlet casted */
  delegateVotes: Array<DelegateVote>;
  /** A Nounlet holder */
  holder?: Maybe<Account>;
  /** Token Address + Token ID */
  id: Scalars['ID'];
  /** The Noun ID that the Nounlet is derived from */
  noun?: Maybe<Noun>;
};


export type NounletDelegateVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DelegateVote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DelegateVote_Filter>;
};

export type Nounlet_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  auction_?: InputMaybe<Auction_Filter>;
  delegate?: InputMaybe<Scalars['String']>;
  delegateVotes_?: InputMaybe<DelegateVote_Filter>;
  delegate_?: InputMaybe<Delegate_Filter>;
  delegate_contains?: InputMaybe<Scalars['String']>;
  delegate_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_ends_with?: InputMaybe<Scalars['String']>;
  delegate_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_gt?: InputMaybe<Scalars['String']>;
  delegate_gte?: InputMaybe<Scalars['String']>;
  delegate_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_lt?: InputMaybe<Scalars['String']>;
  delegate_lte?: InputMaybe<Scalars['String']>;
  delegate_not?: InputMaybe<Scalars['String']>;
  delegate_not_contains?: InputMaybe<Scalars['String']>;
  delegate_not_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_not_starts_with?: InputMaybe<Scalars['String']>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_starts_with?: InputMaybe<Scalars['String']>;
  delegate_starts_with_nocase?: InputMaybe<Scalars['String']>;
  holder?: InputMaybe<Scalars['String']>;
  holder_?: InputMaybe<Account_Filter>;
  holder_contains?: InputMaybe<Scalars['String']>;
  holder_contains_nocase?: InputMaybe<Scalars['String']>;
  holder_ends_with?: InputMaybe<Scalars['String']>;
  holder_ends_with_nocase?: InputMaybe<Scalars['String']>;
  holder_gt?: InputMaybe<Scalars['String']>;
  holder_gte?: InputMaybe<Scalars['String']>;
  holder_in?: InputMaybe<Array<Scalars['String']>>;
  holder_lt?: InputMaybe<Scalars['String']>;
  holder_lte?: InputMaybe<Scalars['String']>;
  holder_not?: InputMaybe<Scalars['String']>;
  holder_not_contains?: InputMaybe<Scalars['String']>;
  holder_not_contains_nocase?: InputMaybe<Scalars['String']>;
  holder_not_ends_with?: InputMaybe<Scalars['String']>;
  holder_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  holder_not_in?: InputMaybe<Array<Scalars['String']>>;
  holder_not_starts_with?: InputMaybe<Scalars['String']>;
  holder_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  holder_starts_with?: InputMaybe<Scalars['String']>;
  holder_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  noun?: InputMaybe<Scalars['String']>;
  noun_?: InputMaybe<Noun_Filter>;
  noun_contains?: InputMaybe<Scalars['String']>;
  noun_contains_nocase?: InputMaybe<Scalars['String']>;
  noun_ends_with?: InputMaybe<Scalars['String']>;
  noun_ends_with_nocase?: InputMaybe<Scalars['String']>;
  noun_gt?: InputMaybe<Scalars['String']>;
  noun_gte?: InputMaybe<Scalars['String']>;
  noun_in?: InputMaybe<Array<Scalars['String']>>;
  noun_lt?: InputMaybe<Scalars['String']>;
  noun_lte?: InputMaybe<Scalars['String']>;
  noun_not?: InputMaybe<Scalars['String']>;
  noun_not_contains?: InputMaybe<Scalars['String']>;
  noun_not_contains_nocase?: InputMaybe<Scalars['String']>;
  noun_not_ends_with?: InputMaybe<Scalars['String']>;
  noun_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  noun_not_in?: InputMaybe<Array<Scalars['String']>>;
  noun_not_starts_with?: InputMaybe<Scalars['String']>;
  noun_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  noun_starts_with?: InputMaybe<Scalars['String']>;
  noun_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Nounlet_OrderBy {
  Auction = 'auction',
  Delegate = 'delegate',
  DelegateVotes = 'delegateVotes',
  Holder = 'holder',
  Id = 'id',
  Noun = 'noun'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  auction?: Maybe<Auction>;
  auctions: Array<Auction>;
  bid?: Maybe<Bid>;
  bids: Array<Bid>;
  delegate?: Maybe<Delegate>;
  delegateVote?: Maybe<DelegateVote>;
  delegateVotes: Array<DelegateVote>;
  delegates: Array<Delegate>;
  noun?: Maybe<Noun>;
  nounlet?: Maybe<Nounlet>;
  nounlets: Array<Nounlet>;
  nouns: Array<Noun>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  vault?: Maybe<Vault>;
  vaults: Array<Vault>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type QueryAuctionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAuctionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Auction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Auction_Filter>;
};


export type QueryBidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Bid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bid_Filter>;
};


export type QueryDelegateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDelegateVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDelegateVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DelegateVote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegateVote_Filter>;
};


export type QueryDelegatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Delegate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegate_Filter>;
};


export type QueryNounArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNounletArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNounletsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nounlet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Nounlet_Filter>;
};


export type QueryNounsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Noun_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Noun_Filter>;
};


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type QueryVaultArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVaultsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vault_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  auction?: Maybe<Auction>;
  auctions: Array<Auction>;
  bid?: Maybe<Bid>;
  bids: Array<Bid>;
  delegate?: Maybe<Delegate>;
  delegateVote?: Maybe<DelegateVote>;
  delegateVotes: Array<DelegateVote>;
  delegates: Array<Delegate>;
  noun?: Maybe<Noun>;
  nounlet?: Maybe<Nounlet>;
  nounlets: Array<Nounlet>;
  nouns: Array<Noun>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  vault?: Maybe<Vault>;
  vaults: Array<Vault>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type SubscriptionAuctionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAuctionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Auction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Auction_Filter>;
};


export type SubscriptionBidArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBidsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Bid_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bid_Filter>;
};


export type SubscriptionDelegateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDelegateVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDelegateVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DelegateVote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegateVote_Filter>;
};


export type SubscriptionDelegatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Delegate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Delegate_Filter>;
};


export type SubscriptionNounArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNounletArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNounletsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Nounlet_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Nounlet_Filter>;
};


export type SubscriptionNounsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Noun_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Noun_Filter>;
};


export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type SubscriptionVaultArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVaultsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vault_Filter>;
};

export type Token = {
  __typename?: 'Token';
  /** Accounts that belong to this vault */
  accounts: Array<Account>;
  /** Delegates that belong to this vault */
  delegates: Array<Delegate>;
  /** The Token Address */
  id: Scalars['ID'];
};


export type TokenAccountsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Account_Filter>;
};


export type TokenDelegatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Delegate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Delegate_Filter>;
};

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accounts_?: InputMaybe<Account_Filter>;
  delegates_?: InputMaybe<Delegate_Filter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum Token_OrderBy {
  Accounts = 'accounts',
  Delegates = 'delegates',
  Id = 'id'
}

export type Vault = {
  __typename?: 'Vault';
  /** The Vault's address */
  id: Scalars['ID'];
  /** A Noun that the Vault holds */
  noun?: Maybe<Noun>;
  /** Indicates whether a Noun is in the Vault */
  nounInVault: Scalars['Boolean'];
  /** Token address associated with the vault */
  token: Token;
};

export type Vault_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  noun?: InputMaybe<Scalars['String']>;
  nounInVault?: InputMaybe<Scalars['Boolean']>;
  nounInVault_in?: InputMaybe<Array<Scalars['Boolean']>>;
  nounInVault_not?: InputMaybe<Scalars['Boolean']>;
  nounInVault_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  noun_?: InputMaybe<Noun_Filter>;
  noun_contains?: InputMaybe<Scalars['String']>;
  noun_contains_nocase?: InputMaybe<Scalars['String']>;
  noun_ends_with?: InputMaybe<Scalars['String']>;
  noun_ends_with_nocase?: InputMaybe<Scalars['String']>;
  noun_gt?: InputMaybe<Scalars['String']>;
  noun_gte?: InputMaybe<Scalars['String']>;
  noun_in?: InputMaybe<Array<Scalars['String']>>;
  noun_lt?: InputMaybe<Scalars['String']>;
  noun_lte?: InputMaybe<Scalars['String']>;
  noun_not?: InputMaybe<Scalars['String']>;
  noun_not_contains?: InputMaybe<Scalars['String']>;
  noun_not_contains_nocase?: InputMaybe<Scalars['String']>;
  noun_not_ends_with?: InputMaybe<Scalars['String']>;
  noun_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  noun_not_in?: InputMaybe<Array<Scalars['String']>>;
  noun_not_starts_with?: InputMaybe<Scalars['String']>;
  noun_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  noun_starts_with?: InputMaybe<Scalars['String']>;
  noun_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Vault_OrderBy {
  Id = 'id',
  Noun = 'noun',
  NounInVault = 'nounInVault',
  Token = 'token'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type VaultListQueryVariables = Exact<{
  first: Scalars['Int'];
}>;


export type VaultListQuery = { __typename?: 'Query', vaults: Array<{ __typename?: 'Vault', id: string, nounInVault: boolean, token: { __typename?: 'Token', id: string }, noun?: { __typename?: 'Noun', id: string, currentDelegate: string, nounlets: Array<{ __typename?: 'Nounlet', id: string, auction: { __typename?: 'Auction', startTime: any, endTime: any, highestBidAmount: any, settled: boolean } }> } | null }>, _meta?: { __typename?: '_Meta_', block: { __typename?: '_Block_', number: number, timestamp?: number | null } } | null };

export type VaultQueryVariables = Exact<{
  vaultId: Scalars['ID'];
}>;


export type VaultQuery = { __typename?: 'Query', vault?: { __typename?: 'Vault', id: string, token: { __typename?: 'Token', id: string }, noun?: { __typename?: 'Noun', id: string, currentDelegate: string, nounlets: Array<{ __typename?: 'Nounlet', id: string, auction: { __typename?: 'Auction', settled: boolean }, holder?: { __typename?: 'Account', id: string } | null, delegate?: { __typename?: 'Delegate', id: string } | null }> } | null } | null, _meta?: { __typename?: '_Meta_', block: { __typename?: '_Block_', number: number, timestamp?: number | null } } | null };

export type VaultByNounQueryVariables = Exact<{
  nounId: Scalars['String'];
}>;


export type VaultByNounQuery = { __typename?: 'Query', vaults: Array<{ __typename?: 'Vault', id: string, token: { __typename?: 'Token', id: string }, noun?: { __typename?: 'Noun', id: string, currentDelegate: string, nounlets: Array<{ __typename?: 'Nounlet', id: string, auction: { __typename?: 'Auction', settled: boolean }, holder?: { __typename?: 'Account', id: string } | null, delegate?: { __typename?: 'Delegate', id: string } | null }> } | null }>, _meta?: { __typename?: '_Meta_', block: { __typename?: '_Block_', number: number, timestamp?: number | null } } | null };

export type VaultNounletAuctionQueryVariables = Exact<{
  vaultId: Scalars['ID'];
  nounletId: Scalars['ID'];
}>;


export type VaultNounletAuctionQuery = { __typename?: 'Query', vault?: { __typename?: 'Vault', noun?: { __typename?: 'Noun', nounlets: Array<{ __typename?: 'Nounlet', id: string, auction: { __typename?: 'Auction', id: string, settled: boolean, settledTransactionHash: string, highestBidAmount: any, endTime: any, highestBidder?: { __typename?: 'Account', id: string } | null, bids: Array<{ __typename?: 'Bid', id: string, amount: any, blockNumber: any, blockTimestamp: any, txIndex: any, bidder: { __typename?: 'Account', id: string } }> } }> } | null } | null, _meta?: { __typename?: '_Meta_', block: { __typename?: '_Block_', number: number, timestamp?: number | null } } | null };

export type VaultNounletVotesQueryVariables = Exact<{
  nounletId: Scalars['ID'];
}>;


export type VaultNounletVotesQuery = { __typename?: 'Query', nounlet?: { __typename?: 'Nounlet', id: string, delegateVotes: Array<{ __typename?: 'DelegateVote', id: string, timestamp: any, delegate: { __typename?: 'Delegate', id: string } }> } | null, _meta?: { __typename?: '_Meta_', block: { __typename?: '_Block_', number: number, timestamp?: number | null } } | null };

export type NounsQueryVariables = Exact<{ [key: string]: never; }>;


export type NounsQuery = { __typename?: 'Query', nouns: Array<{ __typename?: 'Noun', id: string, tributed: boolean, currentDelegate: string }>, _meta?: { __typename?: '_Meta_', block: { __typename?: '_Block_', number: number, timestamp?: number | null } } | null };


export const VaultListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VaultList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vaults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nounInVault"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"noun"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentDelegate"}},{"kind":"Field","name":{"kind":"Name","value":"nounlets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"id"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"auction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"highestBidAmount"}},{"kind":"Field","name":{"kind":"Name","value":"settled"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]} as unknown as DocumentNode<VaultListQuery, VaultListQueryVariables>;
export const VaultDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Vault"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"vaultId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vault"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"vaultId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"noun"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentDelegate"}},{"kind":"Field","name":{"kind":"Name","value":"nounlets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"auction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"holder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delegate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]} as unknown as DocumentNode<VaultQuery, VaultQueryVariables>;
export const VaultByNounDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VaultByNoun"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nounId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vaults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"noun"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nounId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"noun"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentDelegate"}},{"kind":"Field","name":{"kind":"Name","value":"nounlets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"auction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"holder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delegate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]} as unknown as DocumentNode<VaultByNounQuery, VaultByNounQueryVariables>;
export const VaultNounletAuctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VaultNounletAuction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"vaultId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nounletId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vault"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"vaultId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noun"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nounlets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nounletId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"auction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"settled"}},{"kind":"Field","name":{"kind":"Name","value":"settledTransactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"highestBidAmount"}},{"kind":"Field","name":{"kind":"Name","value":"highestBidder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"bids"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"amount"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bidder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"blockNumber"}},{"kind":"Field","name":{"kind":"Name","value":"blockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"txIndex"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]} as unknown as DocumentNode<VaultNounletAuctionQuery, VaultNounletAuctionQueryVariables>;
export const VaultNounletVotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VaultNounletVotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nounletId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nounlet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nounletId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"delegateVotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"timestamp"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"delegate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]} as unknown as DocumentNode<VaultNounletVotesQuery, VaultNounletVotesQueryVariables>;
export const NounsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Nouns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nouns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tributed"}},{"kind":"Field","name":{"kind":"Name","value":"currentDelegate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"_meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"block"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]} as unknown as DocumentNode<NounsQuery, NounsQueryVariables>;