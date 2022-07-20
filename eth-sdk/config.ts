import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
    contracts: {
        mainnet: {

        },
        rinkeby: {
            nounletAuction: '0x1bfa0347683e7e8774d2208ccd884609478f7de1',
            nounletToken: '0x13161ad5683D2deDCdeADF1754BE07A0AD7d22A3'
        }
    },
})
