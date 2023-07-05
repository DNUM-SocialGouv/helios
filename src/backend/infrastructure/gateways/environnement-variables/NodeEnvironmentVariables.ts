import { EnvironmentVariables } from "../../../métier/gateways/EnvironmentVariables";
import { Logger } from "../../../métier/gateways/Logger";

export class NodeEnvironmentVariables implements EnvironmentVariables {
  constructor(readonly logger: Logger) {}

  readonly DATABASE_URL: string = this.getOrElse("DATABASE_URL");

  readonly NEXTAUTH_URL: string = this.getOrElse("NEXTAUTH_URL");
  readonly NEXTAUTH_SECRET: string = this.getOrElse("NEXTAUTH_SECRET");

  readonly ORM_DEBUG: string = this.getOrElse("ORM_DEBUG");

  readonly SCALINGO_TOKEN: string = this.getOrElse("SCALINGO_TOKEN");

  readonly SENTRY_AUTH_TOKEN: string = this.getOrElse("SENTRY_AUTH_TOKEN");
  readonly SENTRY_DSN: string = this.getOrElse("SENTRY_DSN");
  readonly SENTRY_ENVIRONMENT: string = this.getOrElse("SENTRY_ENVIRONMENT");

  readonly TIME_OF_CACHE_PAGE: string = this.getOrElse("TIME_OF_CACHE_PAGE");
  readonly TIPIMAIL_SENDER_NAME: string = this.getOrElse("TIPIMAIL_SENDER_NAME");
  readonly TIPIMAIL_SENDER_ADDRESS: string = this.getOrElse("TIPIMAIL_SENDER_ADDRESS");
  readonly TIPIMAIL_APIUSER: string = this.getOrElse("TIPIMAIL_APIUSER");
  readonly TIPIMAIL_APIKEY: string = this.getOrElse("TIPIMAIL_APIKEY");
  readonly JWT_SECRET_KEY: string = this.getOrElse("JWT_SECRET_KEY");
  readonly APP_BASE_URL: string = this.getOrElse("APP_BASE_URL");

  private getOrElse(key: string): string {
    if (process.env[key] === "toBeSet") {
      this.logger.error(`----- WARNING ----- La variable d’environnement "${key}" est manquante.`);

      return "";
    }

    return process.env[key]!;
  }
}
