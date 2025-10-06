export type PyramideAges = Readonly<{
  annee: number;
  trancheLibelle: string;
  effectifHomme: number;
  effectifFemme: number;
  effectifHommeRef: number;
  effectifFemmeRef: number;
}>;

export type ProfessionFiliereRow = Readonly<{
  annee: number;
  mois: number;
  effectifFiliere: number;
}>;

export type ProfessionFiliereData = Readonly<{
  categorie: string;
  dataCategorie: ProfessionFiliereRow[];
}>;

export type ProfessionFiliere = Readonly<{
  dateDeMiseAJour: string;
  data: ProfessionFiliereData[];
}>;

export type DepartEmbauche = Readonly<{
  annee: number;
  depart: number;
  departRef: number;
  embauche: number;
  embaucheRef: number;
}>;

export type DepartEmbaucheTrimestriel = Readonly<{
  annee: number;
  trimestre: number;
  depart: number;
  departRef: number;
  embauche: number;
  embaucheRef: number;
}>;

export type TauxRotation = Readonly<{
  annee: number;
  rotation: number;
  rotationRef: number;
}>;

export type TauxRotationTrimestriel = Readonly<{
  annee: number;
  trimestre: number;
  rotation: number;
  rotationRef: number;
}>;

export type EtablissementTerritorialMedicoSocialVigieRH = Readonly<{
  pyramideAges: PyramideAges[];
  departsEmbauches: DepartEmbauche[];
  departsEmbauchesTrimestriels: DepartEmbaucheTrimestriel[];
  tranchesAgesLibelles: string[];
  professionFiliere: ProfessionFiliere;
  tauxRotation: TauxRotation[];
  tauxRotationTrimestriel: TauxRotationTrimestriel[]
}>;

