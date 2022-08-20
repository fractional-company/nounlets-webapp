import { RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { BigNumber } from 'ethers'
import { getNounletAuctionData } from 'lib/graphql/queries'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface StoreState {
  data: Record<string, Awaited<ReturnType<typeof getNounletAuctionData>> | null>
}

interface StoreActions {
  setData: (id: string, data: Awaited<ReturnType<typeof getNounletAuctionData>> | null) => void
}

const initialState: StoreState = {
  data: {}
}

export const useAuctionInfoStore = create(
  immer<StoreState & StoreActions>((set) => ({
    ...initialState,
    setData: (id, data) => {
      set((state) => {
        state.data[id] = data
      })
    }
  }))
)
