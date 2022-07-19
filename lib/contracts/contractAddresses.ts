const RinkebyContractAddresses = {
    NounletAuction: '0x1bFa0347683E7e8774D2208Ccd884609478f7De1',
    NounletRegistry: '0x1bFa0347683E7e8774D2208Ccd884609478f7De1',
    NounletTarget: '0x1bFa0347683E7e8774D2208Ccd884609478f7De1',
    NounletToken: '0x1bFa0347683E7e8774D2208Ccd884609478f7De1',
    VaultFactory: '0x1bFa0347683E7e8774D2208Ccd884609478f7De1',
    Vault: '0x1bFa0347683E7e8774D2208Ccd884609478f7De1',
    Transfer: '0x1bFa0347683E7e8774D2208Ccd884609478f7De1'
}

const MainnetContractAddresses = {
    NounletAuction: '',
    NounletRegistry: '',
    NounletTarget: '',
    NounletToken: '',
    VaultFactory: '',
    Vault: '',
    Transfer: ''
}

export const contractAddresses = process.env.NEXT_PUBLIC_CHAIN_ID === '4' ? RinkebyContractAddresses : MainnetContractAddresses
