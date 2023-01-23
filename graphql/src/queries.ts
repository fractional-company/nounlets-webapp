import {
  CHAIN_ID,
  IS_DEVELOP,
  NEXT_PUBLIC_BLOCKS_PER_DAY,
  NEXT_PUBLIC_OPENSEA_KEY,
  OPENSEA_API_URL
} from 'config'
import { BigNumber, ethers } from 'ethers'
import { NounletsSDK } from 'src/hooks/utils/useSdk'
import {
  getTributedNounsGQL,
  getVaultByNounGQL,
  getVaultGQL,
  getVaultListGQL,
  getVaultNounletAuctionGQL,
  getVaultNounletVotesGQL
} from './nounlets'
import axios from 'axios'

function splitKey(key: string) {
  try {
    const parts = key.split('-')
    if (parts.length === 1) return key
    return parts[1]
  } catch (error) {
    console.log('Error spliting key', key)
    return key
  }
}

export const getVaultList = async () => {
  const { data } = await getVaultListGQL()

  // Clean the data
  data.vaults = data.vaults.map((vault) => {
    const nounTokenId = vault.token.id

    if (vault.noun == null) return vault

    const nounlets =
      vault.noun.nounlets.filter((nounlet) => {
        const nounletTokenId = nounlet.id.split('-')[0]
        return nounTokenId.toLowerCase() === nounletTokenId.toLowerCase()
      }) || []

    vault.noun.nounlets = nounlets
    return vault
  })

  // This is develop only issue. We Vaulted the same Noun (16) twice, and the
  // be is not able to handle it right now. For now this is an edge case since
  // its unlikely we will ever do this on production. But if we ever do
  // this needs to be addressed
  if (IS_DEVELOP) {
    data.vaults = data.vaults.filter((vault) => {
      return vault.noun?.id !== '16'
    })
  }

  return data
}

// Get the vault nounlets that BE knows about
export const getVaultData = async (vaultAddressOrNounId: string) => {
  let vault: Awaited<ReturnType<typeof getVaultGQL>>['data']['vault']

  if (vaultAddressOrNounId.startsWith('0x')) {
    vault = (await getVaultGQL(vaultAddressOrNounId)).data.vault
  } else {
    vault = (await getVaultByNounGQL(vaultAddressOrNounId)).data.vaults.at(0)
  }

  if (vault?.noun == null) {
    return null
  }

  const wereAllNounletsAuctioned = vault.noun.nounlets.every((nounlet) => nounlet.auction.settled)
  vault.noun.nounlets = vault.noun.nounlets.filter((nounlet) => {
    return nounlet.id.split('-')[0].toLowerCase() === vault!.token.id.toLowerCase()
  })

  return {
    isLive: true,
    vaultAddress: vault.id.toLowerCase(),
    nounletTokenAddress: vault.token.id.toLowerCase(),
    nounTokenId: vault.noun.id,
    nounletCount: vault.noun.nounlets.length,
    backendCurrentDelegate: vault.noun.currentDelegate.toLowerCase(),
    wereAllNounletsAuctioned
  }
}

export const getNounletAuctionData = async (
  vaultAddress: string,
  nounletTokenAddress: string,
  nounletTokenId: string
) => {
  console.groupCollapsed('🚀 Fetching auction data from BE')
  console.table({ vaultAddress, nounletTokenAddress, nounletTokenId })
  console.groupEnd()

  const { data } = await getVaultNounletAuctionGQL(
    vaultAddress,
    `${nounletTokenAddress}-${nounletTokenId}`
  )

  console.groupCollapsed('🚀 Fetched auction data from BE')
  console.log(data)
  console.groupEnd()

  if (data?.vault?.noun == null) return null
  if ((data.vault.noun.nounlets?.length ?? 0) === 0) return null

  const auction = data.vault.noun.nounlets[0].auction
  auction.id = splitKey(auction.id)
  if (auction.highestBidder) {
    auction.highestBidder = {
      ...auction.highestBidder,
      id: splitKey(auction.highestBidder.id)
    }
  }
  auction.bids = auction.bids.map((auction) => {
    return {
      ...auction,
      bidder: {
        id: splitKey(auction.bidder.id)
      }
    }
  })

  return auction
}

export const getNounletAuctionDataBC = async (
  vaultAddress: string,
  nounletTokenAddress: string,
  nounletTokenId: string,
  nounletAuction: NounletsSDK['v2']['NounletAuction']
) => {
  console.groupCollapsed('🔩 Fetching auction data from Blockchain')
  console.table({ vaultAddress, nounletTokenAddress, nounletTokenId })
  console.groupEnd()

  const bidFilter = nounletAuction.filters.Bid(
    vaultAddress,
    nounletTokenAddress,
    nounletTokenId,
    null,
    null
  )

  const [auctionInfo, bids] = await Promise.all([
    nounletAuction.auctionInfo(vaultAddress, nounletTokenId),
    nounletAuction.queryFilter(bidFilter, -NEXT_PUBLIC_BLOCKS_PER_DAY)
  ])

  type AuctionBC = NonNullable<
    NonNullable<Awaited<ReturnType<typeof getVaultNounletAuctionGQL>>['data']['vault']>['noun']
  >['nounlets'][0]['auction']

  // Transform into GraphQL shape
  type BidBC = AuctionBC['bids'][0]
  const formattedBids: BidBC[] = bids
    .map((bid) => {
      const value = bid.args._value.toString()
      return {
        id: bid.transactionHash,
        bidder: {
          id: `${bid.args._bidder}`
        },
        amount: value,
        blockNumber: bid.blockNumber,
        blockTimestamp: 0,
        txIndex: bid.transactionIndex
      }
    })
    .sort((a, b) => {
      // return BigNumber.from(b.amount).sub(BigNumber.from(a.amount)).toNumber() // This can overflow
      return BigNumber.from(b.amount).gte(BigNumber.from(a.amount)) ? 1 : -1
    })

  const latestBid = formattedBids.at(0)
  const highestBidder = latestBid?.bidder || undefined
  const highestBidAmount = latestBid?.amount || 0
  const auction: AuctionBC = {
    id: nounletTokenId,
    settled: false,
    settledTransactionHash: ethers.constants.AddressZero,
    highestBidAmount: highestBidAmount,
    highestBidder: highestBidder,
    endTime: auctionInfo.endTime,
    bids: [...formattedBids]
  }

  // console.groupCollapsed('🔩 Fetched auction data from Blockchain')
  // console.log(auction)
  // console.groupEnd()

  return auction
}

