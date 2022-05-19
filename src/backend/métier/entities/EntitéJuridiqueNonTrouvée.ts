export class EntitéJuridiqueNonTrouvée extends Error {
  constructor(override readonly message: string) {
    super('L’entité n’a pas été trouvée')
  }
}
