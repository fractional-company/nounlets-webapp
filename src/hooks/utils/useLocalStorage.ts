import { storeKeyNameFromField } from '@apollo/client/utilities'
import { IS_DEVELOP, NEXT_PUBLIC_CACHE_VERSION, NEXT_PUBLIC_NOUN_VAULT_ADDRESS } from 'config'
import { debounce } from 'lodash'
import { useCallback } from 'react'
import { mutate as globalMutate } from 'swr'
const cacheVersion = NEXT_PUBLIC_CACHE_VERSION
const cacheKey = `nounlets-cache-v2${IS_DEVELOP ? '/dev-0' : ''}/v${cacheVersion}/`

type localStageData = {
  images: { [key: string]: object }
  auctions: { [key: string]: object }
  ensNames: { [key: string]: { name?: string; timestamp?: number } }
}

let localStorageData: localStageData = {
  images: {},
  auctions: {},
  ensNames: {}
}

// Cache version -1 is an escape hatch to disable caching
if (cacheVersion !== -1) {
  if (typeof window !== 'undefined' && window.localStorage != null) {
    try {
      localStorageData = JSON.parse(
        localStorage.getItem(cacheKey) || '{"images": {}, "auctions": {}, "ensNames": {}}'
      )

      if (localStorageData['images'] == null) {
        localStorageData['images'] = {}
      }

      if (localStorageData['auctions'] == null) {
        localStorageData['auctions'] = {}
      }

      if (localStorageData['ensNames'] == null) {
        localStorageData['ensNames'] = {}
      }

      // Populate nounlet images
      Object.entries(localStorageData['images']).forEach(([key, data]) => {
        // console.log('got value!', key, data)
        globalMutate(key, data, false)
      })

      // Populate nounlet auctions
      Object.entries(localStorageData['auctions']).forEach(([key, data]) => {
        // console.log('got value!', key, data)
        globalMutate(key, data, false)
      })
    } catch (error) {
      console.error('localstorage error', error)
    }
  }
} else {
  console.log('skipping cache')
}

const debouncedLocalStorageWrite = debounce(() => {
  if (cacheVersion !== -1) {
    if (typeof window !== 'undefined' && window.localStorage != null) {
      // console.log('📋📋📋📋📋📋 Writingto local storage')
      try {
        const string = JSON.stringify(localStorageData)
        localStorage.setItem(cacheKey, string)
      } catch (error) {
        console.error('Error writing to storage', error)
      }
    }
  }
}, 1000)

export default function useLocalStorage() {
  const setImageCache = useCallback((key: string, data: object) => {
    if (cacheVersion !== -1) {
      if (typeof window !== 'undefined' && window.localStorage != null) {
        // console.log('📸📸📸 setting image data', key, data)
        localStorageData['images'][key] = data
        debouncedLocalStorageWrite()
      }
    }
  }, [])

  const setAuctionsCache = useCallback((key: string, data: object) => {
    if (cacheVersion !== -1) {
      if (typeof window !== 'undefined' && window.localStorage != null) {
        // console.log('🔫🔫🔫 setting auctions data', key, data)
        localStorageData['auctions'][key] = data
        debouncedLocalStorageWrite()
      }
    }
  }, [])

  const setEnsNameCache = useCallback(
    (key: string, data: { name?: string; timestamp?: number }) => {
      if (cacheVersion !== -1) {
        if (typeof window !== 'undefined' && window.localStorage != null) {
          // console.log('🔫🔫🔫 setting ens data', key, data)
          localStorageData['ensNames'][key] = data
          debouncedLocalStorageWrite()
        }
      }
    },
    []
  )

  return {
    localStorageData,
    setImageCache,
    setAuctionsCache,
    setEnsNameCache
  }
}
