import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
    contracts: {
        mainnet: {

        },
        rinkeby: {
            nounletAuction: '0xc7500c1fe21BCEdd62A2953BE9dCb05911394027',
            nounletToken: '0x3D5bA3Cd2f31116D86a55fEC818209b3CBe1bb29'
        }
    },
})
