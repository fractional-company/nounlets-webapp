import { storeKeyNameFromField } from '@apollo/client/utilities'
import { NEXT_PUBLIC_CACHE_VERSION, NEXT_PUBLIC_NOUN_VAULT_ADDRESS } from 'config'
import { debounce } from 'lodash'
import { useCallback } from 'react'
import { mutate as globalMutate } from 'swr'
const cacheVersion = NEXT_PUBLIC_CACHE_VERSION
const cacheKey = `nounlets-cache/v${cacheVersion}/${NEXT_PUBLIC_NOUN_VAULT_ADDRESS}`

let localStorageData: { images: { [key: string]: object }; auctions: { [key: string]: object } } = {
  images: {},
  auctions: {}
}

// Cache version -1 is an escape hatch to disable caching
if (cacheVersion !== -1) {
  if (typeof window !== 'undefined' && window.localStorage != null) {
    try {
      localStorageData = JSON.parse(
        localStorage.getItem(cacheKey) || '{"images": {}, "auctions": {}}'
      )

      if (localStorageData['images'] == null) {
        localStorageData['images'] = {}
      }

      if (localStorageData['auctions'] == null) {
        localStorageData['auctions'] = {}
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
  const setNounletImageCache = useCallback((key: string, data: object) => {
    if (cacheVersion !== -1) {
      if (typeof window !== 'undefined' && window.localStorage != null) {
        // console.log('📸📸📸 setting image data', key, data)
        localStorageData['images'][key] = data
        debouncedLocalStorageWrite()
      }
    }
  }, [])

  const setNounletAuctionsCache = useCallback((key: string, data: object) => {
    if (cacheVersion > 3) {
      if (typeof window !== 'undefined' && window.localStorage != null) {
        // console.log('🔫🔫🔫 setting auctions data', key, data)
        localStorageData['auctions'][key] = data
        debouncedLocalStorageWrite()
      }
    }
  }, [])

  return {
    setNounletImageCache,
    setNounletAuctionsCache
  }
}
