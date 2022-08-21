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
    // rinkeby: {
    //   nounsToken: '0x1cb65C90d4F46150a302478D81fAc3A50F9085EB',
    //   nounletGovernance: '0x58bbd1e2270e6371966e993b9101573c62f10e34',
    //   nounletAuction: '0xe40e401f1717714c89f7f30ff7fdd82e882d7ef1',
    //   nounletToken: '0x6DB62ACC2C6330566E66AE63877Fc39e94484F34',
    //   nounletProtoform: '0xa9fA8E3e9ea15c37Ec6b65C8d754987bad679820',
    //   nounletRegistry: '0x856fdc95b9c75a404a05bd856d0d23ac4526822c',
    //   nounsDescriptiorV2: '0x51b6172F40818A556A77d7f39b3084042BaAf45b',
    //   optimisticBid: '0x9c841a5b5604351c52ab6df48ef5bf6bb14471c9'
    // }
    rinkeby: {
      sdk: {
        // NFTDescriptorV2: '0x6533246189393c88b36fbea6999fcc9e29e431eb',
        // MintHelper: '0x335a2bd49edf256e17782f096440ab5133597b4e',
        // MockProxyRegistry: '0xb777a5f00c4a1dcd781841c7df3de12db303ef71',
        // SVGRenderer: '0xae8009026fcd585f7076103e110990b07fd67a0d',
        // Inflator: '0x8a83cb3fa09391a75f993e70c9abeb3cf6993ffe',
        NounsDescriptorV2: '0x239f28c4b6c9afa591d9435dc9521c8483ab4737',
        // NounsArt: '0x51d2b47e2fd397e3b738a991bce2b6e86f4a27cb',
        // NounsSeeder: '0x6a1a654e42c40442897bdf3e9807583534317e4a',
        NounsToken: '0xa1e43eb6373e4c8d5f42a2b93d412f06a37af25e',
        // NounsDAOLogicV1: '0x162960bea246ab372f4153a329035c16e59dc1c5',
        // NounsDAOExecutor: '0xde26dbd3035e5b1305b672d538758d5896238ed8',
        // NounsDAOProxy: '0x03811b269697e1d624351174abc7bdcd7c7b6e91',
        // TransferReference: '0x1e6bf95f6bdd57eeb7fbce0437142f4640e1fa96',
        NounletRegistry: '0xedf9beddc7805c041ce0d17fe84b2b448590f129',
        // NounletSupply: '0xbe412dd3529d9690a2094d15c6c0282f8ac6bcd3',
        NounletAuction: '0x7915259bdef8f419dc733ae661c283855a904413',
        NounletProtoform: '0x7d684e5a7651ba51b701d0436e245e9825f38e5a',
        OptimisticBid: '0xede6130d27f19043245a12fc2dd325a17e43784e',
        // NounletProposal: '0xe1354a401015ab229791d0f509bdbd0c71751549',
        NounletGovernance: '0x19c92f9bccc414f1d691974535bf903f619e2fa2',
        NounletToken: '0x92F2880d6D22dd87cECeAD9015C3f6Ab04202432'
      }
    }
  }
})
