import {getRinkebySdk, getMainnetSdk, RinkebySdk} from "@dethcrypto/eth-sdk-client";
import {connectContractToSigner, useEthers} from "@usedapp/core";
import config, {CHAIN_ID} from "../../config";
import {WebSocketProvider} from "@ethersproject/providers";

export const useNounletTokenContract = (isWrite = false) => {
    const { library, account } = useEthers()
    const { nounletToken } = useNounletContract()
    // @ts-ignore
    return isWrite && account ? connectContractToSigner(nounletToken, undefined, library) : nounletToken
}

export const useNounletAuctionContract = (isWrite = false) => {
    const { library, account } = useEthers()
    const { nounletAuction } = useNounletContract()
    // @ts-ignore
    return isWrite && account ? connectContractToSigner(nounletAuction, undefined, library) : nounletAuction
}

const useNounletContract = () => {
    let {library} = useEthers()
    const wsProvider = new WebSocketProvider(config.app.wsRpcUri);
    const provider = library || wsProvider
    return CHAIN_ID === 4 ? getRinkebySdk(provider) : getMainnetSdk(provider) as RinkebySdk
}
