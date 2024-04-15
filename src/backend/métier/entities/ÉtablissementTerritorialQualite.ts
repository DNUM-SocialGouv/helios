export type ReclamationDetails = Readonly<{
  motif: string;
  clot: number;
  encours: number;
}>;

export type Reclamations = Readonly<{
  numéroFinessÉtablissementTerritorial: string;
  année: number;
  totalClotures: number;
  totalEncours: number;
  dateMiseÀJourSource: string;
  details: ReclamationDetails[];
}>;

export type EvenementsIndesirables = Readonly<{
  libelle: string;
  evenementsEncours: any[];
  evenementsClotures: any[];
  dateMiseAJourSource: string;
}>;

export type InspectionControleData = {
  typeMission: string;

  themeRegional: string;
  dateVisite: string;
  dateRapport: string;
  nombreEcart: number;
  nombreRemarque: number;
  injonction: number;
  recommandation: number;
  prescription: number;
  saisineCng: number;
  saisineJuridiction: number;
  saisineParquet: number;
  saisineAutre: number;
  typePlannification: string;
  modaliteMission: string;
};

export type InspectionControleDataTheme = {
  libelleTheme: string;
  data: InspectionControleData[];
};

export type InspectionsEtControles = Readonly<{
  data: InspectionControleData[];
  dateMiseAJourSource: string;
}>;

export type InspectionsEtControlesByTheme = Readonly<{
  data: InspectionControleDataTheme[];
  dateMiseAJourSource: string;
}>;

export type ÉtablissementTerritorialQualite = Readonly<{
  reclamations: Reclamations[];
  evenementsIndesirables: EvenementsIndesirables[];
}>;
