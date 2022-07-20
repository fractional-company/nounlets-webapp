import create from "zustand";
import {immer} from "zustand/middleware/immer";

interface OnDisplayAuctionState {
  lastAuctionNounId: number | undefined;
  lastAuctionStartTime: number | undefined;
  onDisplayAuctionNounId: number | undefined;
  onDisplayAuctionStartTime: number | undefined;
}

interface OnDisplayAuctionSetters {
  setLastAuctionNounId: (id: number) => void;
  setLastAuctionStartTime: (startTime: number) => void;
  setOnDisplayAuctionNounId: (id: number) => void;
  setOnDisplayAuctionStartTime: (startTime: number) => void;
  setPrevOnDisplayAuctionNounId: () => void;
  setNextOnDisplayAuctionNounId: () => void;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionNounId: undefined,
  lastAuctionStartTime: undefined,
  onDisplayAuctionNounId: undefined,
  onDisplayAuctionStartTime: undefined,
};

export const useDisplayAuction = create(
    immer<OnDisplayAuctionState & OnDisplayAuctionSetters>((set) => ({
      ...initialState,
      setLastAuctionNounId: (id: number) => {
        set(state => {
          state.lastAuctionNounId = id;
        })
      },
      setLastAuctionStartTime: (startTime: number) => {
        set(state => {
          state.lastAuctionStartTime = startTime;
        })
      },
      setOnDisplayAuctionNounId: (id: number) => {
        set(state => {
          state.onDisplayAuctionNounId = id;
        })
      },
      setOnDisplayAuctionStartTime: (startTime: number) => {
        set(state => {
          state.onDisplayAuctionStartTime = startTime;
        })
      },
      setPrevOnDisplayAuctionNounId: () => {
        set(state => {
          if (!state.onDisplayAuctionNounId) return;
          if (state.onDisplayAuctionNounId === 0) return;
          state.onDisplayAuctionNounId = state.onDisplayAuctionNounId - 1;
        })
      },
      setNextOnDisplayAuctionNounId: () => {
        set(state => {
          if (state.onDisplayAuctionNounId === undefined) return;
          if (state.lastAuctionNounId === state.onDisplayAuctionNounId) return;
          state.onDisplayAuctionNounId = state.onDisplayAuctionNounId + 1;
        })
      },
    }))
)
