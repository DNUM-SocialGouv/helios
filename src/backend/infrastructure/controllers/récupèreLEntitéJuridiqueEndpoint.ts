import { NextApiRequest, NextApiResponse } from 'next'

export function récupèreLEntitéJuridiqueEndpoint() {
  return async (request: NextApiRequest, response: NextApiResponse) => {
    const { numéroFINESS } = request.query

    // instantier le user case (avec les dépendances ?
    // récupérer le retour du UC

    response.status(200).json(numéroFINESS)
  }
}
