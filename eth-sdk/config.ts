import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
  contracts: {
    mainnet: {},
    // rinkeby: {
    //     nounletAuction: '0x6d7B5aD50c21c72844Da477f7D08c04829Bf1852',
    //     nounletToken: '0x3cd078856c24B1A8B6B9D63fDfC9b2983038EC8e',
    //     nounletProtoform: '0x023f4dfea21d5DE04D9421073a0ede6DF13E8800',
    //     optimisticBid: '0xeEb28759aF7ec93f0678d7Ce294cF3F75b697355'
    // }
    rinkeby: {
      nounsToken: '0x1cb65C90d4F46150a302478D81fAc3A50F9085EB',
      nounletGovernance: '0x58bbd1e2270e6371966e993b9101573c62f10e34',
      nounletAuction: '0xe40e401f1717714c89f7f30ff7fdd82e882d7ef1',
      nounletToken: '0x6DB62ACC2C6330566E66AE63877Fc39e94484F34',
      nounletProtoform: '0xa9fA8E3e9ea15c37Ec6b65C8d754987bad679820',
      nounletRegistry: '0x856fdc95b9c75a404a05bd856d0d23ac4526822c',
      nounsDescriptiorV2: '0x51b6172F40818A556A77d7f39b3084042BaAf45b',
      optimisticBid: '0x9c841a5b5604351c52ab6df48ef5bf6bb14471c9'
    }
    // rinkeby: {
    //   nounsToken: '0x95cf959ce43e8537db2ce86e528af14b3351fa9c',
    //   nounletGovernance: '0x53d0b508ce73bab270d9570e4204f21bc057e868',
    //   nounletAuction: '0xa16b58eb01f712a0c871bf5b04be21e34a1fe8cc',
    //   nounletToken: '0x6DB62ACC2C6330566E66AE63877Fc39e94484F34',
    //   nounletProtoform: '0x800723a27a0bb41dddf862897e4809bdc8b8412f',
    //   nounletRegistry: '0x856fdc95b9c75a404a05bd856d0d23ac4526822c',
    //   nounsDescriptiorV2: '0x51b6172F40818A556A77d7f39b3084042BaAf45b',
    //   optimisticBid: '0xd812c39fd391405c226457360187c93686f2059e'
    // }
  }
})
