import { RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { BigNumber } from 'ethers'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface StoreState {
  isBeforeLaunch: boolean
  isLoading: boolean
  vaultAddress?: string
  vaultTokenId?: string
  latestNounletId: string
}

interface StoreActions {
  setIsLoading: (flag: boolean) => void
  setVaultAddress: (address?: string) => void
  setVaultTokenId: (id?: string) => void
  setLatestNounletId: (id: string) => void
}

const initialState: StoreState = {
  isBeforeLaunch: false,
  isLoading: true,
  vaultAddress: process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS,
  vaultTokenId: process.env.NEXT_PUBLIC_NOUN_VAULT_TOKEN_ID ?? '0',
  latestNounletId: '0'
}

export const useAuctionStateStore = create(
  immer<StoreState & StoreActions>((set) => ({
    ...initialState,
    setIsLoading: (flag) => {
      set((state) => {
        state.isLoading = flag
      })
    },
    setVaultAddress: (address) => {
      set((state) => {
        state.vaultAddress = address
      })
    },
    setVaultTokenId: (id) => {
      set((state) => {
        state.vaultTokenId = id
      })
    },
    setLatestNounletId: (id) => {
      set((state) => {
        console.log('setCurredntId', id)
        if (id === '0') {
          console.log('Its before the first auction')
          state.latestNounletId = '1'
          state.isBeforeLaunch = true
        } else {
          state.isBeforeLaunch = false
          state.latestNounletId = id
        }
      })
    }
  }))
)
