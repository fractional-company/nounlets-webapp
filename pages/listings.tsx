import { useEthers } from '@usedapp/core'
import { getVaultByNounGQL, getVaultGQL } from 'graphql/src/nounlets'
import { getVaultData } from 'graphql/src/queries'
import { GetServerSideProps, NextPage } from 'next'
import Button from 'src/components/common/buttons/Button'

import { NounImage } from '../src/components/common/NounletImage'
import useSdk from '../src/hooks/useSdk'

type ListingsProps = {
  url: string
}

export const getServerSideProps: GetServerSideProps<ListingsProps> = async (context) => {
  return {
    props: {
      url: 'https://' + context?.req?.headers?.host
    }
  }
}

const Listings: NextPage<ListingsProps> = (props, context) => {
  const sdk = useSdk()
  const { account } = useEthers()

  // const { data } = useSWR(
  //   'ExistingVaults',
  //   async () => {
  //     const result = await getVaultList()
  //     console.log({ result })
  //     return result
  //   },
  //   {}
  // )

  const test = async () => {
    // const response2 = await getVaultGQL('0x5AEb1BfB7C3e62B956C654F37aD89f07DFbDa68e')
    // const response3 = await getVaultData('0x5AEb1BfB7C3e62B956C654F37aD89f07DFbDa68e')
    const response = await getVaultByNounGQL('29')
    const response4 = await getVaultData('29')

    console.log({ response4 })
  }
  //
  // const { data: data2 } = useSWR(
  //   data && 'ExistingVaults2',
  //   async () => {
  //     const vault = data!.vaults[1]
  //     const result = await getVaultGQL(vault.id)
  //
  //     console.log({ result })
  //     return result
  //   },
  //   {}
  // )
  //
  // const { data: data3 } = useSWR(
  //   data2 && 'AuctionInfo',
  //   async () => {
  //     const vault = data2!.vault!
  //     const vaultId = vault.id
  //     const nounletId = vault.noun?.nounlets.at(0)?.id!
  //
  //     const result = await getVaultNounletAuctionGQL(vaultId, nounletId)
  //     console.log({ result })
  //   },
  //   {}
  // )

  // const vaultList = useMemo(() => {
  //   if (data == null) return null
  //
  //   const list = data.vaults.map((vault) => {
  //     if (vault.noun == null) return null
  //     return <VaultListTile vaultId={vault.id} nounId={vault.noun!.id} key={vault.id} />
  //   })
  //
  //   return <div className="grid grid-cols-4 gap-4">{list}</div>
  // }, [data])

  return (
    <div>
      <p>hi: {props.url}</p>

      <Button className="primary" onClick={test}>
        click me
      </Button>

      {/*<pre>{JSON.stringify(data ?? {}, null, 4)}</pre>*/}
      {/*<pre>{JSON.stringify(data2 ?? {}, null, 4)}</pre>*/}
      {/*<pre>{JSON.stringify(data3 ?? {}, null, 4)}</pre>*/}

      {/*<div className="p-4">{vaultList}</div>*/}
    </div>
  )
}
export default Listings

function VaultListTile(props: { vaultId: string; nounId: string }) {
  return (
    <div className="vault-list-tile">
      <NounImage id={props.nounId} />
    </div>
  )
}
