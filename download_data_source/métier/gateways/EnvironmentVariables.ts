export interface EnvironmentVariables {
  readonly ORM_DEBUG: string;

  readonly DATABASE_URL: string;

  readonly SENTRY_AUTH_TOKEN: string;
  readonly SENTRY_DSN: string;
  readonly SENTRY_ENVIRONMENT: string;

  readonly SFTP_HOST: string;
  readonly SFTP_IS_DEBUG: string;
  readonly SFTP_KEX_ALGORITHMS: string;
  readonly SFTP_LOCAL_PATH: string;
  readonly SFTP_PORT: string;
  readonly SFTP_PRIVATE_KEY: string;
  readonly SFTP_USERNAME: string;

  readonly DIAMANT_ENCRYPTED_DATA_PATH: string;
  readonly DNUM_SFTP_HOST: string;
  readonly DNUM_SFTP_PORT: string;
  readonly DNUM_SFTP_PRIVATE_KEY: string;
  readonly DNUM_SFTP_USERNAME: string;

  readonly HAPI_DATA_PATH: string;
  readonly HAPI_SFTP_HOST: string;
  readonly HAPI_SFTP_PORT: string;
  readonly HAPI_SFTP_PASSWORD: string;
  readonly HAPI_SFTP_USERNAME: string;

  readonly VIGIE_RH_DATA_PATH: string;
}
