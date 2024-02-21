export type ReclamationDetails = Readonly<{
    motif: string;
    clot: number;
    encours: number;
}>;

export type ÉtablissementTerritorialQualite = Readonly<{
    numéroFinessÉtablissementTerritorial: string;
    année: number;
    totalClotures: number;
    totalEncours: number;
    dateMiseÀJourSource: string;
    details: ReclamationDetails[];
}>;