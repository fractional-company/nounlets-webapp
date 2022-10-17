import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { CSSProperties, Fragment } from 'react'
import Button from './buttons/button'
import IconClose from './icons/icon-close'

type ComponentProps = {
  children: JSX.Element | JSX.Element[]
  isShown?: boolean
  onClose?: () => void
  className?: string
  preventCloseOnBackdrop?: boolean
  style?: CSSProperties
}

const SimpleModalWrapper = function (props: ComponentProps): JSX.Element {
  return (
    <Transition show={props.isShown} as={Fragment}>
      <Dialog onClose={() => !props.preventCloseOnBackdrop && props?.onClose?.()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-x-0 top-0 h-screen overflow-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <Dialog.Panel
                // className={classNames(
                //   'relative bg-gray-1 rounded-px24 py-10 p-4 xs:px-10 w-full sm:w-auto max-w-screen-md',
                //   props.className
                // )}
                className={classNames(
                  'relative bg-gray-1 rounded-px24 p-8 w-full md:w-auto max-w-screen-md',
                  props.className
                )}
                style={props.style}
              >
                <Button
                  className="absolute top-4 right-4 p-2 rounded-full text-gray-4 hover:bg-gray-1"
                  onClick={() => props?.onClose?.()}
                >
                  <IconClose className="w-5 h-5" />
                </Button>
                {props.children}
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default SimpleModalWrapper
