import { getRinkebySdk, getMainnetSdk, RinkebySdk } from '@dethcrypto/eth-sdk-client'
import { useEthers } from '@usedapp/core'
import config, { CHAIN_ID } from '../../config'
import { WebSocketProvider } from '@ethersproject/providers'

type NounletAuction = RinkebySdk['NounletAuction']
type NounletToken = RinkebySdk['NounletToken']

// export const useNounletTokenContract = (isWrite = false) => {
//   const { library } = useEthers()
//   const { nounletToken } = useNounletContract()
//   // @ts-ignore
//   return isWrite && library?.getSigner() ? nounletToken.connect(library?.getSigner()) : nounletToken
// }

// export const useNounletAuctionContract = (isWrite = false) => {
//   const { library } = useEthers()
//   const { nounletAuction } = useNounletContract()
//   // @ts-ignore
//   return isWrite && library?.getSigner()
//     ? nounletAuction.connect(library?.getSigner())
//     : nounletAuction
// }

// const useNounletContract = () => {
//   let { library } = useEthers()
//   const wsProvider = new WebSocketProvider(config.app.wsRpcUri)
//   const provider = library || wsProvider
//   return CHAIN_ID === 4 ? getRinkebySdk(provider) : (getMainnetSdk(provider) as RinkebySdk)
// }

// export const useNounletsAuction = () => {
//   const auctionContract = useNounletAuctionContract()
//   const { library } = useEthers()

//   const bid = async (amount: string) => {
//     console.log('bid')
//     // if (!library?.getSigner()) {
//     //     return
//     // }
//     // const tx = await auctionContract.createBid(amount)
//     // return tx.wait().then().catch()
//   }

//   return { bid }
// }
