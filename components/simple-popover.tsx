import { Popover, Portal } from '@headlessui/react'
import classNames from 'classnames'
import { useState } from 'react'
import { usePopper } from 'react-popper'

type PopoverProps = {
  isDisabled?: boolean,
  children?: JSX.Element[],
  className?: string
}

export default function SimplePopover({children, isDisabled = false, className}: PopoverProps): JSX.Element {
  const [isShowing, setIsShowing] = useState(false)
  let [referenceElement, setReferenceElement] = useState<any>()
  let [popperElement, setPopperElement] = useState<any>()
  let { styles, attributes } = usePopper(referenceElement, popperElement)

  return (
    <div className={classNames('simple-popover flex', className)}>
      <Popover className="relative inline-flex items-center">
        <Popover.Button
          as="div"
          ref={setReferenceElement}
          onMouseEnter={() => setIsShowing(true)}
          onMouseLeave={() => setIsShowing(false)}
          className="cursor-pointer"
        >
          {children?.[0]}
        </Popover.Button>

        {isShowing && !isDisabled && (
          <Portal>
            <Popover.Panel
              static
              ref={setPopperElement}
              style={{ ...styles.popper, zIndex: 200 }}
              {...attributes.popper}
            >
              <div className="p-3 bg-black border-black shadow-md rounded-px10 text-white font-500 text-px14 leading-px18 border-2 w-[200px]">
                {children?.[1]}
              </div>
            </Popover.Panel>
          </Portal>
        )}
      </Popover>
    </div>
  )
}
