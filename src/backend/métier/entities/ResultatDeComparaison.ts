export type ResultatEJ = Readonly<{
  commune: string;
  département: string;
  numéroFiness: string;
  raisonSocialeCourte: string;
  type: string;
}>;

export type ResultatSMS = Readonly<{
  numéroFiness: string;
  socialReason: string;
  commune: string;
  departement: string;
  type: string;
  capacite: number | null | string;
  realisationActivite: number | null | string;
  acceuilDeJour: number | null | string;
  hebergementPermanent: number | null | string;
  hebergementTemporaire: number | null | string;
  fileActivePersonnesAccompagnes: number | null | string;
  rotationPersonnel: number | null | string;
  absenteisme: number | null | string;
  prestationExterne: number | null | string;
  etpVacant: number | null | string;
  tauxCaf: number | null | string;
  vetusteConstruction: number | null | string;
  roulementNetGlobal: number | null | string;
  resultatNetComptable: number | null | string;
}>;

export type ResultatES = Readonly<{
  commune: string;
  département: string;
  numéroFiness: string;
  raisonSocialeCourte: string;
  type: string;
}>;

export type MoyenneEJ = Readonly<{}>;
export type MoyenneSMS = Readonly<{
  capaciteMoyenne: number | null;
  realisationAcitiviteMoyenne: number | null;
  acceuilDeJourMoyenne: number | null;
  hebergementPermanentMoyenne: number | null;
  hebergementTemporaireMoyenne: number | null;
  fileActivePersonnesAccompagnesMoyenne: number | null;
  rotationPersonnelMoyenne: number | null;
  absenteismeMoyenne: number | null;
  prestationExterneMoyenne: number | null;
  etpVacantMoyenne: number | null;
  tauxCafMoyenne: number | null;
  vetusteConstructionMoyenne: number | null;
  roulementNetGlobalMoyenne: number | null;
  resultatNetComptableMoyenne: number | null;
}>;
export type MoyenneES = Readonly<{}>;

export type ResultatDeComparaison = {
  nombreDeResultats: number;
  resultat: ResultatEJ[] | ResultatSMS[] | ResultatES[];
  moyennes: MoyenneEJ | MoyenneSMS | MoyenneES;
};

export type DatesMisAjourSources = {
  date_mis_a_jour_finess: string;
  date_mis_a_jour_tdbPerf: string;
  date_mis_a_jour_cnsa: string;
};
