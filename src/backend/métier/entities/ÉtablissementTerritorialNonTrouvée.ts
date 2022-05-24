import { HeliosError } from '../../infrastructure/HeliosError'

export class ÉtablissementTerritorialNonTrouvée extends HeliosError {
  constructor(numéroFiness: string) {
    super(`L’établissement territorial ${numéroFiness} n’a pas été trouvé`)
  }
}
