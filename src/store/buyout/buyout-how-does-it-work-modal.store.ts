import { FixedNumber } from 'ethers'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

type BuyoutHowDoesItWorkModalStoreState = {
  isBuyoutHowDoesItWorkModalShown: boolean
  openBuyoutHowDoesItWorkModal: () => void
  closeBuyoutHowDoesItWorkModal: () => void
}

export const useBuyoutHowDoesItWorkModalStore = create(
  immer<BuyoutHowDoesItWorkModalStoreState>((set) => ({
    isBuyoutHowDoesItWorkModalShown: false,
    openBuyoutHowDoesItWorkModal: () => {
      set((state) => {
        state.isBuyoutHowDoesItWorkModalShown = true
      })
    },
    closeBuyoutHowDoesItWorkModal: () => {
      set((state) => {
        state.isBuyoutHowDoesItWorkModalShown = false
      })
    }
  }))
)
