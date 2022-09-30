import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef } from 'react'
import { useVaultStore } from 'store/vaultStore'
import useDisplayedNounlet from './useDisplayedNounlet'
import useNounBuyout from './useNounBuyout'

export default function useCurrentBackground() {
  const { wereAllNounletsAuctioned } = useVaultStore()
  const router = useRouter()
  const previousBackground = useRef('#f4f5f6')
  const { nounletBackground } = useDisplayedNounlet()
  const { nounBackground } = useNounBuyout()

  useEffect(() => {
    if (nounletBackground != null) {
      previousBackground.current = nounletBackground
    }
  }, [nounletBackground])

  const currentBackground = useMemo(() => {
    if (!router.isReady) return 'transparent'
    if (wereAllNounletsAuctioned) {
      if (router.route === '/' || router.route === '/governance') {
        return nounBackground
      }
    }
    return nounletBackground || previousBackground.current
  }, [router, nounBackground, nounletBackground, wereAllNounletsAuctioned])

  return { previousBackground, currentBackground }
}
