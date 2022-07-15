import IconCaretDropdown from 'components/icons/icon-caret-dropdown'
import IconLink from 'components/icons/icon-link'
import Button from './button'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import IconDiscord from 'components/icons/icon-discord'
import IconMedium from 'components/icons/icon-medium'
import IconHeartHollow from 'components/icons/icon-heart-hollow'
import IconTwitter from 'components/icons/icon-twitter'
import IconEtherscan from 'components/icons/icon-etherscan'
import IconFractionalLogo from 'components/icons/icon-fractional-logo'

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
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-sm bg-white focus:outline-none overflow-hidden">
            <div className="divide-y divide-gray-1">
              <Menu.Item>
                <Button className="basic w-full space-x-2 !justify-start !rounded-none">
                  <IconMedium className="h-[16px] w-auto" />
                  <span>What is it... (blog)</span>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full space-x-2 !justify-start !rounded-none">
                  <IconHeartHollow className="h-[16px] w-auto" />
                  <span>Nouns.wtf</span>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full space-x-2 !justify-start !rounded-none">
                  <IconTwitter className="h-[16px] w-auto" />
                  <span>Twitter</span>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full space-x-2 !justify-start !rounded-none">
                  <IconEtherscan className="h-[16px] w-auto" />
                  <span>Etherscan</span>
                </Button>
              </Menu.Item>
              <Menu.Item>
                <Button className="basic w-full space-x-2 !justify-start !rounded-none">
                  <IconFractionalLogo className="h-[16px] w-auto text-secondary-green" />
                  <span>Fractional.art</span>
                </Button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
