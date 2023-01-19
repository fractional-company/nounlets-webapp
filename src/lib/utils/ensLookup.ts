import { useEthers, useLookupAddress, useResolveName } from '@usedapp/core'
import { useEffect, useState } from 'react'
import useLocalStorage from 'src/hooks/utils/useLocalStorage'

// This method check the cache if it has the ensName for the address, and that it was retrieved less than 24 hours ago.
// If it does, it returns the cached name. Otherwise, it calls useLookupAddress to get the name from the blockchain.
export const useReverseENSLookUp = (address: string, withStatus = true) => {
  const { library } = useEthers()
  const { localStorageData, setEnsNameCache } = useLocalStorage()
  const { name, timestamp } = localStorageData.ensNames[address] || {}
  const shouldRecheck = timestamp ? Date.now() - timestamp > 1000 * 60 * 60 * 24 : true
  const [ens, setEns] = useState<string | undefined>(name)
  const {
    ens: ensName,
    error: ensNameError,
    isLoading
  } = useLookupAddress(shouldRecheck ? address : undefined)

  useEffect(() => {
    let mounted = true
    if (address) {
      if (!ensName) {
        if (ensName === null) {
          setEnsNameCache(address, { name: undefined, timestamp: Date.now() })
        }
        return
      }
      if (mounted && ensName) {
        setEns(ensName)
        setEnsNameCache(address, { name: ensName, timestamp: Date.now() })
      } else {
        console.log(`error resolving reverse ens lookup: `, ensNameError?.message)
      }
    }
    return () => {
      setEns('')
      mounted = false
    }
  }, [address, ensName, ensNameError?.message, setEnsNameCache])

  if (isLoading) return withStatus ? 'Fetching name…' : null
  if (ensNameError) return withStatus ? 'Error fetching name' : null
  if (ensName) return ens

  return ens

  // useEffect(() => {
  //   let mounted = true;
  //   if (address && library) {
  //     library
  //       .lookupAddress(address)
  //       .then(name => {
  //         if (!name) return;
  //         if (mounted) {
  //           setEns(name);
  //         }
  //       })
  //       .catch(error => {
  //         console.log(`error resolving reverse ens lookup: `, error);
  //       });
  //   }
  //
  //   return () => {
  //     setEns('');
  //     mounted = false;
  //   };
  // }, [address, library]);
  //
  // return ens;
}
