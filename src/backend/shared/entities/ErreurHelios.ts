export class ErreurHelios extends Error {
  constructor(override readonly message: string) {
    super(message)

    this.message = `[Helios] ${message}`
  }
}
