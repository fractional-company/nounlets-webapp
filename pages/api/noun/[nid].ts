import { NEXT_PUBLIC_OPENSEA_KEY } from 'config'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
  description: string
  image: string
  external_link: string
  seller_fee_basis_points: number
  fee_recipient: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const options = { method: 'GET', headers: { 'X-API-KEY': NEXT_PUBLIC_OPENSEA_KEY || '' } }

  const data = await fetch(
    `https://api.opensea.io/api/v1/asset/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03/${req.query.nid}/?include_orders=false`,
    options
  ).then((response) => response.json())

  res.status(200).json({
    name: data.name,
    description: 'This noun is collectively owned by a 100-member DAO',
    image: data.image_url,
    external_link: 'https://nounlets.wtf',
    fee_recipient: '0x0dE5a9b90565616f619BAB027d577209438460AF',
    seller_fee_basis_points: 0
  })
}
