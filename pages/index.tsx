import { useEthers } from '@usedapp/core'
import { Provider as MulticallProvider } from 'ethers-multicall'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import { NounImage } from 'src/components/common/NounletImage'
import useSdk from 'src/hooks/utils/useSdk'

import NounletsOnAuctionCard from 'src/components/home/Cards/NounletsOnAuctionCard'
import useExistingVaults, { VaultData } from 'src/hooks/useExistingVaults'
import NounletsPastAuctionCard from 'src/components/home/Cards/NounletsPastAuctionCard'

const tmpObj = {
  state: 'AUCTION_IN_PROGRESS',
  id: '0x120287afe666d557974affe201c3de3e5a9e564e',
  nounInVault: true,
  token: {
    id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b',
    __typename: 'Token'
  },
  noun: {
    id: '37',
    currentDelegate: '0x0000000000000000000000000000000000000000',
    nounlets: [
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-1',
        auction: {
          startTime: '1670860392',
          endTime: '1670860392',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-2',
        auction: {
          startTime: '1670862924',
          endTime: '1670862924',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-3',
        auction: {
          startTime: '1670936700',
          endTime: '1670936700',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-4',
        auction: {
          startTime: '1670936772',
          endTime: '1670936772',
          highestBidAmount: '0',
          settled: false,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      }
    ],
    __typename: 'Noun'
  },
  __typename: 'Vault',
  buyoutInfo: {
    state: 0,
    proposer: '0x0000000000000000000000000000000000000000',
    ethBalance: {
      type: 'BigNumber',
      hex: '0x00'
    },
    fractionPrice: {
      type: 'BigNumber',
      hex: '0x00'
    },
    lastTotalSupply: {
      type: 'BigNumber',
      hex: '0x00'
    },
    startTime: {
      type: 'BigNumber',
      hex: '0x00'
    }
  }
}

const tmpObjBuyoutInProgress = {
  state: 'AUCTION_IN_PROGRESS',
  id: '0x120287afe666d557974affe201c3de3e5a9e564e',
  nounInVault: true,
  token: {
    id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b',
    __typename: 'Token'
  },
  noun: {
    id: '37',
    currentDelegate: '0x0000000000000000000000000000000000000000',
    nounlets: [
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-1',
        auction: {
          startTime: '1670860392',
          endTime: '1670860392',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-2',
        auction: {
          startTime: '1670862924',
          endTime: '1670862924',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-3',
        auction: {
          startTime: '1670936700',
          endTime: '1670936700',
          highestBidAmount: '0',
          settled: true,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      },
      {
        id: '0xa01c950855eb4d1ae00cb0c154def4dd41f9043b-4',
        auction: {
          startTime: '1670936772',
          endTime: '1670936772',
          highestBidAmount: '0',
          settled: false,
          __typename: 'Auction'
        },
        __typename: 'Nounlet'
      }
    ],
    __typename: 'Noun'
  },
  __typename: 'Vault',
  buyoutInfo: {
    state: 0,
    proposer: '0x0000000000000000000000000000000000000000',
    ethBalance: {
      type: 'BigNumber',
      hex: '0x016bcc41e90000'
    },
    fractionPrice: {
      type: 'BigNumber',
      hex: '0x5af3107a4000'
    },
    lastTotalSupply: {
      type: 'BigNumber',
      hex: '0x05'
    },
    startTime: {
      type: 'BigNumber',
      hex: '0x6345d440'
    }
  }
}

const Home: NextPage<{ url: string }> = () => {
  const sdk = useSdk()
  const { library } = useEthers()
  const { data } = useExistingVaults()

  useEffect(() => {
    console.log({ buckets: data?.buckets })
  }, [data])

  const [onAuctionList, onBuyoutList] = useMemo(() => {
    if (data == null) return [[], []]

    // const list = data.vaults
    //   // .sort((a, b) => {
    //   //   const aId = +(a.noun?.id || 0)
    //   //   const bId = +(b.noun?.id || 0)

    //   //   return bId - aId
    //   // })
    //   .filter((vault) => vault.noun != null) // This cant happen

    const auctions = [...data.buckets.auctionInProgress]
    const buyouts = [
      ...data.buckets.buyoutInProgress,
      ...data.buckets.finished,
      ...data.buckets.buyoutIdle
    ]

    return [auctions, buyouts]
  }, [data])

  // Nounlets on auction now

  // const vaultList = useMemo(() => {
  //   const list = tmpData.map((vault) => {
  //     return <VaultListTile vaultId={vault.id} nounId={vault.noun!.id} key={vault.id} />
  //   })

  //   return <div className="grid grid-cols-4 gap-4">{list}</div>
  // }, [tmpData])

  return (
    <div className="page-home w-screen">
      <div className="space-y-4 px-6 pt-4 pb-12 text-center">
        <h1 className="font-londrina text-[64px] font-900 leading-[70px]">OWN A PIECE OF A NOUN</h1>
        <p className="font-londrina text-[34px] font-900 leading-[40px] text-[#202A46]">
          Each Noun is split in 100 pieces = 100 Nounlets
        </p>
        <p className="font-londrina text-[30px] font-900 leading-[36px] text-[#313C5C]">
          Nounlets are put on auction every 25 min
        </p>
        <p className="font-londrina text-[16px] font-900 leading-[18px] text-[#58627E] opacity-60">
          When 100 Nounlets of a Noun are sold, a buyout for the Noun is possible
        </p>
      </div>

      <NounletsOnAuction vaults={onAuctionList} />

      <PastNounletAuctions vaults={onBuyoutList} />

      {/* <div className="p-4">{vaultList}</div> */}
    </div>
  )
}

export default Home

function NounletsOnAuction(props: { vaults: VaultData[] }) {
  if (props.vaults.length === 0) return null

  return (
    <div className="bg-black px-6 py-12">
      <h2 className="text-center font-londrina text-[48px] font-900 leading-[52px] text-gray-0.5">
        Nounlets ON AUCTION now!
      </h2>
      <div className="grid grid-cols-2 items-center justify-center justify-items-center gap-6">
        {props.vaults.map((vault, index) => (
          <NounletsOnAuctionCard key={vault.id || index} vault={vault} />
        ))}
      </div>
    </div>
  )
}

function PastNounletAuctions(props: { vaults: VaultData[] }) {
  return (
    <div className="px-6 py-12">
      <h2 className="text-center font-londrina text-[48px] font-900 leading-[52px]">PAST</h2>
      <div className="grid grid-cols-2 items-center justify-center justify-items-center gap-6">
        {props.vaults.map((vault, index) => (
          <NounletsPastAuctionCard key={vault.id || index} vault={vault} />
        ))}
      </div>
    </div>
  )
}
