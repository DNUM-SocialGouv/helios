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

export type ÉtablissementTerritorialQualite = Readonly<{
    reclamations: Reclamations[];
}>;