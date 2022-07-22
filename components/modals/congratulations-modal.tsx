import Button from 'components/buttons/button'
import SimpleModal from 'components/simple-modal'

type ComponentProps = {
  isShown: boolean
  onClose?: () => void
}

export default function CongratulationsModal(props: ComponentProps): JSX.Element {
  return (
    <SimpleModal
      className="congratulations-modal !max-w-[454px]"
      isShown={props.isShown}
      onClose={() => props?.onClose?.()}
    >
      <h2 className="font-londrina text-px24 leading-px30 text-gray-4">Congratulations</h2>

      <div className="mt-4 flex flex-col gap-8">
        <div className="flex flex-col bg-gray-4/10 p-4 gap-3 rounded-px16">
          <p className="font-londrina text-px24 leading-px36 text-gray-4 text-center">
            You now own
          </p>
          <p className="font-londrina text-px36 leading-px42 text-center">Nounlet 32/100</p>
          <p className="font-500 text-px20 leading-px30 text-gray-4 text-center">
            You can change your vote to another delegate at any time.
          </p>
          <Button
            className="primary"
            onClick={() => {
              console.log('Vote for delegate')
            }}
          >
            Cast votes
          </Button>
        </div>
      </div>
    </SimpleModal>
  )
}
