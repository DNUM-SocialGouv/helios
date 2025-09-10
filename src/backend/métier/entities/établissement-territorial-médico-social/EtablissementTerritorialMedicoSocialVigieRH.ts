export type PyramideAges = Readonly<{
  annee: number;
  trancheLibelle: string;
  effectif: number;
  effectifHomme: number;
  effectifFemme: number;
  effectifHommeRef: number;
  effectifFemmeRef: number;
}>;

export type ProfessionFiliereRow = Readonly<{
  annee: number;
  mois: number;
  effectifFiliere: number;
  effectifEtab: number;
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

export type EtablissementTerritorialMedicoSocialVigieRH = Readonly<{
  pyramideAges: PyramideAges[];
  departsEmbauches: DepartEmbauche[];
  tranchesAgesLibelles: string[];
  professionFiliere: ProfessionFiliere;
}>;

