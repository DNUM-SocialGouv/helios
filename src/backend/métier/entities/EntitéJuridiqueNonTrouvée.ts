export class EntitéJuridiqueNonTrouvée extends Error {
  constructor() {
    super('L’entité n’a pas été trouvée')
  }
}
