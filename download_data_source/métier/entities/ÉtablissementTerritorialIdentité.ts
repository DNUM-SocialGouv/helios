import { DomaineÉtablissementTerritorial } from "./DomaineÉtablissementTerritorial";

export type ÉtablissementTerritorialIdentité = Readonly<{
  adresseAcheminement: string;
  adresseNuméroVoie: string;
  adresseTypeVoie: string;
  adresseVoie: string;
  catégorieÉtablissement: string;
  codeModeTarification: string;
  commune: string;
  courriel: string;
  département: string;
  domaine: DomaineÉtablissementTerritorial;
  libelléCatégorieÉtablissement: string;
  libelléCourtCatégorieÉtablissement: string;
  libelléModeTarification: string;
  numéroFinessEntitéJuridique: string;
  numéroFinessÉtablissementPrincipal: string;
  numéroFinessÉtablissementTerritorial: string;
  raisonSociale: string;
  raisonSocialeCourte: string;
  siret: string;
  téléphone: string;
  typeÉtablissement: string;
  codeRégion: string;
  dateOuverture: string;
}>;
