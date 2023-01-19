import { getTributedNounsList } from 'graphql/src/queries'
import { sleep } from 'radash'
import useSWR from 'swr'

export default function useTributedNounsList() {
  const swrData = useSWR(
    'nouns/tributes',
    async () => {
      // console.log('fetching', 'nouns/tributes')
      await sleep(1000)
      const result = await getTributedNounsList()
      // console.log({ result })
      return result.nouns
    },
    {
      refreshInterval: 30000
    }
  )
  return {
    ...swrData
  }
}
