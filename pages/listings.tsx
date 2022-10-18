import { GetServerSideProps, NextPage } from 'next'
import useSdk from '../src/hooks/useSdk'
import { useEthers } from '@usedapp/core'
import useSWR from 'swr'
import { getVaultGQL, getVaultListGQL, getVaultNounletAuctionGQL } from '../graphql/src/nounlets'
import { createKey } from 'next/dist/shared/lib/router/router'

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
  //     const result = await getVaultListGQL()
  //     console.log({ result })
  //     return result
  //   },
  //   {}
  // )
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

  return (
    <div>
      <p>hi: {props.url}</p>

      {/*<pre>{JSON.stringify(data ?? {}, null, 4)}</pre>*/}
      {/*<pre>{JSON.stringify(data2 ?? {}, null, 4)}</pre>*/}
      {/*<pre>{JSON.stringify(data3 ?? {}, null, 4)}</pre>*/}
    </div>
  )
}
export default Listings
