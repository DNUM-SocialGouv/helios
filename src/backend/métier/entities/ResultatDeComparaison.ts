export type ResultatEJ = Readonly<{
  numéroFiness: string;
  socialReason: string;
  categorie: string;
  commune: string;
  departement: string;
  type: string;
  statutJuridique: string;
  rattachements: string;
  chargesPrincipaux: number | null | string;
  chargesAnnexes: number | null | string;
  produitsPrincipaux: number | null | string;
  produitsAnnexes: number | null | string;
  resultatNetComptableEj: number | null | string;
  tauxCafEj: number | null | string;
  ratioDependanceFinanciere: number | null | string;
  sejoursHad: number | null | string;
  nombreEtpPm: number | null | string;
  nombreEtpPnm: number | null | string;
  depensesInterimPm: number | null | string;
  joursAbsenteismePm: number | null | string;
  joursAbsenteismePnm: number | null | string;
  enveloppe1: number | null | string;
  enveloppe2: number | null | string;
  enveloppe3: number | null | string;
}>;

export type ResultatSMS = Readonly<{
  numéroFiness: string;
  socialReason: string;
  categorie: string;
  commune: string;
  departement: string;
  type: string;
  capacite: number | null | string;
  realisationActivite: number | null | string;
  acceuilDeJour: number | null | string;
  externat: number | null | string;
  semiInternat: number | null | string;
  internat: number | null | string;
  autres: number | null | string;
  seances: number | null | string;
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
export type ResultatSAN = Readonly<{
  numéroFiness: string;
  socialReason: string;
  categorie: string;
  commune: string;
  departement: string;
  type: string;
  totalHosptMedecine: number | null | string;
  totalHosptObstetrique: number | null | string;
  totalHosptChirurgie: number | null | string;
  totalHosptSsr: number | null | string;
  totalHosptPsy: number | null | string;
  passagesUrgences: number | null | string;
  journeesUsld: number | null | string;
  enveloppe1: number | null | string;
  enveloppe2: number | null | string;
  enveloppe3: number | null | string;
}>;

export type ResultatDeComparaison = {
  nombreDeResultats: number;
  resultat: ResultatEJ[] | ResultatSMS[] | ResultatSAN[];
};

export type DatesMisAjourSources = {
  date_mis_a_jour_finess: string;
  date_mis_a_jour_tdbPerf: string;
  date_mis_a_jour_cnsa: string;
  date_mis_a_jour_ancre: string;
  date_mis_a_jour_hapi: string;
  date_mis_a_jour_pmsi: string;
  date_mis_a_jour_rpu: string;
  date_mis_a_jour_sae: string;
};

export type Enveloppes = {
  [annee: number]: string[]
};

export type EnveloppesResult = {
  topEnveloppesEj: Enveloppes;
  topEnveloppesSan: Enveloppes;
};

