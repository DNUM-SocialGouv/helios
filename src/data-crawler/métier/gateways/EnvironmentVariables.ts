export interface EnvironmentVariables {
  readonly ORM_DEBUG: string

  readonly POSTGRES_DB: string
  readonly POSTGRES_PASSWORD: string
  readonly POSTGRES_PORT: string
  readonly POSTGRES_USER: string

  readonly SENTRY_AUTH_TOKEN: string
  readonly SENTRY_DSN: string

  readonly SFTP_HOST: string
  readonly SFTP_IS_DEBUG: string
  readonly SFTP_LOCAL_PATH: string
  readonly SFTP_PASSWORD: string
  readonly SFTP_PORT: string
  readonly SFTP_PRIVATE_KEY: string
  readonly SFTP_USERNAME: string
}
