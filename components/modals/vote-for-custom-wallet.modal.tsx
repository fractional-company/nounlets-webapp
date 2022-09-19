import Button from 'components/buttons/button'
import SimpleModalWrapper from 'components/SimpleModalWrapper'
import { ethers } from 'ethers'
import { useDebounced } from 'hooks/useDebounced'
import useLeaderboard from 'hooks/useLeaderboard'
import { useResolveNameFixed } from 'hooks/useResolveNameFixed'
import useToasts from 'hooks/useToasts'
import { shortenAddress } from 'lib/utils/common'
import { WrappedTransactionReceiptState } from 'lib/utils/tx-with-error-handling'
import { useMemo, useState } from 'react'

type ComponentProps = {
  onClose?: () => void
}

export default function VoteForCustomWalletModal(props: ComponentProps): JSX.Element {
  const [searchInputValue, setSearchinputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isNotEnoughtNounletsModalShown, setIsNotEnoughtNounletsModalShown] = useState(false)
  const [isForbiddenModalShown, setIsForbiddenModalShown] = useState(false)

  const { toastSuccess, toastError } = useToasts()
  const { myNounlets, delegateVotes } = useLeaderboard()

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
    if (ensAddress == null) return ''
    return shortenAddress(ensAddress, 6).toLowerCase()
  }, [ensAddress])

  const handleVoteForDelegate = async () => {
    if (ensAddress == null) return
    if (ensAddress === ethers.constants.AddressZero) {
      setIsForbiddenModalShown(true)
      return
    }
    if (myNounlets.length === 0) {
      setIsNotEnoughtNounletsModalShown(true)
      return
    }

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
            className="leading-px48 rounded-px10 px-4 font-500 text-px20 outline-none w-full md:w-[512px] truncate"
            type="text"
            placeholder="ETH wallet address or ENS"
          />
        </div>
        {shortenedAddress && (
          <p className="font-500 text-px20 leading-px20 truncate text-black py-2 text-center">
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

      <SimpleModalWrapper
        isShown={isNotEnoughtNounletsModalShown}
        onClose={() => setIsNotEnoughtNounletsModalShown(false)}
        className="md:min-w-[400px] !max-w-[400px]"
      >
        <h2 className="font-londrina text-px42 -mt-3 -mb-4 pr-4">No nounlets :(</h2>
        <div className="mt-8 flex flex-col gap-6">
          <p className="font-500 text-px20 leading-px30 text-gray-4">
            You need to own at least one Nounlet to be able to vote.
          </p>
          <Button
            className="primary"
            onClick={() => {
              setIsNotEnoughtNounletsModalShown(false)
            }}
          >
            Okay
          </Button>
        </div>
      </SimpleModalWrapper>

      <SimpleModalWrapper
        isShown={isForbiddenModalShown}
        onClose={() => setIsForbiddenModalShown(false)}
        className="md:min-w-[400px] !max-w-[400px]"
      >
        <h2 className="font-londrina text-px42 -mt-3 -mb-4 pr-4">Blasphemy! ⚡️</h2>
        <div className="mt-8 flex flex-col gap-6">
          <p className="font-500 text-px20 leading-px30 text-gray-4">
            The blockchain Gods forbid thy action!
          </p>
          <Button
            className="primary"
            onClick={() => {
              setIsForbiddenModalShown(false)
            }}
          >
            <span>{"Okay, I'm sorry"}</span>
          </Button>
        </div>
      </SimpleModalWrapper>
    </div>
  )
}
