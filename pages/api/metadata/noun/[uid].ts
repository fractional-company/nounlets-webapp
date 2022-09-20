// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
  description: string
  image: string
  external_link: string
  seller_fee_basis_points: number
  fee_recipient: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // console.log(req.query.uid)
  res.status(200).json({
    name: 'Noun #1',
    description: 'This noun is collectively owned by a 100-member DAO',
    image: 'https://openseauserdata.com/files/b6ef00f23d2d4b03ee4d594f1dc2e508.svg',
    external_link: 'https://dev-nounlets.tessera.co/',
    seller_fee_basis_points: 200,
    fee_recipient: '0x232E02988970e8aB920c83964cC7922d9C282DCA'
  })
}
