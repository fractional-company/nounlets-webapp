import { createTrackedSelector } from 'react-tracked'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface AlertModal {
  show: boolean
  title?: string
  message?: string
  isMilestone?: boolean
  isActionPrompt?: boolean
  actionMessage?: string
  action?: () => void
}

export interface VoteForDelegateModal {
  show: boolean
  address?: string
}

export interface CongratulationsModal {
  show: boolean
  nounletId?: string
}

interface ApplicationState {
  isCoolBackground: boolean
  alertModal: AlertModal
  isConnectModalOpen: boolean
  voteForDelegateModal: VoteForDelegateModal
  congratulationsModal: CongratulationsModal
  isBidModalOpen: boolean
}

interface ApplicationSetters {
  setAlertModal: (modal: AlertModal) => void
  setConnectModalOpen: (isOpen: boolean) => void
  setBidModalOpen: (isOpen: boolean) => void
  setVoteForDelegateModalForAddress: (isOpen: boolean, address?: string) => void
  setCongratulationsModalForNounletId: (isOpen: boolean, nounletId?: string) => void
}

const initialState: ApplicationState = {
  isCoolBackground: true,
  isConnectModalOpen: false,
  isBidModalOpen: false,
  alertModal: {
    show: false
  },
  voteForDelegateModal: {
    show: false,
    address: undefined
  },
  congratulationsModal: {
    show: false,
    nounletId: undefined
  }
}

export const useAppStore = createTrackedSelector(
  create(
    immer<ApplicationState & ApplicationSetters>((set) => ({
      ...initialState,
      setAlertModal: (alertModal: AlertModal) => {
        set((state) => {
          state.alertModal = alertModal
        })
      },
      setConnectModalOpen: (isOpen: boolean) => {
        set((state) => {
          state.isConnectModalOpen = isOpen
        })
      },
      setBidModalOpen: (isOpen: boolean) => {
        set((state) => {
          state.isBidModalOpen = isOpen
        })
      },
      setCongratulationsModalForNounletId: (isOpen, nounletId) => {
        set((state) => {
          state.congratulationsModal.show = isOpen
          if (nounletId != null) {
            state.congratulationsModal.nounletId = nounletId
          }
        })
      },
      setVoteForDelegateModalForAddress(isOpen, address) {
        set((state) => {
          state.voteForDelegateModal.show = isOpen
          if (address != null) {
            state.voteForDelegateModal.address = address
          }
        })
      }
    }))
  )
)
