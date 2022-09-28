import { FixedNumber } from 'ethers'
import { useMemo } from 'react'

type ComponentProps = {
  percentage: number
}

export default function SimpleProgressIndicator(props: ComponentProps): JSX.Element {
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
    <div className="simple-progress-indicator">
      <div className="h-3 relative overflow-hidden rounded-full bg-secondary-red/20">
        <div
          className="absolute top-0 left-0 h-3 bg-secondary-red rounded-full transition-all"
          style={style}
        ></div>
      </div>
    </div>
  )
}
