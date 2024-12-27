export type ResultatComparaison = Readonly<{
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
  commune: string;
  departement: string;
}>;

export type MoyenneResultatComparaison = {
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
};

export type ApiComparaisonResultat = Readonly<{
  moyennes: MoyenneResultatComparaison[];
  nombreDeResultats: number;
  resultat: ResultatComparaison[];
}>;

export class ComparaisonViewModel {
  constructor(private readonly comparaison: ResultatComparaison) { }

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
    return this.comparaison.realisationActivite !== null ? this.comparaison.realisationActivite + "%" : null;
  }

  public get acceuilDeJour(): string | null {
    return this.comparaison.acceuilDeJour !== null ? this.comparaison.acceuilDeJour + "%" : null;
  }

  public get hebergementPermanent(): string | null {
    return this.comparaison.hebergementPermanent !== null ? this.comparaison.hebergementPermanent + "%" : null;
  }

  public get hebergementTemporaire(): string | null {
    return this.comparaison.hebergementTemporaire !== null ? this.comparaison.hebergementTemporaire + "%" : null;
  }

  public get fileActivePersonnesAccompagnes(): number | null {
    return this.comparaison.fileActivePersonnesAccompagnes;
  }

  public get rotationPersonnel(): string | null {
    return this.comparaison.rotationPersonnel !== null ? this.comparaison.rotationPersonnel + "%" : null;
  }

  public get absenteisme(): string | null {
    return this.comparaison.absenteisme !== null ? this.comparaison.absenteisme + "%" : null;
  }

  public get prestationExterne(): string | null {
    return this.comparaison.prestationExterne !== null ? this.comparaison.prestationExterne + "%" : null;
  }

  public get etpVacant(): string | null {
    return this.comparaison.etpVacant !== null ? this.comparaison.etpVacant + "%" : null;
  }

  public get tauxCaf(): string | null {
    return this.comparaison.tauxCaf !== null ? this.comparaison.tauxCaf + "%" : null;
  }

  public get vetusteConstruction(): string | null {
    return this.comparaison.vetusteConstruction !== null ? this.comparaison.vetusteConstruction + "%" : null;
  }

  public get roulementNetGlobal(): string {
    return this.comparaison.roulementNetGlobal ? this.comparaison.roulementNetGlobal
      .toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })
      .split(",")[0] + " €"
      : "-";
  }

  public get commune(): string {
    return this.comparaison.commune;
  }

  public get departement(): string {
    return this.comparaison.departement;
  }

  public get resultatNetComptable(): string {
    return this.comparaison.resultatNetComptable
      ? this.comparaison.resultatNetComptable
        .toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        })
        .split(",")[0] + " €"
      : "-";
  }
}

export class ComparaisonMoyenneViewModel {
  constructor(private moyenne: MoyenneResultatComparaison) { }

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
  return value ? Number(value.toFixed(num)) : 0;
};

const transformInRate = (number: number, chiffre: number): number => {
  return makeNumberArrondi(number * 100, chiffre);
};

