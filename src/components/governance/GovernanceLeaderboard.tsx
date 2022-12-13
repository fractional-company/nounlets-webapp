import { useEthers, useResolveName } from '@usedapp/core'
import { ChangeEvent, useMemo, useState } from 'react'
import Button from 'src/components/common/buttons/Button'
import IconMagnify from 'src/components/common/icons/IconMagnify'
import IconQuestionCircle from 'src/components/common/icons/IconQuestionCircle'
import IconSpinner from 'src/components/common/icons/IconSpinner'
import SimpleModalWrapper from 'src/components/common/simple/SimpleModalWrapper'
import SimplePopover from 'src/components/common/simple/SimplePopover'
import LeaderboardListTile from 'src/components/leaderboard/LeaderboardListTile'
import ModalVoteForCustomWallet from 'src/components/modals/ModalVoteForCustomWallet'
import { useDebounced } from 'src/hooks/utils/useDebounced'
import useLeaderboard from 'src/hooks/useLeaderboard'
import { useReverseRecords } from 'src/lib/utils/useReverseRecords'
import { useAppStore } from 'src/store/application.store'

export default function GovernanceLeaderboard() {
  const { isOutOfSync, leaderboardData } = useLeaderboard()
  const { account } = useEthers()
  const { setConnectModalOpen } = useAppStore()
  const [isVoteForDelegateModalShown, setIsVoteForDelegateModalShown] = useState(false)
  const [searchInputValue, setSearchinputValue] = useState('')
  const debouncedSearchInputValue = useDebounced(searchInputValue, 500)
  const leaderboardList = useMemo(
    () => leaderboardData.list.map((l) => l.walletAddress),
    [leaderboardData.list]
  )
  const { address: ensAddress, isLoading: isLoadingENSName } =
    useResolveName(debouncedSearchInputValue)
  const {
    ensNames,
    isLoading: isLoadingENSNames,
    error: ensNamesError
  } = useReverseRecords(leaderboardList)

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
    const walletsWithEnsName = (
      ensNames?.length
        ? ensNames.map((ensName, index) => ({ address: leaderboardList[index], ensName }))
        : []
    ).filter((wallet) => wallet.ensName)
    if (filterByText === '') {
      return leaderboardData.list.filter((acc) => {
        return acc.isMe || acc.isDelegate || acc.percentage > 0.019
      })
    }

    return leaderboardData.list.filter((acc) => {
      return (
        acc.walletAddress.toLowerCase().includes(filterByText) ||
        walletsWithEnsName.find(
          (wal) => wal.ensName.includes(filterByText) && wal.address === acc.walletAddress
        )
      )
    })
  }, [ensNames, filterByText, leaderboardData.list, leaderboardList])

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchinputValue(event.target.value.trim())
  }

  return (
    <div className="leaderboard mt-14">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="flex items-center flex-1 gap-3">
          <h2 className="text-px32 font-londrina">Leaderboard</h2>
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
                  className="vote-for-custom-wallet-modal"
                  isShown={isVoteForDelegateModalShown}
                  onClose={() => setIsVoteForDelegateModalShown(false)}
                >
                  <ModalVoteForCustomWallet onClose={() => setIsVoteForDelegateModalShown(false)} />
                </SimpleModalWrapper>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
