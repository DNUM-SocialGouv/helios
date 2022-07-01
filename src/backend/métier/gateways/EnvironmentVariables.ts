export interface EnvironmentVariables {
  readonly ORM_DEBUG: string

  readonly DATABASE_URL: string

  readonly SCALINGO_TOKEN: string

  readonly SENTRY_AUTH_TOKEN: string
  readonly SENTRY_DSN: string
}
