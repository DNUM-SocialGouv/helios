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
}
