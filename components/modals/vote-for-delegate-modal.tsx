import { useResolveName } from '@usedapp/core'
import Button from 'components/buttons/button'
import SimpleAddress from 'components/simple-address'
import SimpleModalWrapper from 'components/SimpleModalWrapper'
import { useDebounced } from 'hooks/useDebounced'
import useLeaderboard from 'hooks/useLeaderboard'
import { useMemo, useState } from 'react'
import { useAppStore } from 'store/application'

export default function VoteForDelegateModal(): JSX.Element {
  const { voteForDelegateModal, setVoteForDelegateModalForAddress } = useAppStore()
  const { myNounlets, delegateVotes } = useLeaderboard()
  const [isLoading, setIsLoading] = useState(false)

  const handleVoteForDelegate = async () => {
    if (voteForDelegateModal.address == null) return
    setIsLoading(true)
    try {
      const response = await delegateVotes(voteForDelegateModal.address)
    } catch (error) {
      console.log('error!', error)
    }
    setIsLoading(false)
  }

  return (
    <SimpleModalWrapper
      className="vote-for-delegate-modal !max-w-[454px]"
      isShown={voteForDelegateModal.show}
      onClose={() => setVoteForDelegateModalForAddress(false)}
    >
      <div className="font-londrina">
        <h2 className="text-px24 leading-px30 text-gray-4">Vote for delegate</h2>
        <SimpleAddress
          className="mt-2 text-px42 leading-px36 hover:text-secondary-green"
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
              console.log('Vote for delegate')
              handleVoteForDelegate()
            }}
          >
            Vote
          </Button>
        </div>
      </div>
    </SimpleModalWrapper>
  )
}
