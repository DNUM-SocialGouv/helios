import { captureException } from '@sentry/nextjs'

export class HeliosError extends Error {
  constructor(override readonly message: string) {
    super(message)

    this.message = `[Helios] ${message}`
    captureException(this)
  }
}
