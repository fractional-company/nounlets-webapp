import Button from 'components/buttons/button'
import SimpleModal from 'components/simple-modal'
import { useAppStore } from 'store/application'

export default function VoteForDelegateModal(): JSX.Element {
  const { voteForDelegateModal, setVoteForDelegateModalForAddress } = useAppStore()

  return (
    <SimpleModal
      className="vote-for-delegate-modal !max-w-[454px]"
      isShown={voteForDelegateModal.show}
      onClose={() => setVoteForDelegateModalForAddress(false)}
    >
      <div className="font-londrina">
        <h2 className="text-px24 leading-px30 text-gray-4">Vote for delegate</h2>
        <h2 className="mt-2 text-px42 leading-px36 truncate">
          {voteForDelegateModal.address || 'Address'}
        </h2>
      </div>
      <div className="mt-8 flex flex-col gap-8">
        <p className="font-500 text-px20 leading-px30 text-gray-4">
          You can change your vote to another delegate at any time.
        </p>

        <div className="flex flex-col bg-gray-4/10 p-4 gap-3 rounded-px16">
          <p className="font-londrina text-px24 leading-px36 text-gray-4 text-center">
            My voting power
          </p>
          <p className="font-londrina text-px36 leading-px42 text-center">3</p>
          <Button
            className="primary"
            onClick={() => {
              console.log('Vote for delegate')
            }}
          >
            Vote
          </Button>
        </div>
      </div>
    </SimpleModal>
  )
}
