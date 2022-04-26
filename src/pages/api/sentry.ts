import { withSentry, captureException } from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { URL } from 'url'

export const config = { api: { externalResolver: true } }

async function sentry(request: NextApiRequest, response: NextApiResponse) {
  const knownSentry = process.env['SENTRY_DSN'] || ''
  const knownSentryURL = new URL(knownSentry)

  try {
    const body = request.body
    const pieces = body.split('\n')

    const header = JSON.parse(pieces[0])

    const targetURL = new URL(header.dsn)

    if (targetURL.host !== knownSentryURL.host) {
      throw new Error(`[Helios] invalid host: ${targetURL.host}`)
    }

    if (targetURL.pathname !== knownSentryURL.pathname) {
      throw new Error(`[Helios] invalid project id: ${targetURL.pathname}`)
    }

    const sentryURL = `https://${knownSentryURL.host}/api${knownSentryURL.pathname}/envelope/`
    const sentryResponse = await fetch(sentryURL, {
      body,
      method: 'POST',
    })
    return sentryResponse.json()
  } catch (error) {
    captureException(error)
    return response.status(400).json({ status: 'invalid request' })
  }
}

export default withSentry(sentry)
