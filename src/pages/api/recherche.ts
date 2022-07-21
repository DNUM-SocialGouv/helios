import { NextApiRequest, NextApiResponse } from 'next'

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from '../../backend/infrastructure/controllers/rechercheEndpoints'
import { dependencies } from '../../backend/infrastructure/dependencies'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { terme } = request.body
  const recherche = await rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies, terme)
  response.status(200).json(recherche)
}
