export type ResultatComparaison = Readonly<{
  annee: number;
  numéroFiness: string;
  socialReason: string;
  type: string;
  capacite: number;
  realisationActivite: number;
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

export type MoyenneResultatComparaison = Readonly<{
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

export type ApiComparaisonResultat = Readonly<{
  moyennes: MoyenneResultatComparaison[];
  nombreDeResultats: [{ annee: number; total: string }];
  resultat: ResultatComparaison[];
}>;

export class ComparaisonViewModel {
  constructor(private readonly comparaison: ResultatComparaison) {}

  public get annee(): number {
    return this.comparaison.annee;
  }

  public get numéroFiness(): string {
    return this.comparaison.numéroFiness;
  }

  public get socialReason(): string {
    return this.comparaison.socialReason;
  }

  public get type(): string {
    return this.comparaison.type;
  }

  public get capacite(): number {
    return this.comparaison.capacite;
  }

  public get realisationActivite(): string | null {
    return this.comparaison.realisationActivite ? this.comparaison.realisationActivite + "%" : null;
  }

  public get acceuilDeJour(): string | null {
    return this.comparaison.acceuilDeJour ? this.comparaison.acceuilDeJour + "%" : null;
  }

  public get hebergementPermanent(): string | null {
    return this.comparaison.hebergementPermanent ? this.comparaison.hebergementPermanent + "%" : null;
  }

  public get hebergementTemporaire(): string | null {
    return this.comparaison.hebergementTemporaire ? this.comparaison.hebergementTemporaire + "%" : null;
  }

  public get fileActivePersonnesAccompagnes(): number | null {
    return this.comparaison.fileActivePersonnesAccompagnes;
  }

  public get rotationPersonnel(): string | null {
    return this.comparaison.rotationPersonnel ? this.comparaison.rotationPersonnel + "%" : null;
  }

  public get absenteisme(): string | null {
    return this.comparaison.absenteisme ? this.comparaison.absenteisme + "%" : null;
  }

  public get prestationExterne(): string | null {
    return this.comparaison.prestationExterne ? this.comparaison.prestationExterne + "%" : null;
  }

  public get etpVacant(): string | null {
    return this.comparaison.etpVacant ? this.comparaison.etpVacant + "%" : null;
  }

  public get tauxCaf(): string | null {
    return this.comparaison.tauxCaf ? this.comparaison.tauxCaf + "%" : null;
  }

  public get vetusteConstruction(): string | null {
    return this.comparaison.vetusteConstruction ? this.comparaison.vetusteConstruction + "%" : null;
  }

  public get roulementNetGlobal(): number {
    return this.comparaison.roulementNetGlobal;
  }

  public get resultatNetComptable(): string {
    return this.comparaison.resultatNetComptable
      ? this.comparaison.resultatNetComptable
          .toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })
          .split(",")[0] + "€"
      : "-";
  }

  // Méthode pour formater le roulement net global en valeur absolue
  public get formatRoulementNetGlobal(): string {
    return this.comparaison.roulementNetGlobal.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });
  }
}

export class ComparaisonMoyenneViewModel {
  constructor(private moyenne: MoyenneResultatComparaison) {}

  // Accesseur pour l'année
  public get annee(): number {
    return this.moyenne.annee;
  }

  // Accesseurs pour les autres propriétés
  public get capaciteMoyenne(): number {
    return this.moyenne.capaciteMoyenne;
  }

  public get realisationAcitiviteMoyenne(): number {
    return transformInRate(this.moyenne.realisationAcitiviteMoyenne, 1);
  }

  public get acceuilDeJourMoyenne(): number {
    return transformInRate(this.moyenne.acceuilDeJourMoyenne, 1);
  }

  public get hebergementPermanentMoyenne(): number {
    return transformInRate(this.moyenne.hebergementPermanentMoyenne, 1);
  }

  public get hebergementTemporaireMoyenne(): number {
    return transformInRate(this.moyenne.hebergementTemporaireMoyenne, 1);
  }

  public get fileActivePersonnesAccompagnesMoyenne(): number {
    return transformInRate(this.moyenne.fileActivePersonnesAccompagnesMoyenne, 1);
  }

  public get rotationPersonnelMoyenne(): number {
    return transformInRate(this.moyenne.rotationPersonnelMoyenne, 1);
  }

  public get absenteismeMoyenne(): number {
    return transformInRate(this.moyenne.absenteismeMoyenne, 1);
  }

  public get prestationExterneMoyenne(): number {
    return transformInRate(this.moyenne.prestationExterneMoyenne, 1);
  }

  public get etpVacantMoyenne(): number {
    return transformInRate(this.moyenne.etpVacantMoyenne, 1);
  }

  public get tauxCafMoyenne(): number {
    return transformInRate(this.moyenne.tauxCafMoyenne, 1);
  }

  public get vetusteConstructionMoyenne(): number {
    return transformInRate(this.moyenne.vetusteConstructionMoyenne, 1);
  }

  public get roulementNetGlobalMoyenne(): number {
    return makeNumberArrondi(this.moyenne.roulementNetGlobalMoyenne, 0);
  }

  public get resultatNetComptableMoyenne(): number {
    return makeNumberArrondi(this.moyenne.resultatNetComptableMoyenne, 0);
  }
}

const makeNumberArrondi = (value: number, num: number): number => {
  return Number(value.toFixed(num));
};

const transformInRate = (number: number, chiffre: number): number => {
  return makeNumberArrondi(number * 100, chiffre);
};
