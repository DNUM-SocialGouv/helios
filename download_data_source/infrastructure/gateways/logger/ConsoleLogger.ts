/* eslint-disable no-console */
import { Logger } from "../../../métier/gateways/Logger";

export class ConsoleLogger implements Logger {
  warn(message: string): void {
    console.warn(`[Helios] ${message}`);
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
