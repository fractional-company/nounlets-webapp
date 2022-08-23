import { RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { BigNumber } from 'ethers'
import { getNounletAuctionData } from 'lib/graphql/queries'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { NEXT_PUBLIC_NOUN_VAULT_ADDRESS } from 'config'

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
  persist<StoreState & StoreActions>(
    (set, get) => ({
      ...initialState,
      setData: (id, data) => {
        set((state) => {
          const newData = { ...state.data }
          newData[id] = data
          return { data: newData }
        })
      }
    }),
    {
      name: NEXT_PUBLIC_NOUN_VAULT_ADDRESS,
      getStorage: () => localStorage
    }
  )
)

// export const useAuctionInfoStore = create(
//   immer<StoreState & StoreActions>((set) => ({
//     ...initialState,
//     setData: (id, data) => {
//       set((state) => {
//         state.data[id] = data
//       })
//     }
//   }))
// )
