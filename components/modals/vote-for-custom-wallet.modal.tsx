import { useResolveName } from '@usedapp/core'
import Button from 'components/buttons/button'
import SimpleAddress from 'components/simple-address'
import SimpleModalWrapper from 'components/SimpleModalWrapper'
import { ethers } from 'ethers'
import { useDebounced } from 'hooks/useDebounced'
import useLeaderboard from 'hooks/useLeaderboard'
import { useResolveNameFixed } from 'hooks/useResolveNameFixed'
import useToasts from 'hooks/useToasts'
import { shortenAddress } from 'lib/utils/common'
import { WrappedTransactionReceiptState } from 'lib/utils/tx-with-error-handling'
import { useMemo, useState } from 'react'
import { useAppStore } from 'store/application'

type ComponentProps = {
  onClose?: () => void
}

export default function VoteForCustomWalletModal(props: ComponentProps): JSX.Element {
  const [searchInputValue, setSearchinputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setVoteForDelegateModalForAddress } = useAppStore()
  const { toastSuccess, toastError } = useToasts()
  const { delegateVotes } = useLeaderboard()

  const debouncedSearchInputValue = useDebounced(searchInputValue, 500)
  const {
    address: ensAddress,
    isLoading: isLoadingENSName,
    error: ensAddressError
  } = useResolveNameFixed(debouncedSearchInputValue)

  const isValidAddressOrEns = useMemo(() => {
    if (isLoadingENSName) return false
    if (ensAddressError) return false
    if (ensAddress == null) return false
    return true
  }, [isLoadingENSName, ensAddress, ensAddressError])

  const shortenedAddress = useMemo(() => {
    if (ensAddress == null || ensAddress === debouncedSearchInputValue) return ''
    return shortenAddress(ensAddress, 6).toLowerCase()
  }, [ensAddress, debouncedSearchInputValue])

  const handleVoteForDelegate = async () => {
    if (ensAddress == null) return
    setIsLoading(true)
    try {
      const response = await delegateVotes(ensAddress)
      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        props.onClose?.()
        toastSuccess('Votes cast 🎉', 'Leaderboard will refresh momentarily.')
      } else {
        throw response
      }
    } catch (error) {
      console.log('error!', error)
      toastError('Votes cast failed', 'Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div>
      <div className="font-londrina">
        <h2 className="text-px42 -mt-3 -mb-4">Vote for wallet</h2>
      </div>
      <div className="mt-8 flex flex-col gap-3">
        <div className="flex-1 focus-within:outline-dashed focus-within:outline-[3px] rounded-px10">
          <input
            value={searchInputValue}
            onChange={(event) => setSearchinputValue(event.target.value.trim())}
            className="leading-px48 rounded-px10 px-4 font-500 text-px20 outline-none w-full md:w-[400px] truncate"
            type="text"
            placeholder="eth wallet address or ENS"
          />
        </div>
        {shortenedAddress && (
          <p className="font-londrina font-500 text-px20 leading-px20 truncate text-gray-4 py-2 text-center">
            {shortenedAddress}
          </p>
        )}

        <Button
          className="primary"
          onClick={() => {
            handleVoteForDelegate()
          }}
          disabled={!isValidAddressOrEns}
          loading={isLoadingENSName || isLoading}
        >
          Vote for delegate
        </Button>
      </div>
    </div>
  )
}
