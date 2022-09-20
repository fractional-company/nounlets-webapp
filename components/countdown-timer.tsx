import dayjs from 'dayjs'
import { BigNumber, BigNumberish } from 'ethers'
import { debounce } from 'lodash'

import { useCallback, useEffect, useMemo, useState } from 'react'

type ComponentProps = {
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
      // console.log('⏱ Timer ended!')
      setAuctionTimer(0)
      onTimerFinished?.()
    } else {
      const timer = setTimeout(() => {
        // console.log(auctionTimer)
        // Handled in the useNounletAuctionInfo refresh interval
        // More than an hour left
        // if (auctionTimer >= 3600) {
        //   if (auctionTimer % 3600 === 0) {
        //     // Every hour
        //     onTimerTick?.()
        //   }
        //   // More than 10 minutes left
        // } else if (auctionTimer >= 600) {
        //   if (auctionTimer % 600 === 0) {
        //     // Every 10 min
        //     onTimerTick?.()
        //   }
        //   // More than 1 minute left
        // } else if (auctionTimer >= 60) {
        //   if (auctionTimer % 60 === 0) {
        //     // Every minute
        //     onTimerTick?.()
        //   }
        // } else if (auctionTimer >= 20) {
        //   if (auctionTimer % 20 === 0) {
        //     // Every 20 seconds
        //     onTimerTick?.()
        //   }
        // }
        setAuctionTimer((v) => v - 1)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [auctionEnd, auctionTimer, onTimerFinished, onTimerTick])

  const formattedTime = useMemo(() => {
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
