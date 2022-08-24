import { useEffect, useMemo, useRef } from 'react'
import useDisplayedNounlet from './useDisplayedNounlet'

export default function useCurrentBackground() {
  const previousBackground = useRef('#f4f5f6')
  const { nounletBackground } = useDisplayedNounlet()

  useEffect(() => {
    if (nounletBackground != null) {
      previousBackground.current = nounletBackground
    }
  }, [nounletBackground])

  const currentBackground = useMemo(() => {
    return nounletBackground || previousBackground.current
  }, [nounletBackground])

  return { previousBackground, currentBackground }
}
