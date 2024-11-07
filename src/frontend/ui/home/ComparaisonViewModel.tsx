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

export type ApiComparaisonResultat = Readonly<{
  moyennes: ResultatComparaison[];
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

  public get realisationActivite(): number {
    return this.comparaison.realisationActivite;
  }

  public get acceuilDeJour(): number {
    return this.comparaison.acceuilDeJour;
  }

  public get hebergementPermanent(): number {
    return this.comparaison.hebergementPermanent;
  }

  public get hebergementTemporaire(): number {
    return this.comparaison.hebergementTemporaire;
  }

  public get fileActivePersonnesAccompagnes(): number {
    return this.comparaison.fileActivePersonnesAccompagnes;
  }

  public get rotationPersonnel(): number {
    return this.comparaison.rotationPersonnel;
  }

  public get absenteisme(): number {
    return this.comparaison.absenteisme;
  }

  public get prestationExterne(): number {
    return this.comparaison.prestationExterne;
  }

  public get etpVacant(): number {
    return this.comparaison.etpVacant;
  }

  public get tauxCaf(): number {
    return this.comparaison.tauxCaf;
  }

  public get vetusteConstruction(): number {
    return this.comparaison.vetusteConstruction;
  }

  public get roulementNetGlobal(): number {
    return this.comparaison.roulementNetGlobal;
  }

  public get resultatNetComptable(): number {
    return this.comparaison.resultatNetComptable;
  }

  // Méthodes supplémentaires pour les calculs ou ratios :

  // Pourcentage d'occupation de l'activité par rapport à la capacité
  public get pourcentageOccupation(): number {
    return parseFloat((this.comparaison.realisationActivite * 100).toFixed(2));
  }

  // Ratio d'occupation entre l'hébergement permanent et l'ensemble de l'hébergement (permanent + temporaire)
  public get ratioHebergementPermanent(): number {
    const totalHebergement = this.comparaison.hebergementPermanent + this.comparaison.hebergementTemporaire;
    return totalHebergement > 0 ? (this.comparaison.hebergementPermanent / totalHebergement) * 100 : 0;
  }

  // Ratio d'occupation de l'hébergement temporaire par rapport au total
  public get ratioHebergementTemporaire(): number {
    const totalHebergement = this.comparaison.hebergementPermanent + this.comparaison.hebergementTemporaire;
    return totalHebergement > 0 ? (this.comparaison.hebergementTemporaire / totalHebergement) * 100 : 0;
  }

  // Taux d'absentéisme en pourcentage
  public get tauxAbsenteisme(): number {
    return parseFloat((this.comparaison.absenteisme * 100).toFixed(2));
  }

  // Rotation du personnel en pourcentage
  public get tauxRotationPersonnel(): number {
    return parseFloat((this.comparaison.rotationPersonnel * 100).toFixed(2));
  }

  // Ratio de la prestation externe par rapport au total de l'activité
  public get ratioPrestationExterne(): number {
    return parseFloat((this.comparaison.prestationExterne * 100).toFixed(2));
  }

  // Taux de vétusté de la construction
  public get tauxVetusteConstruction(): number {
    return parseFloat((this.comparaison.vetusteConstruction * 100).toFixed(2));
  }

  // Calcul du résultat net en pourcentage par rapport au roulement net global
  public get pourcentageResultatNet(): number {
    return this.comparaison.roulementNetGlobal > 0
      ? parseFloat(((this.comparaison.resultatNetComptable / this.comparaison.roulementNetGlobal) * 100).toFixed(2))
      : 0;
  }

  // Méthode pour formater le résultat net en valeur absolue
  public get formatResultatNetComptable(): string {
    return this.comparaison.resultatNetComptable.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });
  }

  // Méthode pour formater le roulement net global en valeur absolue
  public get formatRoulementNetGlobal(): string {
    return this.comparaison.roulementNetGlobal.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });
  }
}
