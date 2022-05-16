import * as Sentry from '@sentry/nextjs'

import { dependencies } from './src/data-crawler/infrastructure/dependencies'

(async () => {
  const { environmentVariables } = await dependencies

  Sentry.init({
    dsn: environmentVariables.SENTRY_DSN,
    tracesSampleRate: 1.0,
  })
})()
