import { useEthers } from '@usedapp/core'
import { useEffect, useState } from 'react'

/**
 * `useResolveName` is a hook that is used to resolve an ENS name (e.g. `name.eth`) to a specific address.
 * @param name ENS name to be resolved
 * @returns {} Object with the following:
  - `address: string | null | undefined` - resolved address for the given ENS name or null if not found.
  - `isLoading: boolean` - indicates whether the lookup is in progress.
  - `error: Error | null` - error that occurred during the lookup or null if no error occurred.
 * @public
 */
export const useResolveNameFixed = (name: string | undefined) => {
  const { library } = useEthers()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [address, setAddress] = useState<string | null>()

  useEffect(() => {
    let mounted = true

    void (async () => {
      if (!library || !name) {
        setIsLoading(false)
        setAddress(null)
        setError(null)
        return
      }
      try {
        setIsLoading(true)
        const resolved = await library.resolveName(name)
        if (!mounted) return
        setAddress(resolved)
        setError(null)
      } catch (e: any) {
        if (!mounted) return
        setAddress(null)
        setError(e)
      } finally {
        setIsLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [library, name])

  return { address, isLoading, error }
}
