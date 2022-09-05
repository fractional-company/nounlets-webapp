import { useEthers, useResolveName } from '@usedapp/core'
import Button from 'components/buttons/button'
import IconMagnify from 'components/icons/icon-magnify'
import IconQuestionCircle from 'components/icons/icon-question-circle'
import IconSpinner from 'components/icons/icon-spinner'
import LeaderboardListTile from 'components/leaderboard/leaderboard-list-tile'
import VoteForCustomWalletModal from 'components/modals/vote-for-custom-wallet.modal'
import { NounletImage } from 'components/NounletImage'
import SimpleAddress from 'components/simple-address'
import SimplePopover from 'components/simple-popover'
import SimpleModalWrapper from 'components/SimpleModalWrapper'
import { ethers } from 'ethers'
import { useDebounced } from 'hooks/useDebounced'
import useLeaderboard from 'hooks/useLeaderboard'
import useToasts from 'hooks/useToasts'
import { NextPage } from 'next'
import Link from 'next/link'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useAppStore } from 'store/application'
import { useVaultStore } from 'store/vaultStore'
import SEO from "../components/seo";
import {useReverseRecords} from "../lib/utils/useReverseRecords";

const Governance: NextPage<{ url: string }> = ({url}) => {
  const { isLive, latestNounletTokenId } = useVaultStore()

  return (
    <div className="page-governance lg:container mx-auto w-screen">
      <SEO
          url={`${url}/governance`}
          openGraphType="website"
          title="Nounlets Governance"
          description="Vote for your delegate"
          image={`${url}/img/loading-skull.gif`}
      />
      <div className="px-4 md:px-12 lg:px-4 mt-12 lg:mt-16">
        <h4 className="font-londrina text-px24 leading-px36 text-gray-4">Governance</h4>
        <h1 className="font-londrina text-[56px] leading-[68px] mt-3">Vote for a delegate</h1>

        {!isLive || latestNounletTokenId === '1' ? (
          <>
            <p className="font-500 text-px20 leading-px28 text-gray-4 mt-6">
              The governance page has no activity yet, since the auction for the first Nounlet did
              not finish yet. Check back soon!
            </p>
            <Link href={'/'}>
              <Button className="primary mt-6">Go to auction</Button>
            </Link>
          </>
        ) : (
          <>
            <p className="font-500 text-px20 leading-px28 text-gray-4 mt-6">
              All Nounlet owners will be able to vote on a delegate. The delegate will be elected
              on-chain in the Nouns contract. The active delegate will be able to join the official
              nouns-private discord channel, vote in governance and submit governance proposals.
              Each Nounlet has 1 vote on the delegate.
            </p>

            <GovernanceCurrentDelegate />

            <GovernanceLeaderboard />
          </>
        )}
      </div>
    </div>
  )
}


export const getServerSideProps = (context: any) => {
  return {
    props: {
      url: context?.req?.headers?.host,
    },
  };
};

export default Governance

