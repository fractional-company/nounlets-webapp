import { useResolveName } from '@usedapp/core'
import Button from 'src/components/common/buttons/Button'
import SimpleAddress from 'src/components/common/simple/SimpleAddress'
import SimpleModalWrapper from 'src/components/common/simple/SimpleModalWrapper'
import { ErrorToast, SuccessToast } from 'src/components/toasts/CustomToasts'
import { useDebounced } from 'src/hooks/utils/useDebounced'
import useLeaderboard from 'src/hooks/useLeaderboard'
import useToasts from 'src/hooks/utils/useToasts'
import { WrappedTransactionReceiptState } from 'src/lib/utils/tx-with-error-handling'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAppStore } from 'src/store/application'

export default function ModalVoteForDelegate(): JSX.Element {
  const { voteForDelegateModal, setVoteForDelegateModalForAddress } = useAppStore()
  const { myNounlets, delegateVotes } = useLeaderboard()
  const { toastSuccess, toastError } = useToasts()
  const [isLoading, setIsLoading] = useState(false)
  const [isNotEnoughtNounletsModalShown, setIsNotEnoughtNounletsModalShown] = useState(false)

  const handleVoteForDelegate = async () => {
    if (voteForDelegateModal.address == null) return
    if (myNounlets.length === 0) {
      setIsNotEnoughtNounletsModalShown(true)
      return
    }

    setIsLoading(true)
    try {
      const response = await delegateVotes(voteForDelegateModal.address)
      if (
        response.status === WrappedTransactionReceiptState.SUCCESS ||
        response.status === WrappedTransactionReceiptState.SPEDUP
      ) {
        setVoteForDelegateModalForAddress(false)
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
    <SimpleModalWrapper
      className="vote-for-delegate-modal w-[454px] !max-w-[454px]"
      isShown={voteForDelegateModal.show}
      onClose={() => setVoteForDelegateModalForAddress(false)}
    >
      <div className="font-londrina">
        <h2 className="text-px24 leading-px30 text-gray-4">Vote for delegate</h2>
        <SimpleAddress
          className="text-px42 hover:text-secondary-green -mt-3 -mb-4"
          textClassName="pl-0"
          address={voteForDelegateModal.address || ''}
        />
      </div>
      <div className="mt-8 flex flex-col gap-8">
        <p className="font-500 text-px20 leading-px30 text-gray-4">
          You can change your vote to another delegate at any time.
        </p>

        <div className="flex flex-col bg-gray-4/10 p-4 gap-3 rounded-px16">
          <p className="font-londrina text-px24 leading-px36 text-gray-4 text-center">
            My voting power
          </p>
          <p className="font-londrina text-px36 leading-px42 text-center">{myNounlets.length}</p>
          <Button
            className="primary"
            loading={isLoading}
            onClick={() => {
              handleVoteForDelegate()
            }}
          >
            Vote
          </Button>
        </div>
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
    </SimpleModalWrapper>
  )
}
