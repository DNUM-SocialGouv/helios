export class EntitéJuridiqueNonTrouvée extends Error {
  constructor() {
    super('L’entité juridique n’a pas été trouvée')
  }
}
