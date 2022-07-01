import { EnvironmentVariables } from '../../../métier/gateways/EnvironmentVariables'
import { Logger } from '../../../métier/gateways/Logger'

export class NodeEnvironmentVariables implements EnvironmentVariables {
  constructor(readonly logger: Logger) {}

  readonly ORM_DEBUG: string = this.getOrElse('ORM_DEBUG')

  readonly DATABASE_URL: string = this.getOrElse('DATABASE_URL')

  readonly SCALINGO_TOKEN: string = this.getOrElse('SCALINGO_TOKEN')

  readonly SENTRY_AUTH_TOKEN: string = this.getOrElse('SENTRY_AUTH_TOKEN')
  readonly SENTRY_DSN: string = this.getOrElse('SENTRY_DSN')

  private getOrElse(key: string): string {
    if (process.env[key] === 'toBeSet') {
      this.logger.error(`----- WARNING ----- La variable d’environnement "${key}" est manquante.`)

      return ''
    }

    return process.env[key]!
  }
}
