import { EntitéJuridique } from "../entities/EntitéJuridique";

export interface EntitéJuridiqueSourceExterneLoader {
  récupèreLesEntitésJuridiquesOuvertes(): Promise<EntitéJuridique[]>;
  récupèreLaDateDeMiseÀJourDuFichierSource(): string;
}
