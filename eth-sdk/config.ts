import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
  contracts: {
    mainnet: {
      nounlets: {
        Multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
        NounsDescriptorV2: '0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63',
        NounsToken: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
        NounletRegistry: '0xF5F93d5089ebf8eA0e6C1b69ED12F3baE9958982',

        NounletAuction: '0x867cD80e464E8E2074a8c46aE3C983096395172F',
        NounletProtoform: '0x162a2D951E4d2864378B90d6ddDb0693E0C4bb07',
        OptimisticBid: '0x22592C894DC7762b99b1688b4A947aE0492FEEaE',
        OptimisticBidWrapper: '0x34f0f2dbbbb210e541dc60f289d31f986f55c521',

        NounletGovernance: '0x9744c9EbFa3F8be2f4507759147fCbB1e0028D4a',
        NounletToken: '0x26f0ECEF411Fb856B267B0F2Fb21eE694fc056e9',
        ReverseRecords: '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C'
      }
    },
    goerli: {
      nounlets: {
        MintHelper: '0x906DAc48bA7F05E1E530eFD69a6227d1a4697Cf8',
        Multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
        NounsDescriptorV2: '0x246F5405004fEe2B9adf4f2E5D9b394e62369CAC',
        NounsToken: '0xcB828eB951D629F45b4995C0B8E1dd4E1356B311',
        NounletRegistry: '0x920AE8dF5bb3ea54b02995488f656Af04767f7CF',

        NounletAuction: '0x5b5a2f444753e600a85E30B7127F6597338E5b51',
        NounletProtoform: '0xe5DBA9c4c859dc14DD1f45AB624b0833Df856D99',
        OptimisticBid: '0xdDf0e892F0c514DD7197799762D2A3c9Dc823699',
        OptimisticBidWrapper: '0x9a20375c6516F939A701Eb421BE9D0550ab2ED52',

        NounletGovernance: '0xE15aAbDE61Acfb2429D38c0e38FCaf5BEC42Ab32',
        NounletToken: '0x6B6A6cb85E2F3a0aCC8a9AE041777D64566A9064',
        ReverseRecords: '0x333Fc8f550043f239a2CF79aEd5e9cF4A20Eb41e'
      }
    }
  }
})
