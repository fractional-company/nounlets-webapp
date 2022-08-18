import { RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { BigNumber } from 'ethers'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface StoreState {
  isLoading: boolean
  vaultAddress: string
  nounletTokenAddress: string
  backendLatestNounletTokenId: string
  latestNounletTokenId: string
  minBidIncrease: string
}

interface StoreActions {
  setIsLoading: (flag: boolean) => void
  setVaultAddress: (address: string) => void
  setNounletTokenAddress: (address: string) => void
  setBackendLatestNounletTokenId: (id: string) => void
  setLatestNounletTokenId: (id: string) => void
}

const initialState: StoreState = {
  isLoading: true,
  vaultAddress: process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS || '',
  nounletTokenAddress: '',
  backendLatestNounletTokenId: '',
  latestNounletTokenId: '',
  minBidIncrease: '0.05'
}

export const useVaultMetadataStore = create(
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
    setNounletTokenAddress: (address) => {
      set((state) => {
        state.nounletTokenAddress = address
      })
    },
    setBackendLatestNounletTokenId: (id) => {
      set((state) => {
        state.backendLatestNounletTokenId = id
      })
    },
    setLatestNounletTokenId: (id) => {
      set((state) => {
        console.log('setCurredntId', id)

        state.latestNounletTokenId = id
      })
    }
  }))
)
