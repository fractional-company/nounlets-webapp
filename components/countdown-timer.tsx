import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import { BigNumber } from 'ethers'

import { useEffect, useMemo, useRef, useState } from 'react'

dayjs.extend(duration)
dayjs.extend(utc)

type ComponentProps = {
  showEndTime?: boolean
  auctionStart: BigNumber
  auctionEnd: BigNumber
}

export default function CountdownTimer(props: ComponentProps): JSX.Element {
  const { showEndTime, auctionStart, auctionEnd } = props
  const [auctionTimer, setAuctionTimer] = useState(0)

  useEffect(() => {
    const timeLeft = Math.floor(auctionEnd.toNumber()) - dayjs().unix()
    setAuctionTimer(timeLeft)

    if (timeLeft <= 0) {
      setAuctionTimer(0)
    } else {
      const timer = setTimeout(() => {
        setAuctionTimer((v) => v - 1)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [auctionStart, auctionEnd, auctionTimer])

  const formattedTime = useMemo(() => {
    const endTime = dayjs.unix(auctionEnd.toNumber()).local()
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
