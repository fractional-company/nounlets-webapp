import { createTrackedSelector } from 'react-tracked'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface VaultsStoreState {
  isLoading: boolean
}

interface VaultsStoreActions {
  setIsLoading: (flag: boolean) => void
}

const initialState: VaultsStoreState = {
  isLoading: true
}

export const useVaultsStore = createTrackedSelector(
  create(
    immer<VaultsStoreState & VaultsStoreActions>((set) => ({
      ...initialState,
      setIsLoading: (flag) => set((state) => (state.isLoading = flag))
    }))
  )
)
