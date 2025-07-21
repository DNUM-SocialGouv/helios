export type ResultatComparaisonSMS = Readonly<{
  numéroFiness: string;
  socialReason: string;
  type: string;
  capacite: number;
  realisationActivite: number | 'NA';
  acceuilDeJour: number | 'NA';
  hebergementPermanent: number | 'NA';
  hebergementTemporaire: number | 'NA';
  fileActivePersonnesAccompagnes: number | 'NA';
  rotationPersonnel: number | 'NA';
  absenteisme: number | 'NA';
  prestationExterne: number | 'NA';
  etpVacant: number | 'NA';
  tauxCaf: number | 'NA';
  vetusteConstruction: number | 'NA';
  roulementNetGlobal: number | 'NA';
  resultatNetComptable: number | 'NA';
  commune: string;
  departement: string;
}>;

export type ResultatComparaisonEJ = Readonly<{
  numéroFiness: string;
  socialReason: string;
  commune: string;
  departement: string;
  type: string;
  statutJuridique: string;
  rattachements: string;
  chargesPrincipaux: number | null | string;
  chargesAnnexes: number | null | string;
  produitsPrincipaux: number | null | string;
  produitsAnnexes: number | null | string;
  resultatNetComptableEj: number | null | string;
  tauxCafEj: number | null | string;
  ratioDependanceFinanciere: number | null | string;
  enveloppe1: number | null | string;
  enveloppe2: number | null | string;
  enveloppe3: number | null | string;
}>;

export type ResultatComparaison = ResultatComparaisonSMS | ResultatComparaisonEJ;

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

export class ComparaisonSMSViewModel {
  constructor(private readonly comparaison: ResultatComparaisonSMS) { }

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

  public get realisationActivite(): string | null | string {
    return this.comparaison.realisationActivite !== null ? this.comparaison.realisationActivite === 'NA' ? 'Consultation non autorisée' : this.comparaison.realisationActivite + "%" : null;
  }

  public get acceuilDeJour(): string | null {
    return this.comparaison.acceuilDeJour !== null ? this.comparaison.acceuilDeJour === 'NA' ? 'Consultation non autorisée' : this.comparaison.acceuilDeJour + "%" : null;
  }

  public get hebergementPermanent(): string | null {
    return this.comparaison.hebergementPermanent !== null ? this.comparaison.hebergementPermanent === 'NA' ? 'Consultation non autorisée' : this.comparaison.hebergementPermanent + "%" : null;
  }

  public get hebergementTemporaire(): string | null {
    return this.comparaison.hebergementTemporaire !== null ? this.comparaison.hebergementTemporaire === 'NA' ? 'Consultation non autorisée' : this.comparaison.hebergementTemporaire + "%" : null;
  }

  public get fileActivePersonnesAccompagnes(): number | null | string {
    return this.comparaison.fileActivePersonnesAccompagnes === 'NA' ? 'Consultation non autorisée' : this.comparaison.fileActivePersonnesAccompagnes;
  }

  public get rotationPersonnel(): string | null {
    return this.comparaison.rotationPersonnel !== null ? this.comparaison.rotationPersonnel === 'NA' ? 'Consultation non autorisée' : this.comparaison.rotationPersonnel + "%" : null;
  }

  public get absenteisme(): string | null {
    return this.comparaison.absenteisme !== null ? this.comparaison.absenteisme === 'NA' ? 'Consultation non autorisée' : this.comparaison.absenteisme + "%" : null;
  }

  public get prestationExterne(): string | null {
    return this.comparaison.prestationExterne !== null ? this.comparaison.prestationExterne === 'NA' ? 'Consultation non autorisée' : this.comparaison.prestationExterne + "%" : null;
  }

  public get etpVacant(): string | null {
    return this.comparaison.etpVacant !== null ? this.comparaison.etpVacant === 'NA' ? 'Consultation non autorisée' : this.comparaison.etpVacant + "%" : null;
  }

