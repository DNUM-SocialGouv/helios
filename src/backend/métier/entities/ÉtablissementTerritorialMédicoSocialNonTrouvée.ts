import { HeliosError } from '../../infrastructure/HeliosError'

export class ÉtablissementTerritorialMédicoSocialNonTrouvée extends HeliosError {
  constructor(numéroFiness: string) {
    super(`L’établissement territorial médico-social ${numéroFiness} n’a pas été trouvé`)
  }
}
