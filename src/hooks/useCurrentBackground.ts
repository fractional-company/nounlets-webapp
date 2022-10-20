import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef } from 'react'
import { useNounStore } from 'src/store/noun.store'
import { useVaultStore } from 'src/store/vaultStore'
import useDisplayedNounlet from './useDisplayedNounlet'
import useNounBuyout from './useNounBuyout'

export default function useCurrentBackground() {
  const { wereAllNounletsAuctioned } = useNounStore()
  const router = useRouter()
  const { nounletBackground } = useDisplayedNounlet()
  const { nounBackground } = useNounBuyout()

  const currentBackground = useMemo(() => {
    if (!router.route.includes('/noun/')) {
      return 'rebeccapurple'
    }

    if (wereAllNounletsAuctioned) {
      if (router.route.includes('/noun/')) {
        return nounBackground
      }
    }

    return nounletBackground || 'transparent'
  }, [router, nounBackground, nounletBackground, wereAllNounletsAuctioned])

  return { currentBackground }
}