  public get tauxCaf(): string | null {
    return this.comparaison.tauxCaf !== null ? this.comparaison.tauxCaf === 'NA' ? 'Consultation non autorisée' : this.comparaison.tauxCaf + "%" : null;
  }

  public get vetusteConstruction(): string | null {
    return this.comparaison.vetusteConstruction !== null ? this.comparaison.vetusteConstruction === 'NA' ? 'Consultation non autorisée' : this.comparaison.vetusteConstruction + "%" : null;
  }

  public get roulementNetGlobal(): string {
    return this.comparaison.roulementNetGlobal ? this.comparaison.roulementNetGlobal === 'NA' ? 'Consultation non autorisée' : this.comparaison.roulementNetGlobal
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
    return this.comparaison.resultatNetComptable ? this.comparaison.resultatNetComptable === 'NA' ? 'Consultation non autorisée' : this.comparaison.resultatNetComptable
      .toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })
      .split(",")[0] + " €"
      : "-";
  }
}



export class ComparaisonEJViewModel {
  constructor(private readonly comparaison: ResultatComparaisonEJ) { }

  public get numéroFiness(): string {
    return this.comparaison.numéroFiness;
  }

  public get socialReason(): string {
    return this.comparaison.socialReason;
  }

  public get type(): string {
    return this.comparaison.type;
  }

  public get rattachements(): string {
    return this.comparaison.rattachements;
  }

  public get statutJuridique(): string {
    return this.comparaison.statutJuridique;
  }

  public get resultatNetComptableEj(): string {
    if (this.comparaison.resultatNetComptableEj === '') return ''
    return this.comparaison.resultatNetComptableEj ? this.comparaison.resultatNetComptableEj
      .toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })
      .split(",")[0] + " €"
      : "-";
  }

  public get tauxCafEj(): string | null {
    if (this.comparaison.tauxCafEj === '') return ''
    return this.comparaison.tauxCafEj ? this.comparaison.tauxCafEj + "%" : null;
  }

  public get ratioDependanceFinanciere(): string | null {
    if (this.comparaison.ratioDependanceFinanciere === '') return ''
    return this.comparaison.ratioDependanceFinanciere !== null ? this.comparaison.ratioDependanceFinanciere + "%" : null;
  }

  public get chargesPrincipaux(): string | null {
    if (this.comparaison.chargesPrincipaux === '') return ''
    return this.comparaison.chargesPrincipaux ? this.comparaison.chargesPrincipaux
      .toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })
      .split(",")[0] + " €"
      : "-";
  }

  public get produitsPrincipaux(): string | null {
    if (this.comparaison.produitsPrincipaux === '') return ''
    return this.comparaison.produitsPrincipaux ? this.comparaison.produitsPrincipaux.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    })
      .split(",")[0] + " €"
      : "-";
  }

  public get chargesAnnexes(): string | null {
    if (this.comparaison.chargesAnnexes === '') return ''
    return this.comparaison.chargesAnnexes ? this.comparaison.chargesAnnexes
      .toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })
      .split(",")[0] + " €"
      : "-";
  }

  public get produitsAnnexes(): string | null {
    if (this.comparaison.produitsAnnexes === '') return ''
    return this.comparaison.produitsAnnexes ? this.comparaison.produitsAnnexes === '' ? '' : this.comparaison.produitsAnnexes
      .toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })
      .split(",")[0] + " €"
      : "-";
  }

  public get enveloppe1(): string | null {
    if (this.comparaison.enveloppe1 === '') return ''
    return this.comparaison.enveloppe1 ? this.comparaison.enveloppe1
      .toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })
      .split(",")[0] + " €"
      : "-";
  }

  public get enveloppe2(): string | null {
    if (this.comparaison.enveloppe2 === '') return ''
    return this.comparaison.enveloppe2 ? this.comparaison.enveloppe2
      .toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      })
      .split(",")[0] + " €"
      : "-";
  }

  public get enveloppe3(): string | null {
    if (this.comparaison.enveloppe3 === '') return ''
    return this.comparaison.enveloppe3 ? this.comparaison.enveloppe3
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


}
