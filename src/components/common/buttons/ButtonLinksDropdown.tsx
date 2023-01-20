import { Menu, Transition } from '@headlessui/react'
import IconCaretDropdown from 'src/components/common/icons/IconCaretDropdown'
import IconDiscord from 'src/components/common/icons/IconDiscord'
import IconEtherscan from 'src/components/common/icons/IconEtherscan'
import IconFractionalLogo from 'src/components/common/icons/IconFractionalLogo'
import IconHeartHollow from 'src/components/common/icons/iconHeartHollow'
import IconLink from 'src/components/common/icons/IconLink'
import IconMedium from 'src/components/common/icons/IconMedium'
import IconTwitter from 'src/components/common/icons/IconTwitter'
import { getCurrentChainExplorerAddressLink } from 'src/lib/utils/common'
import { Fragment } from 'react'
import Button from './Button'
import Link from 'next/link'
import useSdk from 'src/hooks/utils/useSdk'
import IconNounlets from '../icons/IconNounlets'
import IconTesseraLogo from '../icons/IconTesseraLogo'

export default function ButtonLinksDropdown(props: { className?: string }): JSX.Element {
  const sdk = useSdk()
  return (
    <div className={props.className}>
      <Menu as="div" className="relative inline-block">
        <Menu.Button as={Fragment}>
          <Button className="basic space-x-2">
            <IconLink className="h-[15px] w-auto" />
            <IconCaretDropdown className="h-[7px] w-auto" />
          </Button>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="divide-gray-100 absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y overflow-hidden rounded-md bg-white shadow-sm focus:outline-none">
            <div className="divide-y divide-gray-1">
              <Menu.Item>
                {({ close }) => (
                  <Button className="basic w-full !justify-start space-x-2 !rounded-none">
                    <Link href="/tribute">
                      <div
                        className="grid h-full w-full grid-cols-[32px_auto] items-center justify-items-start"
                        onClick={close}
                      >
                        <IconNounlets className="h-[16px] w-auto" />
                        <span>Tributed Nouns</span>
                      </div>
                    </Link>
                  </Button>
                )}
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full !justify-start space-x-2 !rounded-none">
                  <a
                    href="https://nouns.wtf"
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-full w-full grid-cols-[32px_auto] items-center justify-items-start"
                  >
                    <IconHeartHollow className="h-[16px] w-auto" />
                    <span>Nouns.wtf</span>
                  </a>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full !justify-start space-x-2 !rounded-none">
                  <a
                    href="https://twitter.com/tessera"
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-full w-full grid-cols-[32px_auto] items-center justify-items-start"
                  >
                    <IconTwitter className="h-[16px] w-auto" />
                    <span>Twitter</span>
                  </a>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full !justify-start space-x-2 !rounded-none">
                  <a
                    href="https://discord.com/invite/8a34wmRjWB"
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-full w-full grid-cols-[32px_auto] items-center justify-items-start"
                  >
                    <IconDiscord className="h-[15px] w-auto" />
                    <span>Discord</span>
                  </a>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full !justify-start space-x-2 !rounded-none">
                  {sdk && (
                    <a
                      href={getCurrentChainExplorerAddressLink(sdk?.v2.NounletProtoform.address)}
                      target="_blank"
                      rel="noreferrer"
                      className="grid h-full w-full grid-cols-[32px_auto] items-center justify-items-start"
                    >
                      <IconEtherscan className="h-[16px] w-auto" />
                      <span>Etherscan</span>
                    </a>
                  )}
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full !justify-start !rounded-none">
                  <a
                    href="https://tessera.co/"
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-full w-full grid-cols-[32px_auto] items-center justify-items-start"
                  >
                    <IconTesseraLogo className="h-[16px] w-auto text-black" />
                    <span>Tessera</span>
                  </a>
                </Button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
