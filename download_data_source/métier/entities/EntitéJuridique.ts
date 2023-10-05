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
  catégorisation?: Catégorisation;
  statutJuridique: string;
  codeRégion: string;
}>;

export enum Catégorisation {
  PUBLIC = "public",
  PRIVE_NON_LUCRATIF = "prive_non_lucratif",
  PRIVE_LUCRATIF = "prive_lucratif",
  PERSONNE_MORALE_DROIT_ETRANGER = "personne_morale_droit_etranger",
}
