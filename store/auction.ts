import create from 'zustand'
import { BigNumber } from '@ethersproject/bignumber';
import { immer } from 'zustand/middleware/immer'
import { Auction as IAuction } from '../lib/wrappers/nounsAuction';
import {
    AuctionCreateEvent,
    AuctionExtendedEvent,
    AuctionSettledEvent,
    BidEvent,
} from '../lib/utils/types';
import {AlertModal} from "./application";


export interface AuctionState {
    activeAuction?: IAuction;
    bids: BidEvent[];
}

interface AuctionSetters {
    setActiveAuction: (auction: AuctionCreateEvent) => void;
    setFullAuction: (auction: IAuction) => void;
    appendBid: (bid: BidEvent) => void;
    setAuctionSettled: (auctionSettledEvent: AuctionSettledEvent) => void;
    setAuctionExtended: (auctionExtendedEvent: AuctionExtendedEvent) => void;
}

const initialState: AuctionState = {
    activeAuction: undefined,
    bids: []
};

export const reduxSafeNewAuction = (auction: AuctionCreateEvent): IAuction => ({
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(auction.startTime).toJSON(),
    endTime: BigNumber.from(auction.endTime).toJSON(),
    nounId: BigNumber.from(auction.nounId).toJSON(),
    settled: false,
});

export const reduxSafeAuction = (auction: IAuction): IAuction => ({
    amount: BigNumber.from(auction.amount).toJSON(),
    bidder: auction.bidder,
    startTime: BigNumber.from(auction.startTime).toJSON(),
    endTime: BigNumber.from(auction.endTime).toJSON(),
    nounId: BigNumber.from(auction.nounId).toJSON(),
    settled: auction.settled,
});

export const reduxSafeBid = (bid: BidEvent): BidEvent => ({
    nounId: BigNumber.from(bid.nounId).toJSON(),
    sender: bid.sender,
    value: BigNumber.from(bid.value).toJSON(),
    extended: bid.extended,
    transactionHash: bid.transactionHash,
    timestamp: bid.timestamp,
});

const maxBid = (bids: BidEvent[]): BidEvent => {
    return bids.reduce((prev, current) => {
        return BigNumber.from(prev.value).gt(BigNumber.from(current.value)) ? prev : current;
    });
};

const auctionsEqual = (
    a: IAuction,
    b: AuctionSettledEvent | AuctionCreateEvent | BidEvent | AuctionExtendedEvent,
) => BigNumber.from(a.nounId).eq(BigNumber.from(b.nounId));

const containsBid = (bidEvents: BidEvent[], bidEvent: BidEvent) =>
    bidEvents.map(bid => bid.transactionHash).indexOf(bidEvent.transactionHash) >= 0;

export const useAuctionState = create(
    immer<AuctionState & AuctionSetters>((set) => ({
        ...initialState,
        setActiveAuction: (auction: AuctionCreateEvent) => {
            set((state) => {
                state.activeAuction = reduxSafeNewAuction(auction);
                state.bids = [];
                console.log('processed auction create', auction);
            })
        },
        setFullAuction: (auction: IAuction) => {
            set((state) => {
                console.log(`from set full auction: `, auction);
                state.activeAuction = reduxSafeAuction(auction);
            })
        },
        appendBid: (bidEvent: BidEvent) => {
            set((state) => {
                if (!(state.activeAuction && auctionsEqual(state.activeAuction, bidEvent))) return;
                if (containsBid(state.bids, bidEvent)) return;
                state.bids = [reduxSafeBid(bidEvent), ...state.bids];
                const maxBid_ = maxBid(state.bids);
                state.activeAuction.amount = BigNumber.from(maxBid_.value).toJSON();
                state.activeAuction.bidder = maxBid_.sender;
                console.log('processed bid', bidEvent);
            })
        },
        setAuctionSettled: (auctionSettledEvent: AuctionSettledEvent) => {
            set((state) => {
                if (!(state.activeAuction && auctionsEqual(state.activeAuction, auctionSettledEvent))) return;
                state.activeAuction.settled = true;
                state.activeAuction.bidder = auctionSettledEvent.winner;
                state.activeAuction.amount = BigNumber.from(auctionSettledEvent.amount).toJSON();
                console.log('processed auction settled', auctionSettledEvent);
            })

        },
        setAuctionExtended: (auctionExtendedEvent: AuctionExtendedEvent) => {
            set((state) => {
                if (!(state.activeAuction && auctionsEqual(state.activeAuction, auctionExtendedEvent))) return;
                state.activeAuction.endTime = BigNumber.from(auctionExtendedEvent.endTime).toJSON();
                console.log('processed auction extended', auctionExtendedEvent);
            })
        }
    }))
)
