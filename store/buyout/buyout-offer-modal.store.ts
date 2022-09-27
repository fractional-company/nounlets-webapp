import { FixedNumber } from 'ethers'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

type BuyoutOfferModalStoreState = {
  initialFullPriceOffer: FixedNumber
  isBuyoutOfferModalShown: boolean
  buyoutOfferStep: number
  openBuyoutOfferModal: (initialFullPriceOffer: FixedNumber) => void
  closeBuyoutOfferModal: () => void
  setBuyoutOfferStep: (step?: number) => void
}

export const useBuyoutOfferModalStore = create(
  immer<BuyoutOfferModalStoreState>((set) => ({
    initialFullPriceOffer: FixedNumber.from(0),
    isBuyoutOfferModalShown: false,
    buyoutOfferStep: 0,
    openBuyoutOfferModal: (initialFullPriceOffer: FixedNumber) => {
      console.log('open?', initialFullPriceOffer)
      set((state) => {
        state.buyoutOfferStep = 0
        state.initialFullPriceOffer = initialFullPriceOffer
        state.isBuyoutOfferModalShown = true
      })
    },
    closeBuyoutOfferModal: () => {
      set((state) => {
        state.isBuyoutOfferModalShown = false
      })
    },
    setBuyoutOfferStep: (step = 0) => {
      set((state) => {
        state.buyoutOfferStep = step
      })
    }
  }))
)
