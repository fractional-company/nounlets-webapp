import { BigNumber, BigNumberish, ethers, FixedNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { toBuyoutInfoFixedNumber, toBuyoutInfoFormatted } from 'lib/utils/formatBuyoutInfo'
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
  }

export type BuyoutOffer = {
  id: string
  sender: string
  value: BigNumber
  txHash: string
}

type BuyoutStoreState = {
  isLoading: boolean
  buyoutInfo: BuyoutInfo & { fixedNumber: BuyoutInfoFixedNumber; formatted: BuyoutInfoFormatted }
  offers: BuyoutOffer[]
}

type BuyoutStoreMethods = {
  setIsLoading: (flag?: boolean) => void
  setBuyoutInfo: (buyoutInfo: BuyoutInfo) => void
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
  offers: []
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
  offers: [
    {
      id: 'BigNumber.from(0)',
      sender: '0x497F34f8A6EaB10652f846fD82201938e58d72E0',
      value: parseEther('10.23'),
      txHash: '0xe0bf8f9e5c849e8481c48eef312dfe34b94796dff44b2705a6a8fe5f717a1c3d'
    },
    {
      id: 'BigNumber.from(1)',
      sender: '0x497F34f8A6EaB10652f846fD82201938e58d72E0',
      value: parseEther('11.00'),
      txHash: '0xe0bf8f9e5c849e8481c48eef312dfe34b94796dff44b2705a6a8fe5f717a1c3d'
    },
    {
      id: 'BigNumber.from(2)',
      sender: '0x497F34f8A6EaB10652f846fD82201938e58d72E0',
      value: parseEther('12.34'),
      txHash: '0xe0bf8f9e5c849e8481c48eef312dfe34b94796dff44b2705a6a8fe5f717a1c3d'
    }
  ]
}

export const useBuyoutStore = create(
  immer<BuyoutStoreState & BuyoutStoreMethods>((set) => ({
    ...initialBuyoutStateData,
    setIsLoading(flag = true) {
      set((state) => {
        state.isLoading = flag
      })
    },
    setBuyoutInfo(buyoutInfo) {
      set((state) => {
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
