import { BigNumber as EthersBN } from 'ethers'
// import NounletsAuctionABI from '../../typechain/abis/nounletAuction.abi.json';

// export enum AuctionHouseContractFunction {
//   auction = 'auction',
//   duration = 'duration',
//   minBidIncrementPercentage = 'minBidIncrementPercentage',
//   nouns = 'nouns',
//   createBid = 'createBid',
//   settleCurrentAndCreateNewAuction = 'settleCurrentAndCreateNewAuction',
// }

export interface Auction {
  id?: EthersBN
  amount: EthersBN
  bidder: string
  endTime: EthersBN
  startTime: EthersBN
  nounId?: EthersBN
  settled: boolean
}

// const abi = new utils.Interface(NounletsAuctionABI);

// export const useAuctionMinBidIncPercentage = () => {
//   const minBidIncrement = useContractCall({
//     abi,
//     address: config.addresses.nounletAuction,
//     method: 'minBidIncrementPercentage',
//     args: [],
//   });

//   if (!minBidIncrement) {
//     return;
//   }

//   return new BigNumber(minBidIncrement[0]);
// };
