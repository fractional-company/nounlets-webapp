import dayjs from 'dayjs'
import { BigNumber, BigNumberish } from 'ethers'

import { useCallback, useEffect, useMemo, useState } from 'react'

type ComponentProps = {
  showEndTime?: boolean
  auctionEnd: BigNumberish
  onTimerFinished?: () => void
}

export default function CountdownTimer(props: ComponentProps): JSX.Element {
  const { showEndTime, auctionEnd } = props
  const [auctionTimer, setAuctionTimer] = useState(0)

  useEffect(() => {
    const timeLeft = Math.floor(BigNumber.from(auctionEnd).toNumber()) - dayjs().unix()
    setAuctionTimer(timeLeft)

    if (timeLeft <= 0) {
      setAuctionTimer(0)
      props.onTimerFinished?.()
      console.log('⏱ Timer ended!')
    } else {
      const timer = setTimeout(() => {
        setAuctionTimer((v) => v - 1)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [auctionEnd, auctionTimer])

  const formattedTime = useMemo(() => {
    console.log('auctione nd', auctionEnd)
    const endTime = dayjs.unix(BigNumber.from(auctionEnd).toNumber()).local()
    return endTime.format('h:mm:ss a')
  }, [auctionEnd])

  const countdownText = useMemo(() => {
    const timerDuration = dayjs.duration(auctionTimer, 's')
    const flooredHours = Math.floor(timerDuration.hours())
    const flooredMinutes = Math.floor(timerDuration.minutes())
    const flooredSeconds = Math.floor(timerDuration.seconds())

    return (
      <>
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
      <div className="flex items-center text-px32 leading-[38px] font-700 space-x-2">
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
