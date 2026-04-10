/* eslint-disable no-console */
import { Logger } from "../../../métier/gateways/Logger";

export class ConsoleLogger implements Logger {
  audit(message: string): void {
    console.info(`[Helios] [Audit] ${message}`);
  }

  debug(message: string): void {
    console.debug(`[Helios] ${message}`);
  }

  error(message: string): void {
    console.error(`[Helios] ${message}`);
  }

  info(message: string): void {
    console.info(`[Helios] ${message}`);
  }
}
