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

export type Inspection = Readonly<{
    typeMission: string;
    themeRegional: string;
    typePlannification: string;
    statutMission: string;
    modaliteMission: string;
    dateVisite: string;
    dateRapport: string;
    nombreEcart: number;
    nombreRemarque: number;
    injonction: number;
    prescription: number;
    recommandation: number;
    saisineCng: number;
    saisineJuridiction: number;
    saisineParquet: number;
    saisineAutre: number;
}>;

export type InspectionsEtControles = Readonly<{
  inspectionsEtControles: Inspection[];
  dateMiseAJourSource: string;
}>;

export type ÉtablissementTerritorialQualite = Readonly<{
  reclamations: Reclamations[];
  evenementsIndesirables: EvenementsIndesirables[];
  inspectionsEtControles: InspectionsEtControles;
}>;

export type InspectionControleDataTheme = {
  libelleTheme: string;
  data: Inspection[];
};
