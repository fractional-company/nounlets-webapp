import { useEffect, useState } from 'react'
import useSdk from '../../hooks/utils/useSdk'

export function useReverseRecords(addresses: string[] | undefined) {
  const sdk = useSdk()
  const [ensNames, setENSNames] = useState<string[] | null>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    void (async () => {
      if (!addresses || addresses.length === 0 || !sdk) return
      try {
        setIsLoading(true)
        const resolved = await sdk.ReverseRecords.getNames(addresses)
        if (!mounted) return
        setENSNames(resolved)
      } catch (e: any) {
        if (!mounted) return
        setError(e)
      } finally {
        setIsLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [addresses, sdk])

  return { ensNames, isLoading, error }
}
