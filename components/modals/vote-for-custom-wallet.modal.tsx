import Button from 'components/buttons/button'
import SimpleModal from 'components/simple-modal'

type ComponentProps = {
  isShown: boolean
  onClose?: () => void
}

export default function VoteForCustomWalletModal(props: ComponentProps): JSX.Element {
  return (
    <SimpleModal
      className="vote-for-custom-wallet-modal"
      isShown={props.isShown}
      onClose={() => props?.onClose?.()}
    >
      <h2 className="font-700 text-px32 leading-px36 text-center">Enter address</h2>
      <div className="mt-8 flex flex-col gap-3">
        <div className="flex-1 focus-within:outline-dashed rounded-px10">
          <input
            className="leading-px48 rounded-px10 px-4 font-500 text-px20 outline-none sm:w-[400px]"
            type="text"
            placeholder="eth wallet address or ENS"
          />
        </div>
        <Button
          className="primary"
          onClick={() => {
            console.log('Vote for delegate')
          }}
        >
          Vote for delegate
        </Button>
      </div>
    </SimpleModal>
  )
}
