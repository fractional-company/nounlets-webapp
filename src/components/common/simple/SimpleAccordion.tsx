import classNames from 'classnames'
import Button from 'src/components/common/buttons/Button'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import IconCaret from '../icons/IconCaret'

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
        className="min-h-12 lg:text-px40 lg:leading-px40 flex w-full items-center justify-between space-x-2 text-left font-londrina text-px32 leading-px32 text-black focus:text-primary"
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
          <div className="pt-6">{props.children}</div>
        </div>
      </div>
    </div>
  )
}
