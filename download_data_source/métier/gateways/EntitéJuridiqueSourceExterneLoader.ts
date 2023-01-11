import { EntitéJuridique } from "../entities/EntitéJuridique";

export interface EntitéJuridiqueSourceExterneLoader {
  récupèreLesEntitésJuridiquesOuvertes(): EntitéJuridique[];
  récupèreLaDateDeMiseÀJourDuFichierSource(): string;
}
