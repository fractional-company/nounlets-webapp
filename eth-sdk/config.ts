import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
  contracts: {
    mainnet: {
      v1: {
        nounlets: {
          Multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
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
      v2: {
        nounlets: {
          Multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
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
      }
    },
    goerli: {
      v1: {
        nounlets: {
          MintHelper: '0x906DAc48bA7F05E1E530eFD69a6227d1a4697Cf8',
          Multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
          NounsDescriptorV2: '0x246F5405004fEe2B9adf4f2E5D9b394e62369CAC',
          NounsToken: '0xcB828eB951D629F45b4995C0B8E1dd4E1356B311',
          NounletRegistry: '0x920AE8dF5bb3ea54b02995488f656Af04767f7CF',

          NounletAuction: '0x5b5a2f444753e600a85E30B7127F6597338E5b51',
          NounletProtoform: '0xe5DBA9c4c859dc14DD1f45AB624b0833Df856D99',
          OptimisticBid: '0xdDf0e892F0c514DD7197799762D2A3c9Dc823699',

          NounletGovernance: '0xE15aAbDE61Acfb2429D38c0e38FCaf5BEC42Ab32',
          NounletToken: '0x6B6A6cb85E2F3a0aCC8a9AE041777D64566A9064',
          ReverseRecords: '0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e'
        }
      },
      v2: {
        nounlets: {
          MintHelper: '0xD4C896356a5dd4c1cfc63c6757601F8f3e3bCC0c',
          Multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
          NounsDescriptorV2: '0x04a999554eBd4Ada190Bb237aAA44501173B1104',
          NounsToken: '0xb36d635D887e38763eaDe353A34f4D7A0182c61F',
          NounletRegistry: '0x4618Cd1Cb89459CB7F88d5bA158B11909603c7f4',

          NounletAuction: '0xf23CA2cc6A05d2c3c0B7aF855fAE6f681DffDE5E',
          NounletProtoform: '0x4D2079Bba84c96951aBc08Dc5E64364873c34d95',
          OptimisticBid: '0xfa07e177a8A46E37b18D904F62A1eF57878AaE07',

          NounletGovernance: '0x00a7aaf812EDAC013d3bbe8c7A2984E65328E97F',
          NounletToken: '0xFf6344A3E052E1f5cfa67e0F86310ffb6E0146e9',
          ReverseRecords: '0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e'
        }
      }
    }
  }
})
