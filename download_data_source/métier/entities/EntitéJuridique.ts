export type EntitéJuridique = Readonly<{
  adresseAcheminement: string;
  adresseNuméroVoie: string;
  adresseTypeVoie: string;
  adresseVoie: string;
  commune: string;
  département: string;
  libelléStatutJuridique: string;
  numéroFinessEntitéJuridique: string;
  raisonSociale: string;
  raisonSocialeCourte: string;
  siren: string;
  téléphone: string;
  catégorisation?: string;
}>;
