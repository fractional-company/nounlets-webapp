import { getLeaderboardData } from 'lib/graphql/queries'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface StoreState {
  data: Awaited<ReturnType<typeof getLeaderboardData>> | null
}

interface StoreActions {
  setData: (data: any) => void
}

const initialState: StoreState = {
  data: null
}

export const useLeaderboardStore = create(
  immer<StoreState & StoreActions>((set) => ({
    ...initialState,
    setData: (data) => {
      set((state) => {
        state.data = data
      })
    }
  }))
)
