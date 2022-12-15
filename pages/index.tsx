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
      <div className="space-y-4 px-6 pt-4 pb-12 text-center">
        <h1 className="font-londrina text-[64px] font-900 leading-[70px]">OWN A PIECE OF A NOUN</h1>
        <p className="font-londrina text-[34px] font-900 leading-[40px] text-[#202A46]">
          Each Noun is split in 100 pieces = 100 Nounlets
        </p>
        <p className="font-londrina text-[30px] font-900 leading-[36px] text-[#313C5C]">
          Nounlets are put on auction every 25 min
        </p>
        <p className="font-londrina text-[16px] font-900 leading-[18px] text-[#58627E] opacity-60">
          When 100 Nounlets of a Noun are sold, a buyout for the Noun is possible
        </p>
      </div>

      <div className="bg-black"></div>

      <div className="p-4">{vaultList}</div>
    </div>
  )
}

export default Home

function VaultListTile(props: { vaultId: string; nounId: string }) {
  return (
    <Link href={`/noun/${props.nounId}`}>
      <div className="vault-list-tile flex cursor-pointer flex-col gap-3 rounded-xl bg-gray-1 p-2">
        <NounImage id={props.nounId} />
        <p className={'text-center font-londrina text-px28 font-700'}>{props.nounId}</p>
      </div>
    </Link>
  )
}
