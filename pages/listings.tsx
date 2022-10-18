import { GetServerSideProps, NextPage } from 'next'
import useSdk from '../src/hooks/useSdk'
import { useEthers } from '@usedapp/core'
import useSWR from 'swr'
import { getVaultList } from '../graphql/src/queries'
import { useMemo } from 'react'
import { NounImage } from '../src/components/common/NounletImage'

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

  const { data } = useSWR(
    'ExistingVaults',
    async () => {
      const result = await getVaultList()
      console.log({ result })
      return result
    },
    {}
  )

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
  //     const vaultID = vault.id
  //     const nounletID = vault.noun?.nounlets.at(0)?.id!
  //
  //     const result = await getVaultNounletAuctionGQL(vaultID, nounletID)
  //     console.log({ result })
  //   },
  //   {}
  // )

  const vaultList = useMemo(() => {
    if (data == null) return null

    const list = data.vaults.map((vault) => {
      if (vault.noun == null) return null
      return <VaultListTile vaultID={vault.id} nounID={vault.noun!.id} key={vault.id} />
    })

    return <div className="grid grid-cols-4 gap-4">{list}</div>
  }, [data])

  return (
    <div>
      <p>hi: {props.url}</p>

      {/*<pre>{JSON.stringify(data ?? {}, null, 4)}</pre>*/}
      {/*<pre>{JSON.stringify(data2 ?? {}, null, 4)}</pre>*/}
      {/*<pre>{JSON.stringify(data3 ?? {}, null, 4)}</pre>*/}

      <div className="p-4">{vaultList}</div>
    </div>
  )
}
export default Listings

function VaultListTile(props: { vaultID: string; nounID: string }) {
  return (
    <div className="vault-list-tile">
      <NounImage id={props.nounID} />
    </div>
  )
}
