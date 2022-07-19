import classNames from 'classnames'
import Button from 'components/buttons/button'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import IconCaret from './icons/icon-caret'

export default function SimpleAccordion(props: {
  children?: JSX.Element | string
  title: string
  isOpen: boolean
  onOpen?: () => void
  onClose?: () => void
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const [contentMaxHeight, setContentMaxHeight] = useState<string | number>(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const flag = !!props.isOpen

    if (flag !== isOpen) {
      setIsOpen(flag)
    }
  }, [props.isOpen, isOpen])

  useEffect(() => {
    calculateMaxHeight(isOpen, false)
  }, [isOpen])

  const calculateMaxHeight = (flag: boolean, isEnd: boolean) => {
    if (contentRef.current == null) return

    if (flag) {
      if (isEnd) {
        setContentMaxHeight('none')
      } else {
        const height = contentRef.current.getBoundingClientRect().height
        setContentMaxHeight(height)
      }
    } else {
      if (contentRef.current.parentElement!.style.maxHeight === 'none') {
        const height = contentRef.current.getBoundingClientRect().height
        contentRef.current.parentElement!.style.maxHeight = `${height}px`
        contentRef.current.getBoundingClientRect() // Trigger layout + paint
      }
      setContentMaxHeight(0)
    }
  }

  const handleOnClick = () => {
    if (isOpen) {
      props?.onClose?.()
    } else {
      props?.onOpen?.()
    }
  }

  return (
    <div className="simple-accordion">
      <Button
        onClick={handleOnClick}
        className="flex items-center justify-between h-12 font-londrina text-px36 leading-px36 lg:text-px48 lg:leading-px48 w-full text-black focus:text-secondary-green"
      >
        <span>{props.title}</span>
        <IconCaret className={classNames({ 'rotate-180': !isOpen })} />
      </Button>
      <div
        className="content overflow-hidden transition-all ease-in-out"
        onTransitionEnd={() => {
          calculateMaxHeight(isOpen, true)
        }}
        style={{ maxHeight: contentMaxHeight, opacity: isOpen ? 1.0 : 0.0 }}
      >
        <div ref={contentRef}>
          <div className="py-4">{props.children}</div>
        </div>
      </div>
    </div>
  )
}
