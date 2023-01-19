import Button from 'src/components/common/buttons/Button'
import SimpleModalWrapper from 'src/components/common/simple/SimpleModalWrapper'
import { NEXT_PUBLIC_MAX_NOUNLETS } from 'config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAppStore } from 'src/store/application.store'

type ComponentProps = {
  isShown: boolean
  onClose?: () => void
}

export default function ModalCongratulations(props: ComponentProps): JSX.Element {
  const router = useRouter()
  const { congratulationsModal, setCongratulationsModalForNounletId } = useAppStore()

  return (
    <SimpleModalWrapper
      className="congratulations-modal !max-w-[454px]"
      isShown={props.isShown}
      onClose={() => props?.onClose?.()}
    >
      <h2 className="font-londrina text-px24 leading-px30 text-gray-4">Congratulations</h2>

      <div className="mt-4 flex flex-col gap-8">
        <div className="flex flex-col gap-3 rounded-px16 bg-gray-4/10 p-4">
          <p className="text-center font-londrina text-px24 leading-px36 text-gray-4">
            You now own
          </p>
          <p className="text-center font-londrina text-px36 leading-px42">
            Nounlet {congratulationsModal.nounletId}/{NEXT_PUBLIC_MAX_NOUNLETS}
          </p>
          <p className="text-center text-px20 font-500 leading-px30 text-gray-4">
            You can change your vote to another delegate at any time.
          </p>
          {/* <Link href={`/noun/${congratulationsModal.nounId}/nounlet/${congratulationsModal.nounletId}`}> */}
          <Button
            className="primary"
            onClick={async () => {
              router.push(
                `/noun/${congratulationsModal.nounId}/nounlet/${congratulationsModal.nounletId}`
              )
              setCongratulationsModalForNounletId(false)
            }}
          >
            Show me the Nounlet!
          </Button>
          {/* </Link> */}
        </div>
      </div>
    </SimpleModalWrapper>
  )
}
