import * as Sentry from '@sentry/nextjs'

import { dependencies } from './src/data-crawler/infrastructure/dependencies'

const { environmentVariables } = dependencies

Sentry.init({
  dsn: environmentVariables.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
