export type ResultatEJ = Readonly<{
    commune: string;
    département: string;
    numéroFiness: string;
    raisonSocialeCourte: string;
    type: string;
}>;

export type ResultatSMS = Readonly<{
    annee: number;
    numeroFiness: string;
    raisonSociale: string;
    type: string;
    capacite: number;
    realisationAcitivite: number;
    acceuilDeJour: number;
    hebergementPermanent: number;
    hebergementTemporaire: number;
    fileActivePersonnesAccompagnes: number;
    rotationPersonnel: number;
    absenteisme: number;
    prestationExterne: number;
    etpVacant: number;
    tauxCaf: number;
    vetusteConstruction: number;
    roulementNetGlobal: number;
    resultatNetComptable: number;
}>;

export type ResultatES = Readonly<{
    commune: string;
    département: string;
    numéroFiness: string;
    raisonSocialeCourte: string;
    type: string;
}>;

export type ResultatDeComparaison = {
    nombreDeResultats: number,
    resultat: ResultatEJ[] | ResultatSMS[] | ResultatES[]
};
