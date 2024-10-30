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

export type MoyenneEJ = Readonly<{}>;
export type MoyenneSMS = Readonly<{
    annee: number;
    capaciteMoyenne: number;
    realisationAcitiviteMoyenne: number;
    acceuilDeJourMoyenne: number;
    hebergementPermanentMoyenne: number;
    hebergementTemporaireMoyenne: number;
    fileActivePersonnesAccompagnesMoyenne: number;
    rotationPersonnelMoyenne: number;
    absenteismeMoyenne: number;
    prestationExterneMoyenne: number;
    etpVacantMoyenne: number;
    tauxCafMoyenne: number;
    vetusteConstructionMoyenne: number;
    roulementNetGlobalMoyenne: number;
    resultatNetComptableMoyenne: number;
}>;
export type MoyenneES = Readonly<{}>;

export type ResultatDeComparaison = {
    nombreDeResultats: { annee: number, total: number },
    resultat: ResultatEJ[] | ResultatSMS[] | ResultatES[],
    moyennes: MoyenneEJ[] | MoyenneSMS[] | MoyenneES[],
};
