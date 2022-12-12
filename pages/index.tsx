import { useQuery } from '@tanstack/react-query'
import { getVaultList } from 'graphql/src/queries'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useMemo } from 'react'
import { NounImage } from 'src/components/common/NounletImage'
import useSWR from 'swr'
import { sleep } from 'radash'

const Home: NextPage<{ url: string }> = () => {
  // const neki = useQuery(
  //   ['neki', 2],
  //   async ({ queryKey }) => {
  //     console.log('hi', queryKey)
  //     await sleep(1000)
  //     return 42
  //   },
  //   {
  //     enabled: true,
  //     cacheTime: 0,
  //     onSuccess(data) {
  //       console.log('1', data)
  //     }
  //   }
  // )

  // const neki2 = useQuery(['neki', 2], {
  //   onSuccess(data) {
  //     console.log('2', data)
  //   }
  // })

  // console.log({ neki, neki2 })

  const { data } = useSWR(
    'ExistingVaults',
    async () => {
      const result = await getVaultList()
      console.log({ result })
      return result
    },
    {}
  )

  const vaultList = useMemo(() => {
    if (data == null) return null

    const list = data.vaults
      .sort((a, b) => {
        const aId = +(a.noun?.id || 0)
        const bId = +(b.noun?.id || 0)

        return bId - aId
      })
      .slice(0, 6)
      .map((vault) => {
        if (vault.noun == null) return null
        return <VaultListTile vaultId={vault.id} nounId={vault.noun!.id} key={vault.id} />
      })

    return <div className="grid grid-cols-4 gap-4">{list}</div>
  }, [data])

  return (
    <div className="page-home w-screen">
      <div className="p-4">{vaultList}</div>
    </div>
  )
}

export default Home

function VaultListTile(props: { vaultId: string; nounId: string }) {
  return (
    <Link href={`/noun/${props.nounId}`}>
      <div className="vault-list-tile flex flex-col gap-3 p-2 bg-gray-1 rounded-xl cursor-pointer">
        <NounImage id={props.nounId} />
        <p className={'font-londrina font-700 text-px28 text-center'}>{props.nounId}</p>
      </div>
    </Link>
  )
}
