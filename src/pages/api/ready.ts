import { NextApiRequest, NextApiResponse } from 'next'

type Ready = Readonly<{
  status: string
}>

export default function ready(_request: NextApiRequest, response: NextApiResponse<Ready>) {
  throw new Error('[Helios] This API endpoint is not implemented yet.')

  response.status(200).json({ status: 'up' })
}
