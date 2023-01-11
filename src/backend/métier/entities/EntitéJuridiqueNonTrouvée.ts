import { HeliosError } from "../../infrastructure/HeliosError";

export class EntitéJuridiqueNonTrouvée extends HeliosError {
  constructor(numéroFiness: string) {
    super(`L’entité juridique ${numéroFiness} n’a pas été trouvée`);
  }
}
