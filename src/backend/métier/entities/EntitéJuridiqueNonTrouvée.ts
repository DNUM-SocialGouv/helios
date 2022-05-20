export class EntitéJuridiqueNonTrouvée extends Error {
  constructor(numéroFINESS: string) {
    super(`L’entité juridique ${numéroFINESS} n’a pas été trouvée`)
  }
}
