import { withSentry, captureException } from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { URL } from 'url'

const sentryHost = 'sentry.fabrique.social.gouv.fr'
const knownProjectIds = ['74']

async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const envelope = request.body
    const pieces = envelope.split('\n')

    const header = JSON.parse(pieces[0])

    const targetURL = new URL(header.dsn)
    if (targetURL.host !== sentryHost) {
      throw new Error(`invalid host: ${targetURL.host}`)
    }

    const projectId = targetURL.pathname.replaceAll('/', '')
    if (!knownProjectIds.includes(projectId)) {
      throw new Error(`invalid project id: ${projectId}`)
    }

    const sentryURL = `https://${sentryHost}/api/${projectId}/envelope/`
    const sentryResponse = await fetch(sentryURL, {
      body: envelope,
      method: 'POST',
    })
    return sentryResponse.json()
  } catch (e) {
    captureException(e)
    return response.status(400).json({ status: 'invalid request' })
  }
}

export default withSentry(handler)
