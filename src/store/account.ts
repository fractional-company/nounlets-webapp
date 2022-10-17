import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface AccountState {
    activeAccount?: string;
    setActiveAccount: (account?: string | null) => void
}

const initialState: {activeAccount?: string} = {
    activeAccount: undefined,
};


export const useAccountState = create(
    immer<AccountState>((set) => ({
        ...initialState,
        setActiveAccount: (activeAccount) => {
            set((state) => {
                state.activeAccount = activeAccount === null ? undefined : activeAccount;
            })
        }
    }))
)
