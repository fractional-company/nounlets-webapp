import { CHAIN_ID } from '../../config'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const networkName = () => {
  switch (Number(CHAIN_ID)) {
    case 1:
      return 'Ethereum Mainnet'
    case 4:
      return 'the Rinkeby network'
    default:
      return `Network ${CHAIN_ID}`
  }
}

const metamaskNetworkName = () => {
  switch (Number(CHAIN_ID)) {
    case 1:
      return 'Ethereum Mainnet'
    case 4:
      return 'Rinkeby Test Network'
    case 5:
      return 'Goerli Test Network'
    default:
      return `Network ${CHAIN_ID}`
  }
}

const NetworkAlert = () => {
  return (
    <Transition show={true} as={Fragment}>
      <Dialog onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
          <div className="fixed inset-0 flex items-center justify-center">
            <Dialog.Panel className="bg-white rounded-px16 max-w-screen-md p-8">
              <Dialog.Title className="text-px24 font-londrina">
                🚧 Wrong Network Detected 🚧
              </Dialog.Title>
              <div className="">
                <Dialog.Description className="py-6 text-gray-4 text-px20">
                  Nounlets auctions require you to switch over {networkName()} to be able to
                  participate.
                </Dialog.Description>
                <Dialog.Description>
                  <b>
                    To get started, please switch your network by following the instructions below:
                  </b>
                </Dialog.Description>
                <ol className="list-decimal mt-4 ml-5">
                  <li>Open Metamask</li>
                  <li>Click the network select dropdown</li>
                  <li>Click on &quot;{metamaskNetworkName()}&quot;</li>
                </ol>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
export default NetworkAlert
