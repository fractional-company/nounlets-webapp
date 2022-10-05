import { ethers } from 'ethers'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createTrackedSelector } from 'react-tracked'

interface StoreState {
  // Constants
  vaultAddress: string
  nounTokenId: string
  vaultCuratorAddress: string
  nounletTokenAddress: string
  minBidIncrease: string
  backgrounds: Record<string, string>
  // State
  isLive: boolean // Has BE picked up the vault yet?
  isLoading: boolean
  isLeaderboardOutOfSync: boolean
  isCurrentDelegateOutOfSyncOnVaultContract: boolean
  isCurrentDelegateOutOfSyncOnNounContract: boolean
  currentDelegate: string
  currentNounDelegate: string
  latestNounletTokenId: string
  backendLatestNounletTokenId: string
}

interface StoreActions {
  // Constants
  setVaultAddress: (address: string) => void
  setNounTokenId: (id: string) => void
  setVaultCuratorAddress: (address: string) => void
  setNounletTokenAddress: (address: string) => void
  setMinBidIncrease: (percentage: string) => void
  setBackgrounds?: (backgrounds: any) => void
  // State
  setIsLive: (flag: boolean) => void
  setIsLoading: (flag: boolean) => void
  setIsLeaderboardOutOfSync: (flag: boolean) => void
  setIsCurrentDelegateOutOfSyncOnVaultContract: (flag: boolean) => void
  setIsCurrentDelegateOutOfSyncOnNounContract: (flag: boolean) => void
  setCurrentDelegate: (address: string) => void
  setCurrentNounDelegate: (address: string) => void
  setLatestNounletTokenId: (id: string) => void
  setBackendLatestNounletTokenId: (id: string) => void
}

const initialState: StoreState = {
  // Constants
  vaultAddress: (process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS || '').toLowerCase(),
  nounTokenId: '',
  vaultCuratorAddress: ethers.constants.AddressZero,
  nounletTokenAddress: '',
  minBidIncrease: '0.05',
  backgrounds: {
    '0': '#d5d7e1',
    '1': '#e1d7d5',
    '2': '#d5d7e1',
    '3': '#e1d7d5'
  },
  // State
  isLive: false,
  isLoading: true,
  isLeaderboardOutOfSync: false,
    isCurrentDelegateOutOfSyncOnVaultContract: false,
    isCurrentDelegateOutOfSyncOnNounContract: false,
  currentDelegate: ethers.constants.AddressZero,
  currentNounDelegate: ethers.constants.AddressZero,
  latestNounletTokenId: '',
  backendLatestNounletTokenId: ''
}

export const useVaultStore = createTrackedSelector(
  create(
    immer<StoreState & StoreActions>((set) => ({
      ...initialState,
      // Constants
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
      setNounletTokenAddress: (address) => {
        set((state) => {
          state.nounletTokenAddress = address
        })
      },
      setMinBidIncrease: (percentage) => {
        set((state) => {
          state.minBidIncrease = percentage
        })
      },
      setBackgrounds: (backgrounds) => {
        console.log('Not implemented')
      },
      // State
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
      setIsLeaderboardOutOfSync: (flag) => {
        set((state) => {
          state.isLeaderboardOutOfSync = flag
        })
      },
        setIsCurrentDelegateOutOfSyncOnVaultContract: (flag) => {
        set((state) => {
          state.isCurrentDelegateOutOfSyncOnVaultContract = flag
        })
      },
        setIsCurrentDelegateOutOfSyncOnNounContract: (flag) => {
        set((state) => {
          state.isCurrentDelegateOutOfSyncOnNounContract = flag
        })
      },
      setCurrentDelegate: (address) => {
        set((state) => {
          state.currentDelegate = address
        })
      },
      setCurrentNounDelegate: (address) => {
        set((state) => {
          state.currentNounDelegate = address
        })
      },
      setLatestNounletTokenId: (id) => {
        set((state) => {
          state.latestNounletTokenId = id
        })
      },
      setBackendLatestNounletTokenId: (id) => {
        set((state) => {
          state.backendLatestNounletTokenId = id
        })
      }
    }))
  )
)
