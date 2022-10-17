import {GetServerSideProps, NextPage} from "next";
import useSdk from "../src/hooks/useSdk";
import {useEthers} from "@usedapp/core";
import useSWR from "swr";

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

  const {data} = useSWR('ExistingVaults', () => {



  }, {})
  return <div>hi: {props.url}</div>
}
export default Listings
