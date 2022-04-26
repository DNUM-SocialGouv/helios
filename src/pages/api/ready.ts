import { NextApiRequest, NextApiResponse } from 'next'

type Ready = Readonly<{
  status: string
}>

export default function ready(_request: NextApiRequest, response: NextApiResponse<Ready>) {
  throw new Error('Helios - not ready')

  response.status(200).json({ status: 'up' })
}
