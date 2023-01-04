import { useEthers } from '@usedapp/core'
import classNames from 'classnames'
import { CHAIN_ID } from 'config'
import { ethers } from 'ethers'
import { getTributedNounsList } from 'graphql/src/queries'
import { NextPage } from 'next'
import Image from 'next/image'
import { sleep } from 'radash'
import { createContext, useCallback, useMemo, useState } from 'react'
import Button from 'src/components/common/buttons/Button'
import IconCheckmark from 'src/components/common/icons/IconCheckmark'
import { NounImage } from 'src/components/common/NounletImage'
import SimpleAccordion from 'src/components/common/simple/SimpleAccordion'
import SimpleAddress from 'src/components/common/simple/SimpleAddress'
import TributedNounCard from 'src/components/tribute/TributedNounCard'
import TributeFAQ from 'src/components/tribute/TributeFAQ'
import TributeYourWallet from 'src/components/tribute/TributeYourWallet'
import useTributedNounsList from 'src/hooks/tribute/useTributedNounsList'
import useNounTribute from 'src/hooks/tribute/useNounTribute'
import useSdk, { NounletsSDK } from 'src/hooks/utils/useSdk'
import { toastSuccess } from 'src/hooks/utils/useToasts'
import useSWR from 'swr'

const Tribute: NextPage = () => {
  return (
    <div className="page-tribute space-y-8 bg-white lg:space-y-16">
      <div className="bg-gray-1 px-4 pt-4 pb-12">
        <h1 className="text-center font-londrina text-[56px] font-700 uppercase leading-[62px]">
          Want to Tribute your Noun?
        </h1>
      </div>

      <div className="space-y-12 px-4 lg:container lg:mx-auto">
        <TributeYourWallet />

        <div className="space-y-12">
          <h1 className="text-center font-londrina text-[48px] leading-[58px]">
            This is how it goes down
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-20">
            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28">
                <span className="text-primary">1.</span> Tribute your Noun to put it in the waiting
                list.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                Connect your wallet and unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28">
                <span className="text-primary">1.</span> Tribute your Noun to put it in the waiting
                list.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                Connect your wallet and unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-londrina text-px24 leading-px28">
                <span className="text-primary">1.</span> Tribute your Noun to put it in the waiting
                list.
              </h2>
              <p className="font-500 leading-px22 text-gray-4">
                Connect your wallet and unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <h1 className="text-center font-londrina text-[48px] leading-[58px]">Tributed Nouns</h1>

          <p className="text-center font-500 text-gray-4">
            Explanation of this feature..... Nounlets are an experiment to allow for collective
            ownership over an individual Noun. Each Nounlet represents 1% of the vaulted Noun and
            has a vote in delegating the Noun`s governance rights. The selected delegate is the
            official representative to the NounsDAO on behalf of the underlying Noun.
          </p>

          <div>
            <TributedNounsList />
          </div>
        </div>

        <div className="pb-20">
          <TributeFAQ />
        </div>
      </div>
    </div>
  )
}

export default Tribute

function TributedNounsList() {
  const { data: tributedNounsListFull } = useTributedNounsList()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 3

  const tributedNounsListPaginated = useMemo(() => {
    return tributedNounsListFull?.slice(0, PAGE_SIZE * page) || null
  }, [tributedNounsListFull, page])

  const hasMore =
    tributedNounsListFull != null &&
    tributedNounsListPaginated != null &&
    tributedNounsListPaginated.length < tributedNounsListFull.length

  const handleShowMore = useCallback(async () => {
    setIsLoading(true)
    await sleep(1000)
    setPage((value) => value + 1)
    setIsLoading(false)
  }, [])

  return (
    <div className="flex flex-col items-center space-y-8 overflow-hidden rounded-[20px] bg-white p-6">
      {!tributedNounsListPaginated && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <div className="w-[300px]">
            <TributedNounCard.Skeleton />
          </div>
        </div>
      )}

      {tributedNounsListPaginated && tributedNounsListPaginated.length === 0 && (
        <h1 className="text-center font-londrina text-px22 font-900">
          No one has tributed a Noun yet :(
        </h1>
      )}

      {tributedNounsListPaginated && (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {tributedNounsListPaginated.map((nounData) => (
              <div key={nounData.id} className="w-[300px]">
                <TributedNounCard noun={nounData} />
              </div>
            ))}
          </div>
          {hasMore && (
            <Button
              className="default-outline text-black"
              loading={isLoading}
              onClick={handleShowMore}
            >
              Show more
            </Button>
          )}
        </>
      )}
    </div>
  )
}
