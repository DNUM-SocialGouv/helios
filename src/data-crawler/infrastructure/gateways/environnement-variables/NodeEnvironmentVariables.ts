import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Logger } from '../../../métier/gateways/Logger'

export class NodeEnvironmentVariables implements EnvironmentVariables {
  constructor(readonly logger: Logger) {}

  readonly ORM_DEBUG: string = this.getOrElse('ORM_DEBUG')

  readonly DATABASE_URL: string = this.getOrElse('DATABASE_URL')

  readonly SENTRY_AUTH_TOKEN: string = this.getOrElse('SENTRY_AUTH_TOKEN')
  readonly SENTRY_DSN: string = this.getOrElse('SENTRY_DSN')

  readonly SFTP_HOST: string = this.getOrElse('SFTP_HOST')
  readonly SFTP_IS_DEBUG: string = this.getOrElse('SFTP_IS_DEBUG')
  readonly SFTP_KEX_ALGORITHMS: string = this.getOrElse('SFTP_KEX_ALGORITHMS')
  readonly SFTP_LOCAL_PATH: string = this.getOrElse('SFTP_LOCAL_PATH')
  readonly SFTP_PASSWORD: string = this.getOrElse('SFTP_PASSWORD')
  readonly SFTP_PORT: string = this.getOrElse('SFTP_PORT')
  readonly SFTP_PRIVATE_KEY: string = this.getOrElse('SFTP_PRIVATE_KEY')
  readonly SFTP_USERNAME: string = this.getOrElse('SFTP_USERNAME')

  private getOrElse(key: string): string {
    if (process.env[key] === 'toBeSet') {
      this.logger.error(`----- WARNING ----- La variable d’environnement "${key}" est manquante.`)

      return ''
    }

    return process.env[key]!
  }
}
