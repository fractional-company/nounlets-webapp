// import { useEthers } from '@usedapp/core';
import { useEnsName } from 'wagmi'
import { useEffect, useState } from 'react'

export const useReverseENSLookUp = (address: string, withStatus = true) => {
  //  const { library } = useEthers();
  const [ens, setEns] = useState<string>()
  const {
    data: ensName,
    error: ensNameError,
    isLoading,
    isError,
    refetch
  } = useEnsName({
    address: address,
    cacheTime: 86400000
  })

  useEffect(() => {
    let mounted = true
    if (address) {
      if (!ensName) {
        return
      }
      if (mounted && ensName) {
        setEns(ensName)
        console.log(`error resolving no == ${ensName}`)
      } else {
        console.log(`error resolving reverse ens lookup: `, ensNameError?.message)
      }
    }
    return () => {
      setEns('')
      mounted = false
    }
  }, [address, ensName, ensNameError?.message, refetch])

  if (isLoading) return withStatus ? 'Fetching name…' : null
  if (isError) return withStatus ? 'Error fetching name' : null
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

  //   return () => {
  //     setEns('');
  //     mounted = false;
  //   };
  // }, [address, library]);

  // return ens;
}
