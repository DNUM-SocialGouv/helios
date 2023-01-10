export interface ILogger {
  log(message: string): void
  error(message: string): void
  warn(message: string): void
  debug(message: string): void
}
