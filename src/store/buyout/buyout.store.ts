import { BigNumber, BigNumberish, ethers, FixedNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { toBuyoutInfoFixedNumber, toBuyoutInfoFormatted } from 'src/lib/utils/formatBuyoutInfo'
import { createTrackedSelector } from 'react-tracked'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

export enum BuyoutState {
  INACTIVE,
  LIVE,
  SUCCESS
}

export type BuyoutInfoFixedNumber = {
  fractionPrice: FixedNumber
  fullPrice: FixedNumber
  lastTotalSupply: FixedNumber
  ethBalance: FixedNumber
  fractionsOfferedCount: FixedNumber
  fractionsOfferedPrice: FixedNumber
  initialEthBalance: FixedNumber
}

export type BuyoutInfoFormatted = {
  fractionPrice: string
  fullPrice: string
  ethBalance: string
  lastTotalSupply: string
  fractionsOfferedCount: string
  fractionsOfferedPrice: string
  initialEthBalance: string
}

export type BuyoutInfoPartial = {
  startTime: BigNumber
  endTime: BigNumber
  proposer: string
  state: BuyoutState
  fractionPrice: BigNumber
  ethBalance: BigNumber
  lastTotalSupply: BigNumber
  initialEthBalance: BigNumber
}

export type BuyoutFractionsOffered = {
  fractionsOffered: BigNumber[] // Array of IDs
  fractionsRemaining: BigNumber[] // Array of IDs
  fractionsOfferedCount: BigNumber
  fractionsOfferedPrice: BigNumber
}

export type BuyoutInfo = BuyoutInfoPartial &
  BuyoutFractionsOffered & {
    offers: BuyoutOffer[]
    wasNounWithdrawn: boolean
  }

export type BuyoutOffer = {
  id: string
  sender: string
  value: BigNumber
  txHash: string
  state: BuyoutState
}

type BuyoutStoreState = {
  isLoading: boolean
  buyoutInfo: BuyoutInfo & { fixedNumber: BuyoutInfoFixedNumber; formatted: BuyoutInfoFormatted }
  offers: BuyoutOffer[]
}

type BuyoutStoreMethods = {
  setIsLoading: (flag?: boolean) => void
  setBuyoutInfo: (buyoutInfo: BuyoutInfo | null) => void
}

const initialBuyoutInfo: BuyoutInfo = {
  startTime: BigNumber.from(0),
  endTime: BigNumber.from(0),
  proposer: ethers.constants.AddressZero,
  state: BuyoutState.INACTIVE,
  fractionPrice: BigNumber.from(0),
  ethBalance: BigNumber.from(0),
  lastTotalSupply: BigNumber.from(0),
  fractionsOffered: [],
  fractionsRemaining: [],
  fractionsOfferedCount: BigNumber.from(0),
  fractionsOfferedPrice: BigNumber.from(0),
  initialEthBalance: BigNumber.from(0),
  offers: [],
  wasNounWithdrawn: false
}

const buyoutInfoFixedNumber = toBuyoutInfoFixedNumber(initialBuyoutInfo)
const BuyoutInfoFormatted = toBuyoutInfoFormatted(buyoutInfoFixedNumber)

export const initialBuyoutStateData: BuyoutStoreState = {
  isLoading: true,
  buyoutInfo: {
    ...initialBuyoutInfo,
    fixedNumber: buyoutInfoFixedNumber,
    formatted: BuyoutInfoFormatted
  },
  offers: []
}

export const useBuyoutStore = createTrackedSelector(
  create(
    immer<BuyoutStoreState & BuyoutStoreMethods>((set) => ({
      ...initialBuyoutStateData,
      setIsLoading(flag = true) {
        set((state) => {
          state.isLoading = flag
        })
      },
      setBuyoutInfo(buyoutInfo) {
        set((state) => {
          if (buyoutInfo == null) {
            buyoutInfo = initialBuyoutInfo
          }

          const buyoutInfoFixedNumber = toBuyoutInfoFixedNumber(buyoutInfo)
          const BuyoutInfoFormatted = toBuyoutInfoFormatted(buyoutInfoFixedNumber)

          state.buyoutInfo = {
            ...buyoutInfo,
            startTime: BigNumber.from(buyoutInfo.startTime),
            fractionPrice: BigNumber.from(buyoutInfo.fractionPrice),
            ethBalance: BigNumber.from(buyoutInfo.ethBalance),
            lastTotalSupply: BigNumber.from(buyoutInfo.lastTotalSupply),
            fractionsOfferedCount: BigNumber.from(buyoutInfo.fractionsOfferedCount),
            fractionsOfferedPrice: BigNumber.from(buyoutInfo.fractionsOfferedPrice),
            initialEthBalance: BigNumber.from(buyoutInfo.initialEthBalance),
            fixedNumber: buyoutInfoFixedNumber,
            formatted: BuyoutInfoFormatted
          }
        })
      }
    }))
  )
)
