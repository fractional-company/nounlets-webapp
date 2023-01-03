import classNames from 'classnames'
import dayjs from 'dayjs'
import { BigNumber, BigNumberish } from 'ethers'
import { debounce } from 'lodash'

import { useCallback, useEffect, useMemo, useState } from 'react'
import subscribeTicker from 'src/lib/utils/globalTicker'

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
  const [hasEnded, setHasEnded] = useState(false)

  useEffect(() => {
    if (hasEnded) {
      console.log('has ended')
      return
    }

    function onTick(seconds: number) {
      // console.log('ticking', seconds)
      const timeLeft = Math.max(
        0,
        Math.floor(BigNumber.from(auctionEnd).toNumber()) - dayjs().unix()
      )
      setAuctionTimer(timeLeft)
      if (timeLeft > 0) {
        onTimerTick?.()
      } else {
        console.log('ending')
        onTimerFinished?.()
        setHasEnded(true)
      }
    }

    console.log('subscribing')
    const unsubscribe = subscribeTicker(onTick)
    return () => {
      console.log('unsubing')
      unsubscribe()
    }
  }, [hasEnded, auctionEnd, setAuctionTimer, onTimerTick, onTimerFinished, setHasEnded])

  // useEffect(() => {
  //   const timeLeft = Math.floor(BigNumber.from(auctionEnd).toNumber()) - dayjs().unix()
  //   setAuctionTimer(timeLeft)

  //   if (timeLeft <= 0) {
  //     setAuctionTimer(0)
  //     onTimerFinished?.()
  //   } else {
  //     const timer = setTimeout(() => {
  //       setAuctionTimer((v) => v - 1)
  //       onTimerTick?.()
  //     }, 1000)

  //     return () => {
  //       clearTimeout(timer)
  //     }
  //   }
  // }, [auctionEnd, auctionTimer, onTimerFinished, onTimerTick])

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
          'flex items-center space-x-2 text-px32 font-700 leading-[38px]',
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
