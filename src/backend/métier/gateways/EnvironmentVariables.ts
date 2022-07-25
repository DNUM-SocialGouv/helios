export interface EnvironmentVariables {
  readonly DATABASE_URL: string

  readonly ORM_DEBUG: string

  readonly SCALINGO_TOKEN: string

  readonly SENTRY_AUTH_TOKEN: string
  readonly SENTRY_DSN: string

  readonly TIME_OF_SERVER_SHUTDOWN_AT_NIGHT: string
}
