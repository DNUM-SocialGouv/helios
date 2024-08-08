import { DomaineÉtablissementTerritorial } from "../DomaineÉtablissementTerritorial";

export type ÉtablissementTerritorialRattaché = Readonly<{
  domaine: DomaineÉtablissementTerritorial;
  numéroFiness: string;
  raisonSocialeCourte: string;
  libelléCatégorieÉtablissement: string;
}>;
