import classNames from 'classnames'
import { FixedNumber } from 'ethers'
import { useMemo } from 'react'

type ComponentProps = {
  percentage: number
  className?: string
  trackColorClassName?: string
}

export default function SimpleProgressIndicator(props: ComponentProps): JSX.Element {
  const { trackColorClassName = 'bg-secondary-red' } = props
  const style = useMemo(() => {
    try {
      const number = (Math.max(Math.min(props.percentage, 1.0), 0.0) * 100).toString()
      const rounded = FixedNumber.from(number).round(2).toString() + '%'
      return {
        width: rounded
      }
    } catch (error) {
      return {
        width: '0%'
      }
    }
  }, [props.percentage])

  return (
    <div className={classNames('simple-progress-indicator h-3', props.className)}>
      <div
        className={classNames(
          'relative h-full overflow-hidden rounded-full bg-opacity-20',
          trackColorClassName
        )}
      >
        <div
          className={classNames(
            'absolute top-0 left-0 h-full rounded-full transition-all',
            trackColorClassName
          )}
          style={style}
        ></div>
      </div>
    </div>
  )
}
