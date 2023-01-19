import classNames from 'classnames'
import IconClose from '../icons/IconClose'

type ComponentProps = {
  children: JSX.Element | JSX.Element[]
  className?: string
  isXed?: boolean
}

export default function SimpleXImage(props: ComponentProps): JSX.Element {
  return (
    <div
      className={classNames(
        'simple-x-image relative z-0 w-10 h-10 border-[3px] rounded-px8 overflow-hidden',
        props.className,
        props.isXed ? 'border-secondary-red' : 'border-white'
      )}
    >
      {props.isXed && (
        <div className="absolute z-10 inset-0 flex items-center justify-center">
          <p className="font-londrina text-px26 font-900 text-secondary-red">X</p>
        </div>
      )}
      <div className={props.isXed ? 'grayscale' : ''}>{props.children}</div>
    </div>
  )
}
