import { HeliosError } from '../../../infrastructure/HeliosError'

export class ÉtablissementTerritorialMédicoSocialActivitéNonTrouvée extends HeliosError {
  constructor(numéroFiness: string) {
    super(`L’activité de l’établissement territorial médico-social ${numéroFiness} n’a pas été trouvée`)
  }
}
