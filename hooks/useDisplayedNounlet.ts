import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import dayjs from "dayjs";

export type NounletAuction = {
  id: number
  nounlet: { id: number }
  amount: BigNumber
  startTime: BigNumber
  endTime: BigNumber
  bidder?: string
  ended?: boolean
  settled: boolean
  bids: Bid[]
}

export interface Bid {
  vault: string;
  token: string;
  id: BigNumber;
  sender: string;
  value: BigNumber;
  extended: boolean;
  timestamp: dayjs.Dayjs,
  txHash: string;
}

type MockData = {
  id: string
  noun: {
    id: number
    nounlets: {
      id: number
      holder?: string
      delegate?: string
      auction: NounletAuction
    }[]
  }
}

// const mockResponse: MockData = {
//   id: '0x067b73fbc3accf78b4b8ebfb7964a03fb4554a0e',
//   noun: {
//     id: 0,
//     nounlets: [
//       {
//         id: 0,
//         auction: {
//           id: 0,
//           nounlet: { id: 0 },
//           amount: BigNumber.from('910000000000000000'),
//           startTime: BigNumber.from('1658743102000'),
//           endTime: BigNumber.from('1658749102000'),
//           settled: false,
//           bids: []
//         }
//       }
//     ]
//   }
// }

const mockLiveNounletId = 13
const now = Math.floor(Date.now() / 1000)

function generateMockNounlets(id: number) {
  const nounlets = []
  for (let i = 0; i <= mockLiveNounletId; i++) {
    const finalBid = Math.floor(10 + Math.random() * 200)
    const auctionDuration = 60 * 60 * 16 // 16 hours
    const dayOffset = 60 * 60 * 24 * (mockLiveNounletId - i)
    const randomHourOffset = Math.floor(60 * 60 * Math.random() * 5)
    const auctionStart = now - dayOffset - randomHourOffset
    const auctionEnd = auctionStart + auctionDuration
    const currentDate = dayjs(new Date())
    const ended = currentDate.isAfter(auctionEnd * 1000)
    const bids: Bid[] = [1, 2, 3, 4, 5, 6].map(bid => {
      return {
        id: BigNumber.from(bid),
        vault: '0x067b73fbc3accf78b4b8ebfb7964a03fb4554a0e',
        sender: bid % 2 === 0 ? '0x7e2082bDD377E2184266f58c104f1eFBd2b59Fc5' : '0x2D631a9C0FF16B57E6c85789341ef2C1BC7d0a2b',
        token: '0x1bFa0347683E7e8774D2208Ccd884609478f7De1',
        extended: bid === 6,
        value: BigNumber.from('920000000000000000').mul(bid),
        timestamp: dayjs(new Date()).subtract(bid * 6, 'hour'),
        txHash: '0xe0bf8f9e5c849e8481c48eef312dfe34b94796dff44b2705a6a8fe5f717a1c3d'
      }
    })

    nounlets.push({
      id: i,
      auction: {
        id: i,
        nounlet: { id: i },
        amount: BigNumber.from(finalBid + '0000000000000000'),
        startTime: BigNumber.from(`${auctionStart}`),
        endTime: BigNumber.from(`${auctionEnd}`),
        settled: i < mockLiveNounletId,
        ended,
        bids,
      }
    })
  }

  return nounlets
}

const mockResponse: MockData = {
  id: '0x067b73fbc3accf78b4b8ebfb7964a03fb4554a0e',
  noun: {
    id: 0,
    nounlets: [...generateMockNounlets(mockLiveNounletId)]
  }
}

export default function useDisplayedNounlet() {
  const router = useRouter()
  const liveNounletId = mockLiveNounletId
  const nid = +(router.query?.nid || 0)
  const [isLoading, setIsLoading] = useState(true)
  const [auctionData, setAuctionData] = useState<NounletAuction | null>(null)

  useEffect(() => {
    console.log('nid change!')
    const data = mockResponse.noun.nounlets[nid].auction
    setAuctionData(data)
  }, [nid])

  const hasAuctionEnded = useMemo(() => {
    return auctionData?.endTime.mul(1000).lt(Date.now())
  }, [auctionData])

  return {
    isLoading,
    hasAuctionEnded,
    nid,
    liveNounletId,
    auctionData
  }
}