export const getAllNounlets = async (vaultAddress: string, nounletAuctionAddress: string) => {
  const { data } = await getVaultGQL(vaultAddress)

  if (data?.vault?.noun == null) throw new Error('Noun not found')

  // Remove nounlet auction address
  const nounlets = data.vault.noun.nounlets
    .filter((nounlet) => {
      return nounlet.id.split('-')[0].toLowerCase() === data.vault!.token.id.toLowerCase()
    })
    .filter(
      (nounlet) =>
        nounlet.holder!.id.toLowerCase().split('-')[1] !== nounletAuctionAddress.toLowerCase()
    )

  const accounts: Record<string, { holding: { id: string; delegate: string }[]; votes: number }> =
    {}

  let mostVotes = 0
  let mostVotesAddress = ethers.constants.AddressZero

  nounlets.forEach((nounlet) => {
    const id = splitKey(nounlet.id)
    const holder = splitKey(nounlet.holder!.id)
    const delegate = splitKey(nounlet.delegate!.id)

    if (accounts[holder] == null) {
      accounts[holder] = { holding: [], votes: 0 }
    }

    if (accounts[delegate] == null) {
      accounts[delegate] = { holding: [], votes: 0 }
    }

    accounts[holder].holding.push({ id, delegate })
    accounts[delegate].votes += 1
    if (accounts[delegate].votes > mostVotes) {
      mostVotes = accounts[delegate].votes
      mostVotesAddress = delegate
    }
  })

  const currentDelegate = data.vault.noun.currentDelegate
  let doesDelegateHaveMostVotes = false

  if (
    currentDelegate !== ethers.constants.AddressZero &&
    mostVotesAddress !== ethers.constants.AddressZero
  ) {
    if (!accounts[currentDelegate]) {
      accounts[currentDelegate] = { holding: [], votes: 0 }
    }
    if (accounts[currentDelegate].votes >= mostVotes) {
      mostVotesAddress = currentDelegate
      doesDelegateHaveMostVotes = true
    }
  }

  return {
    accounts,
    currentDelegate,
    mostVotes,
    mostVotesAddress,
    totalVotes: nounlets.length,
    _meta: data._meta
  }
}

export const getNounletVotes = async (
  nounletTokenAddress: string,
  nounletTokenId: string,
  nounletAuctionAddress: string
) => {
  const { data } = await getVaultNounletVotesGQL(`${nounletTokenAddress}-${nounletTokenId}`)
  const filteredVotes = data.nounlet!.delegateVotes.filter((vote) => {
    const delegateAddress = vote.delegate.id.toLowerCase().split('-')[1]

    return (
      delegateAddress !== nounletAuctionAddress.toLowerCase() &&
      delegateAddress !== ethers.constants.AddressZero
    )
  })
  data.nounlet!.delegateVotes = filteredVotes
  return data
}

export const getTributedNounsList = async () => {
  const { data } = await getTributedNounsGQL()
  const transformed = { ...data }
  transformed.nouns = transformed.nouns.filter(
    (noun) => noun.tributedBy !== ethers.constants.AddressZero
  )
  return transformed
}

export type OpenseaCardData = {
  token_id: string
  permalink: string
  image_url: string
}

const axiosConfig: any = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 5000
}

// TODO add leaky bucket maybe?
export const getNFTBalance = async (
  sdk: NounletsSDK,
  walletAddress: string,
  page = 0,
  pageSize = 20
) => {
  const apiUrl = OPENSEA_API_URL[CHAIN_ID]
  const axiosConf = axiosConfig
  axiosConf.headers['X-API-KEY'] = NEXT_PUBLIC_OPENSEA_KEY
  axiosConf.baseURL = apiUrl

  if (CHAIN_ID !== 1) {
    delete axiosConfig.headers['X-API-KEY']
  }

  // v1 does not have this functionality
  const contractAddress = sdk.v2.NounsToken.address
  const contracts = `&asset_contract_address=${contractAddress}`

  const limit = pageSize
  let offset = limit * page
  const queryParams = `owner=${walletAddress}${contracts}`
  const client = axios.create(axiosConfig)

  const url = `/assets?${queryParams}&offset=${offset}&limit=${limit}`
  const { data } = await client.get<{
    assets: Omit<OpenseaCardData, 'isTributed'>[]
  }>(url)

  // console.log('got OS data', data)

  const assets = data.assets.map((asset) => {
    return {
      token_id: asset.token_id,
      permalink: asset.permalink,
      image_url: asset.image_url
    }
  })

  return {
    assets,
    hasMoreItems: assets.length === limit
  }
}
