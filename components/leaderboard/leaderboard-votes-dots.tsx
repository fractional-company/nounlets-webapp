import { Popover } from '@headlessui/react'
import { useState } from 'react'
import { usePopper } from 'react-popper'

export default function LeaderboardVotesDots(props: any): JSX.Element {
  const [isShowing, setIsShowing] = useState(false)
  let [referenceElement, setReferenceElement] = useState<any>()
  let [popperElement, setPopperElement] = useState<any>()
  let { styles, attributes } = usePopper(referenceElement, popperElement)

  const dots: JSX.Element[] = []
  const myVotes = props.votes || 0
  if (myVotes === 0) {
    return <div></div>
  }

  let element = null
  if (myVotes > 6) {
    element = (
      <div key={-1} className="flex items-center mr-2">
        <p className="mr-1 font-700 text-px18 text-secondary-blue">{myVotes}</p>
        <div className="w-2 h-2 rounded-full bg-secondary-blue"></div>
      </div>
    )
  } else {
    for (let i = 0; i < myVotes; i++) {
      dots.push(<div key={i} className="w-2 h-2 rounded-full bg-secondary-blue"></div>)
    }
    element = <div className="grid grid-cols-3 gap-0.5 mr-2">{dots}</div>
  }

  return (
    <Popover className="relative inline-flex items-center">
      <Popover.Button
        as="div"
        ref={setReferenceElement}
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
        className="cursor-pointer"
      >
        {element}
      </Popover.Button>

      {isShowing && (
        <Popover.Panel
          static
          ref={setPopperElement}
          style={{ ...styles.popper, zIndex: 200 }}
          {...attributes.popper}
        >
          <div className="p-3 bg-white shadow-md rounded-px10 text-gray-4 font-500 text-px14 leading-px18 border-2">
            You have <span className="font-700">{myVotes}</span> Nounlets voting for this delegate.
          </div>
        </Popover.Panel>
      )}
    </Popover>
  )
}
