import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {grey} from "../lib/utils/nounBgColors";

export interface AlertModal {
    show: boolean;
    title?: string;
    message?: string;
    isMilestone?: boolean;
    isActionPrompt?: boolean;
    actionMessage?: string;
    action?: () => void
}

interface ApplicationState {
    stateBackgroundColor: string;
    isCoolBackground: boolean;
    alertModal: AlertModal;
    isConnectModalOpen: boolean;
}

interface ApplicationSetters {
    setAlertModal: (modal: AlertModal) => void;
    setStateBackgroundColor: (color: string) => void;
    setConnectModalOpen: (isOpen: boolean) => void;
}

const initialState: ApplicationState = {
    stateBackgroundColor: grey,
    isCoolBackground: true,
    isConnectModalOpen: false,
    alertModal: {
        show: false,
    }
}

export const useAppState = create(
    immer<ApplicationState & ApplicationSetters>((set) => ({
        ...initialState,
        setStateBackgroundColor: (bgColor: string) => {
            set(state => {
                state.stateBackgroundColor = bgColor;
                state.isCoolBackground = bgColor === grey;
            })
        },
        setAlertModal: (alertModal: AlertModal) => {
            set(state => {
                state.alertModal = alertModal;
            })
        },
        setConnectModalOpen: (isOpen: boolean) => {
            set(state => {
                state.isConnectModalOpen = isOpen;
            })
        }
    }))
)
