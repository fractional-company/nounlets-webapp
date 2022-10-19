import { createTrackedSelector } from 'react-tracked'
import { nounletDataFetcher } from 'src/hooks/useNounletData'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

type AuctionData = Awaited<ReturnType<typeof nounletDataFetcher>> | null

interface StoreState {
  isLoading: boolean
  nounletID: string | null
  auctionData: AuctionData
}
interface StoreActions {
  setIsLoading: (flag: boolean) => void
  setNounletID: (nounletID: string | null) => void
  setAuctionData: (data: AuctionData) => void
}

const initialState: StoreState = {
  isLoading: true,
  nounletID: null,
  auctionData: null
}

export const useNounletStore = createTrackedSelector(
  create(
    immer<StoreState & StoreActions>((set) => ({
      ...initialState,

      setIsLoading: (flag) =>
        set((state) => {
          state.isLoading = flag
        }),

      setNounletID: (nounletID) =>
        set((state) => {
          state.nounletID = nounletID
        }),

      setAuctionData: (data) =>
        set((state) => {
          state.auctionData = data
        })
    }))
  )
)
