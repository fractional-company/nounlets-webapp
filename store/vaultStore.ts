import { ethers } from 'ethers'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface StoreState {
  isLoading: boolean
  vaultAddress: string
  nounTokenId: string
  vaultCuratorAddress: string
  currentDelegate: string
  nounletTokenAddress: string
  backendLatestNounletTokenId: string
  latestNounletTokenId: string
  minBidIncrease: string
}

interface StoreActions {
  setIsLoading: (flag: boolean) => void
  setVaultAddress: (address: string) => void
  setNounTokenId: (id: string) => void
  setVaultCuratorAddress: (address: string) => void
  setCurrentDelegate: (address: string) => void
  setNounletTokenAddress: (address: string) => void
  setBackendLatestNounletTokenId: (id: string) => void
  setLatestNounletTokenId: (id: string) => void
}

const initialState: StoreState = {
  isLoading: true,
  vaultAddress: process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS || '',
  nounTokenId: '',
  vaultCuratorAddress: ethers.constants.AddressZero,
  currentDelegate: ethers.constants.AddressZero,
  nounletTokenAddress: '',
  backendLatestNounletTokenId: '',
  latestNounletTokenId: '',
  minBidIncrease: '0.05'
}

export const useVaultStore = create(
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
    setNounTokenId: (id) => {
      set((state) => {
        state.nounTokenId = id
      })
    },
    setVaultCuratorAddress: (address) => {
      set((state) => {
        state.vaultCuratorAddress = address
      })
    },
    setCurrentDelegate: (address) => {
      set((state) => {
        state.currentDelegate = address
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
