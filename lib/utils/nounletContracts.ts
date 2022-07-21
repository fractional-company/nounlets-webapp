import {getRinkebySdk, getMainnetSdk, RinkebySdk} from "@dethcrypto/eth-sdk-client";
import {useEthers} from "@usedapp/core";
import config, {CHAIN_ID} from "../../config";
import {WebSocketProvider} from "@ethersproject/providers";

export const useNounletTokenContract = (isWrite = false) => {
    const { library } = useEthers()
    const { nounletToken } = useNounletContract()
    // @ts-ignore
    return isWrite && library?.getSigner() ? nounletToken.connect(library?.getSigner()) : nounletToken
}

export const useNounletAuctionContract = (isWrite = false) => {
    const { library } = useEthers()
    const { nounletAuction } = useNounletContract()
    // @ts-ignore
    return isWrite && library?.getSigner() ? nounletAuction.connect(library?.getSigner()) : nounletAuction
}

const useNounletContract = () => {
    let {library} = useEthers()
    const wsProvider = new WebSocketProvider(config.app.wsRpcUri);
    const provider = library || wsProvider
    return CHAIN_ID === 4 ? getRinkebySdk(provider) : getMainnetSdk(provider) as RinkebySdk
}

export const useNounletsAuction = () => {
    const auctionContract = useNounletAuctionContract()
    const { library } = useEthers()

    const bid = async () => {
        if (!library?.getSigner()) {
            return
        }
        const temp = auctionContract.connect(library?.getSigner())
        const tx = await temp.createBid('1')
        return tx.wait().then().catch()
    }

    return {bid}
}

type NounletAuction = RinkebySdk["nounletAuction"]
type NounletToken = RinkebySdk["nounletToken"]
