import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env['SENTRY_DSN'],
  environment: process.env['SENTRY_ENV'] || process.env['NODE_ENV'],
  tracesSampleRate: 1.0,
})
