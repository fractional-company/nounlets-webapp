import { createTrackedSelector } from 'react-tracked'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface StoreState {
  bidsBlockNumber: number
  leaderboardBlockNumber: number
}

interface StoreActions {
  setLeaderboardBlockNumber: (data: any) => void
}

const initialState: StoreState = {
  bidsBlockNumber: 0,
  leaderboardBlockNumber: 0
}

export const useBlockCheckpointStore = createTrackedSelector(
  create(
    immer<StoreState & StoreActions>((set, get) => ({
      ...initialState,
      setLeaderboardBlockNumber: (data) => {
        set((state) => {
          console.log('🥇 Setting new leaderboard number', data, get().leaderboardBlockNumber)
          if (data > get().leaderboardBlockNumber) {
            state.leaderboardBlockNumber = data
          } else {
            // console.log('💦💦💦', 'Whoops, number too small :(')
          }
        })
      }
    }))
  )
)
