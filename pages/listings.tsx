import { GetServerSideProps, NextPage } from 'next'
import useSdk from '../src/hooks/useSdk'
import { useEthers } from '@usedapp/core'
import useSWR from 'swr'
import { getVaultList } from '../graphql/src/getVaultList'

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
      return result
    },
    {}
  )
  return (
    <div>
      hi: {props.url} <div>{JSON.stringify(data ?? {}, null, 4)}</div>
    </div>
  )
}
export default Listings
