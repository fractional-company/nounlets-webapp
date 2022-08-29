import { ethers } from 'ethers'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createTrackedSelector } from 'react-tracked'

interface StoreState {
  isLive: boolean // Has BE picked up the vault yet?
  isLoading: boolean
  isCurrentDelegateOutOfSync: boolean
  vaultAddress: string
  nounTokenId: string
  vaultCuratorAddress: string
  currentDelegate: string
  nounletTokenAddress: string
  backendLatestNounletTokenId: string
  latestNounletTokenId: string
  minBidIncrease: string
  backgrounds: Record<string, string>
}

interface StoreActions {
  setIsLive: (flag: boolean) => void
  setIsLoading: (flag: boolean) => void
  setIsCurrentDelegateOutOfSync: (flag: boolean) => void
  setVaultAddress: (address: string) => void
  setNounTokenId: (id: string) => void
  setVaultCuratorAddress: (address: string) => void
  setCurrentDelegate: (address: string) => void
  setNounletTokenAddress: (address: string) => void
  setBackendLatestNounletTokenId: (id: string) => void
  setLatestNounletTokenId: (id: string) => void
}

const initialState: StoreState = {
  isLive: false,
  isLoading: true,
  isCurrentDelegateOutOfSync: false,
  vaultAddress: (process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS || '').toLowerCase(),
  nounTokenId: '',
  vaultCuratorAddress: ethers.constants.AddressZero,
  currentDelegate: ethers.constants.AddressZero,
  nounletTokenAddress: '',
  backendLatestNounletTokenId: '',
  latestNounletTokenId: '',
  minBidIncrease: '0.05',
  backgrounds: {
    '0': '#d5d7e1',
    '1': '#e1d7d5',
    '2': '#d5d7e1',
    '3': '#e1d7d5'
  }
}

export const useVaultStore = createTrackedSelector(
  create(
    immer<StoreState & StoreActions>((set) => ({
      ...initialState,
      setIsLive: (flag) => {
        set((state) => {
          state.isLive = flag
        })
      },
      setIsLoading: (flag) => {
        set((state) => {
          state.isLoading = flag
        })
      },
      setIsCurrentDelegateOutOfSync: (flag) => {
        set((state) => {
          state.isCurrentDelegateOutOfSync = flag
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
)
