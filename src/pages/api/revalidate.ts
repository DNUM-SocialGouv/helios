import { NextApiRequest, NextApiResponse } from 'next'

import { Paths } from '../../frontend/configuration/Paths'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const paths = new Paths()

  if (request.query['secret'] !== process.env['SCALINGO_TOKEN']) {
    return response.status(401).json({ message: '[Helios] Token incorrect pour invalider les pages.' })
  }

  if (!request.query['numero-finess'] || !request.query['type']) {
    return response.status(401).json({ message: '[Helios] Il faut donner un numéro de FINESS et un type : "ej" ou "san" ou "ms".' })
  }

  try {
    if (request.query['type'] === 'ej') {
      await response.revalidate(paths.ENTITÉ_JURIDIQUE + '/' + request.query['numero-finess'])
      return response.json({ revalidated: true })
    } else if (request.query['type'] === 'san') {
      await response.revalidate(paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + '/' + request.query['numero-finess'])
      return response.json({ revalidated: true })
    } else if (request.query['type'] === 'ms') {
      await response.revalidate(paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL + '/' + request.query['numero-finess'])
      return response.json({ revalidated: true })
    }
  } catch (err) {
    return response.status(400).send('[Helios] L’invalidation de la page ne s’est pas déroulée correctement.')
  }
}
