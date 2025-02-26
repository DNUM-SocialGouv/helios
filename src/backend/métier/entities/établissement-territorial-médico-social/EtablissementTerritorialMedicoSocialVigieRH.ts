export type PyramideAges = Readonly<{
    annee: number;
    trancheLibelle: string;
    effectif: number;
    effectifHomme: number;
    effectifFemme: number;
    effectifHommeRef: number;
    effectifFemmeRef: number;
}>;

export type EtablissementTerritorialMedicoSocialVigieRH = Readonly<{
    pyramideAges: PyramideAges[];
    tranchesAgesLibelles: string[];
}>;

