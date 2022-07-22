import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import BigNumber from 'bignumber.js';
import NounletsAuctionABI from '../../eth-sdk/abis/rinkeby/nounletAuction.json'
import config from "../../config";

// export enum AuctionHouseContractFunction {
//   auction = 'auction',
//   duration = 'duration',
//   minBidIncrementPercentage = 'minBidIncrementPercentage',
//   nouns = 'nouns',
//   createBid = 'createBid',
//   settleCurrentAndCreateNewAuction = 'settleCurrentAndCreateNewAuction',
// }

export interface Auction {
  amount: EthersBN;
  bidder: string;
  endTime: EthersBN;
  startTime: EthersBN;
  nounId?: EthersBN;
  settled: boolean;
}

const abi = new utils.Interface(NounletsAuctionABI);

export const useAuctionMinBidIncPercentage = () => {
  const minBidIncrement = useContractCall({
    abi,
    address: config.addresses.nounletAuction,
    method: 'minBidIncrementPercentage',
    args: [],
  });

  if (!minBidIncrement) {
    return;
  }

  return new BigNumber(minBidIncrement[0]);
};
