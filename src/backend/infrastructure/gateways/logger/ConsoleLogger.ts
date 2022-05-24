/* eslint-disable no-console */
import { Logger } from '../../../métier/gateways/Logger'

export class ConsoleLogger implements Logger {
  debug(message: string): void {
    console.debug(message)
  }

  error(message: string): void {
    console.error(message)
  }

  info(message: string): void {
    console.info(message)
  }
}
