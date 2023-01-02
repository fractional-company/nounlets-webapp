import { getTributedNounsList } from 'graphql/src/queries'
import useSWR from 'swr'

export default function useTributedNounsList() {
  const swrData = useSWR(
    'nouns/tributes',
    async () => {
      console.log('fetching', 'nouns/tributes')
      const result = await getTributedNounsList()
      console.log({ result })
      return result.nouns
    },
    {}
  )
  return {
    ...swrData
  }
}
