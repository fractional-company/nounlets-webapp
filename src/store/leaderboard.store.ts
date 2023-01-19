import { createTrackedSelector } from 'react-tracked'
import { leaderboardDataFetcher } from 'src/hooks/useLeaderboardData'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

type LeaderboardData = Awaited<ReturnType<typeof leaderboardDataFetcher>>['leaderboard'] | null

interface StoreState {
  isLoading: boolean
  leaderboardData: LeaderboardData
}
interface StoreActions {
  reset: () => void
  setIsLoading: (flag: boolean) => void
  setLeaderboardData: (data: LeaderboardData) => void
}

const initialState: StoreState = {
  isLoading: true,
  leaderboardData: null
}

export const useLeaderboardStore = createTrackedSelector(
  create(
    immer<StoreState & StoreActions>((set) => ({
      ...initialState,
      reset: () => {
        set((state) => {
          Object.assign(state, initialState)
        })
      },
      setIsLoading: (flag) =>
        set((state) => {
          state.isLoading = flag
        }),

      setLeaderboardData: (data) =>
        set((state) => {
          state.leaderboardData = data
        })
    }))
  )
)
