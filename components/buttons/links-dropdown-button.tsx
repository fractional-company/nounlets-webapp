import { Menu, Transition } from '@headlessui/react'
import IconCaretDropdown from 'components/icons/icon-caret-dropdown'
import IconDiscord from 'components/icons/icon-discord'
import IconEtherscan from 'components/icons/icon-etherscan'
import IconFractionalLogo from 'components/icons/icon-fractional-logo'
import IconHeartHollow from 'components/icons/icon-heart-hollow'
import IconLink from 'components/icons/icon-link'
import IconMedium from 'components/icons/icon-medium'
import IconTwitter from 'components/icons/icon-twitter'
import { getCurrentChainExplorerAddressLink } from 'lib/utils/common'
import { Fragment } from 'react'
import Button from './button'

export default function LinksDropdownButton(): JSX.Element {
  return (
    <div className="">
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
          <Menu.Items className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-sm bg-white focus:outline-none overflow-hidden">
            <div className="divide-y divide-gray-1">
              <Menu.Item>
                <Button className="basic w-full space-x-2 !justify-start !rounded-none">
                  <a
                    href="https://medium.com/tessera-nft/nounlets-explained-faq-57e9bc537d93"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-full items-center justify-items-start grid grid-cols-[32px_auto]"
                  >
                    <IconMedium className="h-[16px] w-auto" />
                    <span>Nounlets Explained</span>
                  </a>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full space-x-2 !justify-start !rounded-none">
                  <a
                    href="https://nouns.wtf"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-full items-center justify-items-start grid grid-cols-[32px_auto]"
                  >
                    <IconHeartHollow className="h-[16px] w-auto" />
                    <span>Nouns.wtf</span>
                  </a>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full space-x-2 !justify-start !rounded-none">
                  <a
                    href="https://twitter.com/tessera"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-full items-center justify-items-start grid grid-cols-[32px_auto]"
                  >
                    <IconTwitter className="h-[16px] w-auto" />
                    <span>Twitter</span>
                  </a>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full space-x-2 !justify-start !rounded-none">
                  <a
                    href="https://discord.com/invite/8a34wmRjWB"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-full items-center justify-items-start grid grid-cols-[32px_auto]"
                  >
                    <IconDiscord className="h-[15px] w-auto" />
                    <span>Discord</span>
                  </a>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full space-x-2 !justify-start !rounded-none">
                  <a
                    href={getCurrentChainExplorerAddressLink(
                      process.env.NEXT_PUBLIC_NOUN_VAULT_ADDRESS!
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-full items-center justify-items-start grid grid-cols-[32px_auto]"
                  >
                    <IconEtherscan className="h-[16px] w-auto" />
                    <span>Etherscan</span>
                  </a>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full !justify-start !rounded-none">
                  <a
                    href="https://tessera.co/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-full items-center justify-items-start grid grid-cols-[32px_auto]"
                  >
                    <IconFractionalLogo className="h-[16px] w-auto text-black" />
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
