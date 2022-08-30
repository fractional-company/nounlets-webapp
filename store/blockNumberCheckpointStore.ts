import { createTrackedSelector } from 'react-tracked'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface StoreState {
  leaderboardBlockNumber: number
}

interface StoreActions {
  setLeaderboardBlockNumber: (data: any) => void
}

const initialState: StoreState = {
  leaderboardBlockNumber: 0
}

export const useBlockNumberCheckpointStore = createTrackedSelector(
  create(
    immer<StoreState & StoreActions>((set, get) => ({
      ...initialState,
      setLeaderboardBlockNumber: (data) => {
        set((state) => {
          if (data > get().leaderboardBlockNumber) {
            console.log('🥇 Setting new leaderboard number!!!', data, get().leaderboardBlockNumber)
            state.leaderboardBlockNumber = data
          }
        })
      }
    }))
  )
)

const useBlockCheckpointStore2 = () => {}
