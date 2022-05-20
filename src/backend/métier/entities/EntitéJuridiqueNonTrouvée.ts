import { HeliosError } from '../../infrastructure/HeliosError'

export class EntitéJuridiqueNonTrouvée extends HeliosError {
  constructor(numéroFINESS: string) {
    super(`L’entité juridique ${numéroFINESS} n’a pas été trouvée`)
  }
}
