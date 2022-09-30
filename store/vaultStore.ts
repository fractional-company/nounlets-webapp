import { ethers } from 'ethers'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createTrackedSelector } from 'react-tracked'
import { NEXT_PUBLIC_NOUN_VAULT_ADDRESS } from 'config'

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
  isCurrentDelegateOutOfSync: boolean
  wereAllNounletsAuctioned: boolean
  currentDelegate: string
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
  setIsCurrentDelegateOutOfSync: (flag: boolean) => void
  setWereAllNounletsAuctioned: (flag: boolean) => void
  setCurrentDelegate: (address: string) => void
  setLatestNounletTokenId: (id: string) => void
  setBackendLatestNounletTokenId: (id: string) => void
}

const initialState: StoreState = {
  // Constants
  vaultAddress: NEXT_PUBLIC_NOUN_VAULT_ADDRESS.toLowerCase(),
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
  isCurrentDelegateOutOfSync: false,
  wereAllNounletsAuctioned: false,
  currentDelegate: ethers.constants.AddressZero,
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
      setIsCurrentDelegateOutOfSync: (flag) => {
        set((state) => {
          state.isCurrentDelegateOutOfSync = flag
        })
      },
      setWereAllNounletsAuctioned: (flag) => {
        set((state) => {
          state.wereAllNounletsAuctioned = flag
        })
      },
      setCurrentDelegate: (address) => {
        set((state) => {
          state.currentDelegate = address
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
