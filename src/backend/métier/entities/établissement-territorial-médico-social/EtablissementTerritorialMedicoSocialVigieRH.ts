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

export type ProfessionFiliere = Readonly<{
    categorie: string;
    data: ProfessionFiliereRow[];
}>;

export type EtablissementTerritorialMedicoSocialVigieRH = Readonly<{
    pyramideAges: PyramideAges[];
    tranchesAgesLibelles: string[];
    professionFiliere : ProfessionFiliere[];
}>;

