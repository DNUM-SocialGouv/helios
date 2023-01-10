import { Injectable } from '@nestjs/common'
import { ILogger } from 'src/domain/logger/ILogger'

@Injectable()
export class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(message)
  }

  error(message: string): void {
    console.error(message)
  }

  warn(message: string): void {
    console.warn(message)
  }

  debug(message: string): void {
    console.debug(message)
  }
}
