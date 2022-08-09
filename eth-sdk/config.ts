import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
    contracts: {
        mainnet: {

        },
        rinkeby: {
            nounletAuction: '0x6d7B5aD50c21c72844Da477f7D08c04829Bf1852',
            nounletToken: '0x3cd078856c24B1A8B6B9D63fDfC9b2983038EC8e',
            nounletProtoform: '0x023f4dfea21d5DE04D9421073a0ede6DF13E8800',
            optimisticBid: '0xeEb28759aF7ec93f0678d7Ce294cF3F75b697355'
        }
    },
})
