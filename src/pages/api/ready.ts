import { NextApiRequest, NextApiResponse } from 'next'

type Ready = Readonly<{
  status: string
}>

export default function ready(_request: NextApiRequest, response: NextApiResponse<Ready>) {
  response.status(200).json({ status: 'up' })
}
