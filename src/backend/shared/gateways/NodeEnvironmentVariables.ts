import { EnvironmentVariables } from '../entities/EnvironmentVariables'

export class NodeEnvironmentVariables implements EnvironmentVariables {
  readonly SENTRY_DSN: string = this.getOrElse('SENTRY_DSN')

  private getOrElse(key: string, defaultValue: string = ''): string {
    if (process.env[key] === 'toBeSet') {
      console.error('----- WARNING -----', `La variable d’environnement '${key}' est manquante.`)
      return defaultValue
    }

    return process.env[key]!
  }
}
