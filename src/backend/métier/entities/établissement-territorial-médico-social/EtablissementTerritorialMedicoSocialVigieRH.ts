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

export type ProfessionGroupeRow = Readonly<{
  annee: number;
  mois: number;
  effectif: number;
}>;

export type ProfessionGroupeData = Readonly<{
  categorie: string;
  dataCategorie: ProfessionGroupeRow[];
}>;

export type ProfessionGroupes = Readonly<{
  data: ProfessionGroupeData[];
  dateDeMiseAJour: string;
}>;

export type ProfessionFiliereData = Readonly<{
  categorie: string;
  dataCategorie: ProfessionFiliereRow[];
  groupes?: ProfessionGroupes;
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
  departsPrematuresCdi: number | null;
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

export type DureeCDD = Readonly<{
  annee: number;
  trimestre: number;
  effectif: number;
  effectifRef: number;
  dureeLibelle: string
  dureeCode: number;
}>;

export type MotifsRuptureContrat = Readonly<{
  annee: number;
  trimestre: number;
  effectif: number;
  effectifRef: number;
  motifLibelle: string
  motifCode: number;
}>;

export type NatureContratsAnnuel = Readonly<{
  annee: number;
  effectif: number | null;
  effectifRef: number | null;
  natureLibelle: string;
  natureCode: number;
}>;

export type NatureContratsTrimestriel = NatureContratsAnnuel & Readonly<{
  trimestre: number;
}>;

export type EtablissementTerritorialMedicoSocialVigieRH = Readonly<{
  pyramideAges: PyramideAges[];
  departsEmbauches: DepartEmbauche[];
  departsEmbauchesTrimestriels: DepartEmbaucheTrimestriel[];
  tranchesAgesLibelles: string[];
  professionFiliere: ProfessionFiliere;
  tauxRotation: TauxRotation[];
  tauxRotationTrimestriel: TauxRotationTrimestriel[];
  dureesCdd: DureeCDD[];
  dureesCddLibelles: string[];
  motifsRuptureContrat: MotifsRuptureContrat[];
  motifsRuptureContratLibelles: string[];
  natureContratsAnnuel: NatureContratsAnnuel[];
  natureContratsTrimestriel: NatureContratsTrimestriel[];
}>;
