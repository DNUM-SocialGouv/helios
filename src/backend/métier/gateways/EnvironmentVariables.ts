export interface EnvironmentVariables {
  readonly DATABASE_URL: string;

  readonly NEXTAUTH_URL: string;
  readonly NEXTAUTH_SECRET: string;

  readonly ORM_DEBUG: string;

  readonly SCALINGO_TOKEN: string;

  readonly SENTRY_AUTH_TOKEN: string;
  readonly SENTRY_DSN: string;
  readonly SENTRY_ENVIRONMENT: string;

  readonly TIME_OF_CACHE_PAGE: string;

  readonly APP_BASE_URL: string;
  readonly TIPIMAIL_SENDER_NAME: string;
  readonly TIPIMAIL_SENDER_ADDRESS: string;
  readonly TIPIMAIL_APIUSER: string;
  readonly TIPIMAIL_APIKEY: string;
  readonly JWT_SECRET_KEY: string;
}
