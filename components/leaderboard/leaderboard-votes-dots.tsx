import { Popover } from '@headlessui/react'
import SimplePopover from 'components/simple-popover'
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
    <SimplePopover>
      {element}
      <div>
        You have <span className="font-700">{myVotes}</span> Nounlet(s) voting for this delegate.
      </div>
    </SimplePopover>
  )
}
