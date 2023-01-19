import dayjs from 'dayjs'

const subscriptions = new Set<(seconds: number) => void>()
const interval = setInterval(() => {
  const time = dayjs().unix()
  subscriptions.forEach((sub) => {
    sub(time)
  })
}, 1000)

export default function subscribeTicker(fn: (seconds: number) => void) {
  if (typeof fn !== 'function') throw new Error('I need a function')
  subscriptions.add(fn)
  return () => {
    subscriptions.delete(fn)
  }
}
