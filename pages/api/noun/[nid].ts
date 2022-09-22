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
  // console.log(req.query.nid)
  // res.status(200).json({
  //   name: 'Noun #' + req.query.nid,
  //   description: 'This noun is collectively owned by a 100-member DAO',
  //   image: 'https://openseauserdata.com/files/b6ef00f23d2d4b03ee4d594f1dc2e508.svg',
  //   external_link: 'https://dev-nounlets.tessera.co/',
  //   seller_fee_basis_points: 200,
  //   fee_recipient: '0x232E02988970e8aB920c83964cC7922d9C282DCA'
  // })
  // res.status(200).json({
  //   name: 'Noun #' + req.query.nid,
  //   description: 'This noun is collectively owned by a 100-member DAO',
  //   image: 'https://openseauserdata.com/files/54c8de06b17d6b29c130c0e8c2950d84.svg',
  //   external_link: 'https://nounlets.wtf',
  //   seller_fee_basis_points: 200,
  //   fee_recipient: '0xdead8d41881c82b9fc393d812239f41f3c943a37'
  // })
  res.status(200).json({
    name: 'Noun #315',
    description: 'This noun is collectively owned by a 100-member DAO',
    image: 'https://openseauserdata.com/files/19cb21fafb96d5c868edd4f7016e4619.svg',
    external_link: 'https://nounlets.wtf',
    seller_fee_basis_points: 200,
    fee_recipient: '0xE626d419Dd60BE8038C46381ad171A0b3d22ed25'
  })
}
