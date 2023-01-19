import { createTrackedSelector } from 'react-tracked'
import { nounletDataFetcher } from 'src/hooks/useNounletData'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

type AuctionData = Awaited<ReturnType<typeof nounletDataFetcher>> | null

interface StoreState {
  isLoading: boolean
  nounletId: string | null
  auctionData: AuctionData
}
interface StoreActions {
  reset: () => void
  setIsLoading: (flag: boolean) => void
  setNounletID: (nounletId: string | null) => void
  setAuctionData: (data: AuctionData) => void
}

const initialState: StoreState = {
  isLoading: true,
  nounletId: null,
  auctionData: null
}

export const useNounletStore = createTrackedSelector(
  create(
    immer<StoreState & StoreActions>((set) => ({
      ...initialState,
      reset: () => {
        // console.log('reseting nounlet store')
        set((state) => {
          Object.assign(state, initialState)
        })
      },
      setIsLoading: (flag) =>
        set((state) => {
          state.isLoading = flag
        }),

      setNounletID: (nounletId) =>
        set((state) => {
          state.nounletId = nounletId
        }),

      setAuctionData: (data) =>
        set((state) => {
          state.auctionData = data
        })
    }))
  )
)
