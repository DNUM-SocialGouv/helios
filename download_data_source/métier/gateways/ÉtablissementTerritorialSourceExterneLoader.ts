import { ÉtablissementTerritorialIdentité } from "../entities/ÉtablissementTerritorialIdentité";

export interface ÉtablissementTerritorialSourceExterneLoader {
  récupèreLesÉtablissementsTerritoriauxOuverts(numéroFinessDesEntitésJuridiques: string[]): ÉtablissementTerritorialIdentité[];
  récupèreLaDateDeMiseÀJourDuFichierSource(): string;
}
