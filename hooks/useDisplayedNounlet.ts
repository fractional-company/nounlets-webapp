import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

export type NounletAuction = {
  id: number
  nounlet: { id: number }
  amount: BigNumber
  startTime: BigNumber
  endTime: BigNumber
  bidder?: string
  settled: boolean
  bids: { id: number }[]
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

    nounlets.push({
      id: i,
      auction: {
        id: i,
        nounlet: { id: i },
        amount: BigNumber.from(finalBid + '0000000000000000'),
        startTime: BigNumber.from(`${auctionStart}`),
        endTime: BigNumber.from(`${auctionEnd}`),
        settled: i < mockLiveNounletId,
        bids: [{ id: 0 }, { id: 1 }]
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

  console.log('useDisplayedNounlet', nid)

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
