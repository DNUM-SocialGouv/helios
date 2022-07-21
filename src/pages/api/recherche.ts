import { NextApiRequest, NextApiResponse } from 'next'

import { rechercheEndpoint } from '../../backend/infrastructure/controllers/rechercheEndpoints'
import { dependencies } from '../../backend/infrastructure/dependencies'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { terme } = request.body
  const recherche = await rechercheEndpoint(dependencies, terme)
  response.status(200).json(recherche)
}
