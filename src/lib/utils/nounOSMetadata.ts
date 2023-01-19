import { NEXT_PUBLIC_OPENSEA_KEY } from 'config'

const _inMemoryCache: Record<string, { name: string; image_url: string }> = {}

export default async function getNounMetadata(nounId: string) {
  if (_inMemoryCache[nounId] == null) {
    // console.log('fetching metadata for', nounId)
    const options = { method: 'GET', headers: { 'X-API-KEY': NEXT_PUBLIC_OPENSEA_KEY || '' } }

    const data = await fetch(
      `https://api.opensea.io/api/v1/asset/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03/${nounId}/?include_orders=false`,
      options
    ).then((response) => response.json())

    _inMemoryCache[nounId] = {
      name: data.name,
      image_url: data.image_url
    }
  } else {
    // console.log('metadata in cache for', nounId)
  }

  return _inMemoryCache[nounId]
}
