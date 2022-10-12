import classNames from 'classnames'
import dayjs from 'dayjs'
import { BigNumber, BigNumberish } from 'ethers'
import { debounce } from 'lodash'

import { useCallback, useEffect, useMemo, useState } from 'react'

type ComponentProps = {
  className?: string
  showEndTime?: boolean
  auctionEnd: BigNumberish
  onTimerFinished?: () => void
  onTimerTick?: () => void
}

export default function CountdownTimer(props: ComponentProps): JSX.Element {
  const { showEndTime, auctionEnd, onTimerFinished, onTimerTick } = props
  const [auctionTimer, setAuctionTimer] = useState(0)

  useEffect(() => {
    const timeLeft = Math.floor(BigNumber.from(auctionEnd).toNumber()) - dayjs().unix()
    setAuctionTimer(timeLeft)

    if (timeLeft <= 0) {
      setAuctionTimer(0)
      onTimerFinished?.()
    } else {
      const timer = setTimeout(() => {
        setAuctionTimer((v) => v - 1)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [auctionEnd, auctionTimer, onTimerFinished, onTimerTick])

  const formattedTime = useMemo(() => {
    const endTime = dayjs.unix(BigNumber.from(auctionEnd).toNumber()).local()
    return endTime.format('MMM D, h:mm:ss a')
  }, [auctionEnd])

  const countdownText = useMemo(() => {
    const timerDuration = dayjs.duration(auctionTimer, 's')
    const flooredDays = Math.floor(timerDuration.days())
    const flooredHours = Math.floor(timerDuration.hours())
    const flooredMinutes = Math.floor(timerDuration.minutes())
    const flooredSeconds = Math.floor(timerDuration.seconds())

    return (
      <>
        {flooredDays > 0 && (
          <p>
            <span>{flooredDays}</span>
            <span>d</span>
          </p>
        )}
        <p>
          <span>{flooredHours}</span>
          <span>h</span>
        </p>
        <p>
          <span>{flooredMinutes}</span>
          <span>m</span>
        </p>
        <p>
          <span>{flooredSeconds}</span>
          <span>s</span>
        </p>
      </>
    )
  }, [auctionTimer])

  return (
    <div className="countdown-timer">
      <div
        className={classNames(
          'flex items-center text-px32 leading-[38px] font-700 space-x-2',
          props.className
        )}
      >
        {showEndTime ? (
          <p>
            <span>{formattedTime}</span>
          </p>
        ) : (
          countdownText
        )}
      </div>
    </div>
  )
}