function GovernanceCurrentDelegate() {
  const { account } = useEthers()
  const { currentDelegate, isCurrentDelegateOutOfSync } = useVaultStore()
  const { myNounlets, myNounletsVotes, mostVotesAcc, claimDelegate } = useLeaderboard()
  const { toastSuccess, toastError } = useToasts()
  const [isClaiming, setIsClaiming] = useState(false)

  const areMyVotesSplit = useMemo(() => {
    return Object.keys(myNounletsVotes).length > 1
  }, [myNounletsVotes])

  const currentDelegateRC = useMemo(() => {
    return currentDelegate === ethers.constants.AddressZero ? (
      <p className="text-px36 font-londrina leading-px42">no one :(</p>
    ) : (
      <SimpleAddress
        avatarSize={40}
        className="text-px36 font-londrina leading-px42 space-x-3"
        address={currentDelegate}
      />
    )
  }, [currentDelegate])

  const handleUpdateDelegate = useCallback(async () => {
    console.log('handlee', mostVotesAcc)
    if (mostVotesAcc.address !== ethers.constants.AddressZero) setIsClaiming(true)
    try {
      const response = await claimDelegate(mostVotesAcc.address)
      console.log('yasss', response)
      toastSuccess('Delegate updated 👑', 'Leaderboard will refresh momentarily.')
    } catch (error) {
      toastError('Update delegate failed', 'Please try again.')
      setIsClaiming(false)
    }
  }, [mostVotesAcc, claimDelegate, toastError, toastSuccess])

  return (
    <div className="mt-10 border-2 rounded-px16 p-4 lg:p-8 border-gray-2">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col xs:flex-row items-center xs:gap-3">
            <p className="font-londrina text-px24 text-gray-4 leading-[40px]">Current delegate</p>

            {isCurrentDelegateOutOfSync && (
              <div className="flex items-center">
                <SimplePopover>
                  <h1 className="font-700 text-px18 text-gray-4">
                    <span className="text-secondary-orange">⚠</span> Out of sync
                  </h1>
                  <div>
                    This delegate is currently out of sync. There is another wallet with more votes.
                    You can update the delegate with a transaction.
                  </div>
                </SimplePopover>

                <Button
                  loading={isClaiming}
                  onClick={() => handleUpdateDelegate()}
                  className="hidden lg:flex ml-4 items-center justify-center text-secondary-blue hover:text-secondary-green text-px18 font-700 border-2 border-transparent h-10 rounded-px10"
                >
                  <span>Update</span>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center mt-4">{currentDelegateRC}</div>
        </div>

        {account && (
          <>
            <div className="hidden lg:block lg:-my-8 border-r-2 border-gray-2"></div>

            <div className="flex flex-col lg:max-w-[300px]">
              <div className="flex flex-col xs:flex-row items-center xs:gap-3">
                <p className="font-londrina text-px24 text-gray-4 leading-px36">My nounlets</p>

                {areMyVotesSplit && (
                  <div className="flex items-center">
                    <SimplePopover>
                      <h1 className="font-700 text-px18 text-gray-4">
                        <span className="text-secondary-orange">⚠</span> Multiple votes
                      </h1>
                      <div>
                        Your nounlets are voting for multiple addresses. We recommend you update
                        your votes to only be for one address.
                      </div>
                    </SimplePopover>
                  </div>
                )}
              </div>

              <div className="flex items-center mt-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-px36 font-londrina leading-px42 w-10 h-10 flex-shrink-0 overflow-visible text-center">
                    {myNounlets.length}
                  </p>
                  {myNounlets.map((nounlet) => {
                    return (
                      <Link href={`/nounlet/${nounlet.id}`} key={nounlet.id}>
                        <div className="overflow-hidden flex-shrink-0 w-10 h-10 rounded-px8 cursor-pointer hover:scale-110 transition-transform">
                          <NounletImage id={nounlet.id} />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function GovernanceLeaderboard() {
  const { data, isOutOfSync, myNounletsVotes, myNounlets, leaderboardData } = useLeaderboard()
  const { account } = useEthers()
  const { setConnectModalOpen } = useAppStore()
  const [isVoteForDelegateModalShown, setIsVoteForDelegateModalShown] = useState(false)
  const [searchInputValue, setSearchinputValue] = useState('')
  const debouncedSearchInputValue = useDebounced(searchInputValue, 500)
  const leaderboardList = useMemo(() => leaderboardData.list.map(l => l.walletAddress), [leaderboardData.list])
  const { address: ensAddress, isLoading: isLoadingENSName } =
    useResolveName(debouncedSearchInputValue)
  const {ensNames, isLoading: isLoadingENSNames, error: ensNamesError} = useReverseRecords(leaderboardList)


  const filterByText = useMemo(() => {
    if (debouncedSearchInputValue.trim() === '') return debouncedSearchInputValue.trim()
    if (ensAddress != null) {
      return (ensAddress || '').toLowerCase()
    }

    // if (debouncedSearchInputValue.match(/^0x[a-fA-F0-9]{1,40}$/) != null) {
    //   return debouncedSearchInputValue
    // }

    return debouncedSearchInputValue
  }, [debouncedSearchInputValue, ensAddress])

  const filteredLeaderboardListData = useMemo(() => {
    const walletsWithEnsName = (ensNames?.length ? ensNames.map((ensName, index) => ({address: leaderboardList[index], ensName})) : []).filter(wallet => wallet.ensName)
    if (filterByText === '') {
      return leaderboardData.list.filter((acc) => {
        return acc.isMe || acc.isDelegate || acc.percentage > 0.019
      })
    }

    return leaderboardData.list.filter((acc) => {
      return acc.walletAddress.toLowerCase().includes(filterByText) || walletsWithEnsName.find(wal => wal.ensName.includes(filterByText) && wal.address === acc.walletAddress)
    })
  }, [ensNames, filterByText, leaderboardData.list, leaderboardList])

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchinputValue(event.target.value.trim())
  }

  return (
    <div className="leaderboard mt-14">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="flex items-center flex-1 gap-3">
          <h2 className="font-londrina text-[40px] leading-[47px]">Leaderboard</h2>
          {isOutOfSync && (
            <SimplePopover>
              <IconSpinner className="animate-spin h-6" />
              <div>Leaderboard is syncing.</div>
            </SimplePopover>
          )}
        </div>
        {account == null ? (
          <div className="flex flex-col xs:flex-row items-center gap-2">
            <p className="font-500 text-px14 text-gray-3">Connect wallet to cast a vote</p>
            {/* <Button
              key={0}
              className="text-px18 leading-px26 basic default !h-11"
              onClick={() => setBidModalOpen(true)}
              disabled={historicBids.length === 0}
            >
              <IconBidHistory className="mr-2.5" /> Bid history
            </Button> */}
            <Button className="default --sm" onClick={() => setConnectModalOpen(true)}>
              Connect wallet
            </Button>
          </div>
        ) : (
          <p className="font-500 text-px14 text-gray-3">You can change your cast votes below</p>
        )}
      </div>
      <div
        className="lg:grid leading-[38px] mt-10 items-center"
        style={{ gridTemplateColumns: 'auto 100px 140px 160px' }}
      >
        <div className="flex">
          <div className="flex h-12 items-center bg-gray-1 focus-within:outline-dashed focus-within:outline-[3px] rounded-px10 px-2 gap-2 w-full lg:w-10/12">
            <IconMagnify className="w-5 h-5 flex-shrink-0" />
            <input
              value={searchInputValue}
              onChange={handleInput}
              className="outline-none font-500 text-px20 flex-1 bg-transparent"
              type="text"
              placeholder="Search by wallet or ENS"
            />
            {isLoadingENSName && (
              <IconSpinner className="flex-shrink-0 h-5 text-gray-3 animate-spin" />
            )}
          </div>
        </div>
        <h4 className="hidden lg:block text-right text-px18 text-gray-4 font-500">Nounlets</h4>
        <div className="hidden lg:flex items-center justify-end text-px18 text-gray-4 font-500">
          <span className="mr-1">Votes</span>
          <SimplePopover>
            <IconQuestionCircle className="text-gray-3" />
            <div>Total power that this wallet has.</div>
          </SimplePopover>
        </div>
        <div className="hidden lg:block"></div>
      </div>

      <div className="leaderboard-list mt-8 space-y-2">
        {filteredLeaderboardListData.length === 0 ? (
          <>
            {filterByText.length === 0 ? (
              <p className="font-500 text-px20 leading-px28 text-gray-4">
                No auctions finished yet
              </p>
            ) : (
              <p className="font-500 text-px20 leading-px28 text-gray-4">Wallet not found :(</p>
            )}
          </>
        ) : (
          <>
            {filteredLeaderboardListData.map((data) => (
              <LeaderboardListTile key={data.walletAddress} data={data} />
            ))}

            {account && (
              <>
                <Button
                  onClick={() => setIsVoteForDelegateModalShown(true)}
                  className="border-2 border-gray-2 hover:border-secondary-blue h-12 sm:h-[74px] rounded-px16 text-secondary-blue w-full text-px20 font-700"
                >
                  Vote for a custom wallet
                </Button>

                <SimpleModalWrapper
                  preventCloseOnBackdrop
                  className="vote-for-custom-wallet-modal w-[454px] !max-w-[454px]"
                  isShown={isVoteForDelegateModalShown}
                  onClose={() => setIsVoteForDelegateModalShown(false)}
                >
                  <VoteForCustomWalletModal onClose={() => setIsVoteForDelegateModalShown(false)} />
                </SimpleModalWrapper>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
