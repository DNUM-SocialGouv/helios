import { HeliosError } from "../../infrastructure/HeliosError";

export class ÉtablissementTerritorialSanitaireNonTrouvée extends HeliosError {
  constructor(numéroFiness: string) {
    super(`L’établissement territorial sanitaire ${numéroFiness} n’a pas été trouvé`);
  }
}
