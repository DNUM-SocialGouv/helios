export type ReclamationDetails = Readonly<{
    motif: string;
    clot: number;
    encours: number;
}>;

export type ÉtablissementTerritorialMédicoSocialQualite = Readonly<{
    numéroFinessÉtablissementTerritorial: string;
    année: number;
    totalClotures: number;
    totalEncours: number;
    dateMiseÀJourSource: string;
    details: ReclamationDetails[];
}>;