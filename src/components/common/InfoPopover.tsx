import { Popover } from '@headlessui/react';
import { useState } from 'react';
import { usePopper } from 'react-popper';
import IconQuestionCircle from './icons/IconQuestionCircle';

export default function InfoPopover(): JSX.Element {
  const [isShowing, setIsShowing] = useState(false);

  let [referenceElement, setReferenceElement] = useState<any>();
  let [popperElement, setPopperElement] = useState<any>();
  let { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <Popover className="relative inline-flex items-center">
      <Popover.Button
        as="p"
        ref={setReferenceElement}
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
      >
        <IconQuestionCircle className="h-4 w-4 text-gray-3 cursor-pointer" />
      </Popover.Button>

      {isShowing && (
        <Popover.Panel static ref={setPopperElement} style={styles.popper} {...attributes.popper}>
          <div className="p-4 bg-white shadow-md rounded-px10 w-[200px]">
            This is the current delegate for this mini noun! Respect!
          </div>
        </Popover.Panel>
      )}
    </Popover>
  );
}
