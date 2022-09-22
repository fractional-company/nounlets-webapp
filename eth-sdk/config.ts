import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
  contracts: {
    mainnet: {
      nounlets: {
        NounsDescriptorV2: '0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63',
        NounsToken: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',

        NounletRegistry: '0xF5F93d5089ebf8eA0e6C1b69ED12F3baE9958982',

        NounletAuction: '0x867cD80e464E8E2074a8c46aE3C983096395172F',
        NounletProtoform: '0x162a2D951E4d2864378B90d6ddDb0693E0C4bb07',
        OptimisticBid: '0x22592C894DC7762b99b1688b4A947aE0492FEEaE',

        NounletGovernance: '0x9744c9EbFa3F8be2f4507759147fCbB1e0028D4a',
        NounletToken: '0x26f0ECEF411Fb856B267B0F2Fb21eE694fc056e9',
        ReverseRecords: '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C'
      }
    },
    goerli: {
      nounlets: {
        // NFTDescriptorV2: '0xd876eb7b2618beBEa37DE09aE9F558279db449DF',
        // MintHelper: '0xE883A5Ce65442dAe6f6214F282012ccbD74E7aa9',
        // MockProxyRegistry: '0x8d8dc345AdC746d22E1bC18964AEe266f1D8Fd00',
        // SVGRenderer: '0xAF72E8f22A9c7BEB2E9D6224aF3f94CB6259334F',
        // Inflator: '0x982Cc044b607610Fd7b88d813a2aA5F5FbbDc61A',
        NounsDescriptorV2: '0x2BB1b216270B4C394fE82ebEC020e3F0504AbD6a',
        // NounsArt: '0x8d5fF34828ff3Fd0Cd5101a1dcB7975b22fCF79A',
        // NounsSeeder: '0x0612ec1A199617A5b3DF627755A34F69469AEA25',
        NounsToken: '0x426217d2AeE7793352eB059830d1C752D1327f84',
        // NounsDAOLogicV1: '0x304A67aE501f39f16f70c54806CfcC7C5377314B',
        // NounsDAOExecutor: '0xE0Ebfb5b8A0A67856e98422BaA3f3ac2a51D5e7F',
        // NounsDAOProxy: '0x259aa0B582f648755507Ab6c24E6CB7aa529e993',
        // TransferReference: '0xf9426677241691b74663698D114E93725C09b984',
        NounletRegistry: '0xcF8e741F0fc960ad2E4c0Cae04EFF554453f277F',
        // NounletSupply: '0x0340dd8FC91740A9275C0F20ea01B559f5Db1650',
        NounletAuction: '0x8aC3FCEDaeD381fb35599678D1f29D07F18FF731',
        NounletProtoform: '0xf18D08eC8A96E0D96A7A1d84069552c7E9124182',
        OptimisticBid: '0x3B31fcE72eE2dbF44f51e1826273D6dEBc637838',
        // NounletProposal: '0x7Ae922E0ce88A2550D44F2784cb95907cE9A3532',
        NounletGovernance: '0x05E321dea1b7185401b20457133FEc5eab8d6747',
        NounletToken: '0x05eBCcCb5d545491645903be2D7B9fAf87D80c45',
        ReverseRecords: '0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e'
      }
    }
    // Old contracts
    // goerli: {
    //   nounlets: {
    //     // NFTDescriptorV2: '0x730AD8A5246f4D556B654fa6745E803857c4eC02',
    //     // MintHelper: '0x6e2a978E5B3a4a587d621d1a30Fcd5E89E9F9100',
    //     // MockProxyRegistry: '0xAB5a043fb9554Be92DB80812008026f051BA286D',
    //     // SVGRenderer: '0x7142Ec59090F45F70ADC4D06fC272A8135A3b6A3',
    //     // Inflator: '0x4fB2EBF1234a6Ad0E8C3d3d2C0dFBfF5dD401cc7',
    //     NounsDescriptorV2: '0x6C6B732F680257EE338f42CB65fF09026b448965',
    //     // NounsArt: '0xF30dDDDcdf49616f7A5CeAc7b229D74e66992CB0',
    //     // NounsSeeder: '0x46a51CE653c6A616A30A60D56d2B8D536e6c5550',
    //     NounsToken: '0x395F7e3aB07168219F38386445Da950310B94D1f',
    //     // NounsDAOLogicV1: '0x45AfDa537018246A1EF282349c7Ff9d648063B58',
    //     // NounsDAOExecutor: '0xA8E00a14Af2d32a0cC0EB49F88394bE26c372dB3',
    //     // NounsDAOProxy: '0x642B7d1967eeF7062e402eF9Ff9e41301F4b7632',
    //     // TransferReference: '0x05D1FCc0DDe8Ae23C09eE4e273fD7C9c057ee895',
    //     NounletRegistry: '0x1aB8A2bE7F1761B3312e1F03594BF59e2103d1f4',
    //     // NounletSupply: '0xF0766Ba7CC55dAF57Ee4ab5E58080C3bF6495606',
    //     NounletAuction: '0xf7BDd21074668928C17121238bb0CdA74C0af3cb',
    //     NounletProtoform: '0x8FD2Aa0392FCd7566609C9b3429d8c93216F1524',
    //     OptimisticBid: '0xCf7fBe762980f269F5916aE03551cde76CA32911',
    //     // NounletProposal: '0xBcCea024CD1167D8bF2Ea1C26E6b6236310490d5',
    //     NounletGovernance: '0xF9b5F20Cf4Bf983b60274383a2914280690999d4',
    //     NounletToken: '0xAc56e9B0914e4096a71679921582B056C41D1F10',
    //     ReverseRecords: '0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e'
    //   }
    // },
    // rinkeby: {
    //   nounlets: {
    //     // NFTDescriptorV2: '0x8d76266ca663fca0d4440c09f8e8fd0fe9e6276c',
    //     // MintHelper: '0xd56bb57449454ce300fd3daaa4bb2119a4ff6660',
    //     // MockProxyRegistry: '0xc717a8970db3acb4ab1588bf078f3d157b89b187',
    //     // SVGRenderer: '0x9c9fcbd9e8d1db25ac7e4119f9837eee69a14fe5',
    //     // Inflator: '0xa877bff7f3a154ebc2aa107739c82b7b3f90a3d9',
    //     NounsDescriptorV2: '0x9fb9d67bb7996689c33500b3306f0ba46a9de877',
    //     // NounsArt: '0x71e23e67fb0c732fb37d5fd802efef2bc8f4c165',
    //     // NounsSeeder: '0xf5a1400e325daae78e5fc48456528a17621efb28',
    //     NounsToken: '0x5f4b0a9264246c0c8d4baf1d108a42051f4cc564',
    //     // NounsDAOLogicV1: '0x7c7c56ccb5a57cd5e507b292c9fd46a6a52afb15',
    //     // NounsDAOExecutor: '0x4729eafff14b0cb7203248c7fa7a9e75c7065bb2',
    //     // NounsDAOProxy: '0x2a7983d3fe27e91b778428640956fbb8e87158ff',
    //     // TransferReference: '0x34265fe65898cd7672c777b0a9aa640d620517eb',
    //     NounletRegistry: '0x53ef8e35e34cb874339889c0c0d5345e3a76379b',
    //     // NounletSupply: '0x690579ed2ada99ee95f328d14cd307a1e9da7443',
    //     NounletAuction: '0xa144440dfc9fa662c32981505f39ccf8e47c5fad',
    //     NounletProtoform: '0xcd29cd577c965d128b5e8f9d24173ef521173a3d',
    //     OptimisticBid: '0x1c70df511de53a2b55b0bd1a94cf31394cbfaed1',
    //     // NounletProposal: '0x7f36ec778f2daf9017483c7cea509ae174fbe892',
    //     NounletGovernance: '0x419ccce46c915c6df3c246bae260433b16211ce1',
    //     NounletToken: '0xA5A3Bec0D125C88f2DD409d2f6a79209A49Df771',
    //     ReverseRecords: '0x196eC7109e127A353B709a20da25052617295F6f'
    //   }
    // }
  }
})
