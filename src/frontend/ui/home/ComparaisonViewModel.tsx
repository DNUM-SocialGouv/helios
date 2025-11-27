import { StringFormater } from "../commun/StringFormater";

type ValueOrNA = number | null | string;

export type ResultatComparaisonSMS = Readonly<{
  numéroFiness: string;
  socialReason: string;
  categorie: string;
  type: string;
  capacite: number;
  realisationActivite: number | string;
  acceuilDeJour: number | string;
  externat: number | null | string;
  semiInternat: number | null | string;
  internat: number | null | string;
  autres: number | null | string;
  seances: number | null | string;
  hebergementPermanent: number | string;
  hebergementTemporaire: number | string;
  fileActivePersonnesAccompagnes: number | string;
  rotationPersonnel: number | string;
  absenteisme: number | string;
  prestationExterne: number | string;
  etpVacant: number | string;
  tauxCaf: number | string;
  vetusteConstruction: number | string;
  roulementNetGlobal: number | string;
  resultatNetComptable: number | string;
  commune: string;
  departement: string;
}>;

export type ResultatComparaisonEJ = Readonly<{
  numéroFiness: string;
  socialReason: string;
  categorie: string;
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
  sejoursHad: number | null | string;
  nombreEtpPm: number | null | string;
  nombreEtpPnm: number | null | string;
  depensesInterimPm: number | null | string;
  joursAbsenteismePm: number | null | string;
  joursAbsenteismePnm: number | null | string;
  enveloppe1: number | null | string;
  enveloppe2: number | null | string;
  enveloppe3: number | null | string;
}>;

export type ResultatComparaisonSAN = Readonly<{
  numéroFiness: string;
  socialReason: string;
  categorie: string;
  commune: string;
  departement: string;
  type: string;
  totalHosptMedecine: number | null | string;
  totalHosptObstetrique: number | null | string;
  totalHosptChirurgie: number | null | string;
  totalHosptSsr: number | null | string;
  totalHosptPsy: number | null | string;
  passagesUrgences: number | null | string;
  journeesUsld: number | null | string;
  nombreEtpPm: number | null | string;
  nombreEtpPnm: number | null | string;
  depensesInterimPm: number | null | string;
  joursAbsenteismePm: number | null | string;
  joursAbsenteismePnm: number | null | string;
  enveloppe1: number | null | string;
  enveloppe2: number | null | string;
  enveloppe3: number | null | string;
}>;

export type ResultatComparaison = ResultatComparaisonSMS | ResultatComparaisonEJ | ResultatComparaisonSAN;

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

function formatCurrency(value: ValueOrNA): string {
  if (value === '') return "";
  if (!value) return "-";
  if (value === 'NA') return 'Consultation non autorisée';
  return value
    .toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    })
    .split(",")[0] + " €";
}

function formatRatio(value: ValueOrNA): string | null {
  if (value === null) return null;
  if (value === '') return ''
  if (value === 'NA') return 'Consultation non autorisée';
  return value + "%";

}
function formatNumberValue(value: number | string | null): string {
  if (value === '') return '';
  if (!value) return '-';
  const num = Number(value);
  if (isNaN(num)) return '-';
  return StringFormater.formatInFrench(num);
}


export class ComparaisonSMSViewModel {
  constructor(private readonly comparaison: ResultatComparaisonSMS) { }

  public get numéroFiness(): string {
    return this.comparaison.numéroFiness;
  }

  public get socialReason(): string {
    return this.comparaison.socialReason;
  }

  public get categorie(): string {
    return this.comparaison.categorie;
  }

  public get type(): string {
    return this.comparaison.type;
  }

  public get capacite(): number {
    return this.comparaison.capacite;
  }

  public get realisationActivite(): string | null {
    return formatRatio(this.comparaison.realisationActivite);
  }

  public get acceuilDeJour(): string | null {
    return formatRatio(this.comparaison.acceuilDeJour);
  }

  public get hebergementPermanent(): string | null {
    return formatRatio(this.comparaison.hebergementPermanent);
  }

  public get hebergementTemporaire(): string | null {
    return formatRatio(this.comparaison.hebergementTemporaire);
  }

  public get fileActivePersonnesAccompagnes(): number | string {
    if (this.comparaison.fileActivePersonnesAccompagnes === '') return ''
    return this.comparaison.fileActivePersonnesAccompagnes === 'NA' ? 'Consultation non autorisée' : this.comparaison.fileActivePersonnesAccompagnes;
  }

  public get rotationPersonnel(): string | null {
    return formatRatio(this.comparaison.rotationPersonnel);
  }

  public get absenteisme(): string | null {
    return formatRatio(this.comparaison.absenteisme);
  }

  public get externat(): string | null {
    return formatRatio(this.comparaison.externat);
  }

  public get internat(): string | null {
    return formatRatio(this.comparaison.internat);
  }
  public get semiInternat(): string | null {
    return formatRatio(this.comparaison.semiInternat);
  }
  public get autres(): string | null {
    return formatRatio(this.comparaison.autres);
  }
  public get seances(): string | null {
    return formatRatio(this.comparaison.seances);
  }
  public get prestationExterne(): string | null {
    return formatRatio(this.comparaison.prestationExterne);
  }

  public get etpVacant(): string | null {
    return formatRatio(this.comparaison.etpVacant);
  }

  public get tauxCaf(): string | null {
    return formatRatio(this.comparaison.tauxCaf);
  }

  public get vetusteConstruction(): string | null {
    return formatRatio(this.comparaison.vetusteConstruction);
  }

  public get roulementNetGlobal(): string {
    return formatCurrency(this.comparaison.roulementNetGlobal);
  }

  public get commune(): string {
    return this.comparaison.commune;

  }

  public get departement(): string {
    return this.comparaison.departement;
  }

  public get resultatNetComptable(): string {
    return formatCurrency(this.comparaison.resultatNetComptable);
  }
}

export class ComparaisonSANViewModel {
  constructor(private readonly comparaison: ResultatComparaisonSAN) { }

  public get numéroFiness(): string {
    return this.comparaison.numéroFiness;
  }

  public get socialReason(): string {
    return this.comparaison.socialReason;
  }

  public get categorie(): string {
    return this.comparaison.categorie;
  }

  public get type(): string {
    return this.comparaison.type;
  }

  public get commune(): string {
    return this.comparaison.commune;
  }

  public get departement(): string {
    return this.comparaison.departement;
  }

  public get totalHosptMedecine(): ValueOrNA {
    if (this.comparaison.totalHosptMedecine === '') return ''
    return this.comparaison.totalHosptMedecine;
  }

  public get totalHosptObstetrique(): ValueOrNA {
    if (this.comparaison.totalHosptObstetrique === '') return ''
    return this.comparaison.totalHosptObstetrique;
  }

  public get totalHosptChirurgie(): ValueOrNA {
    if (this.comparaison.totalHosptChirurgie === '') return ''
    return this.comparaison.totalHosptChirurgie;
  }

  public get totalHosptSsr(): ValueOrNA {
    if (this.comparaison.totalHosptSsr === '') return ''
    return this.comparaison.totalHosptSsr;
  }

  public get totalHosptPsy(): ValueOrNA {
    if (this.comparaison.totalHosptPsy === '') return ''
    return this.comparaison.totalHosptPsy;
  }

  public get passagesUrgences(): ValueOrNA {
    if (this.comparaison.passagesUrgences === '') return ''
    return this.comparaison.passagesUrgences;
  }

  public get journeesUsld(): ValueOrNA {
    if (this.comparaison.journeesUsld === '') return ''
    return this.comparaison.journeesUsld;
  }

  public get nombreEtpPm(): string {
    return formatNumberValue(this.comparaison.nombreEtpPm);
  }

  public get nombreEtpPnm(): string {
    return formatNumberValue(this.comparaison.nombreEtpPnm);
  }

  public get depensesInterimPm(): string {
    return formatCurrency(this.comparaison.depensesInterimPm);
  }

  public get joursAbsenteismePm(): string {
    return formatNumberValue(this.comparaison.joursAbsenteismePm);
  }

  public get joursAbsenteismePnm(): string {
    return formatNumberValue(this.comparaison.joursAbsenteismePnm);
  }

  public get enveloppe1(): string {
    return formatCurrency(this.comparaison.enveloppe1);
  }

  public get enveloppe2(): string {
    return formatCurrency(this.comparaison.enveloppe2);
  }

  public get enveloppe3(): string {
    return formatCurrency(this.comparaison.enveloppe3);
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

  public get categorie(): string {
    return this.comparaison.categorie;
  }

  public get type(): string {
    return this.comparaison.type;
  }

  public get rattachements(): string {
    return this.comparaison.rattachements;
  }

  public get statutJuridique(): string {
    switch (this.comparaison.statutJuridique) {
      case "prive_lucratif":
        return "PRIVÉ LUCRATIF";
      case "prive_non_lucratif":
        return "PRIVÉ NON LUCRATIF";
      case "public":
        return "PUBLIC";
      default:
        return "";
    }
  }

  public get resultatNetComptableEj(): string {
    return formatCurrency(this.comparaison.resultatNetComptableEj);
  }

  public get tauxCafEj(): string | null {
    return formatRatio(this.comparaison.tauxCafEj);
  }

  public get ratioDependanceFinanciere(): string | null {
    return formatRatio(this.comparaison.ratioDependanceFinanciere);
  }

  public get sejoursHad(): number | string | null {
    if (this.comparaison.sejoursHad === '') return ''
    return this.comparaison.sejoursHad;
  }

  public get nombreEtpPm(): string {
    return formatNumberValue(this.comparaison.nombreEtpPm);
  }

  public get nombreEtpPnm(): string {
    return formatNumberValue(this.comparaison.nombreEtpPnm);
  }

  public get depensesInterimPm(): string {
    return formatCurrency(this.comparaison.depensesInterimPm);
  }

  public get joursAbsenteismePm(): string {
    return formatNumberValue(this.comparaison.joursAbsenteismePm);
  }

  public get joursAbsenteismePnm(): string {
    return formatNumberValue(this.comparaison.joursAbsenteismePnm);
  }

  public get chargesPrincipaux(): string {
    return formatCurrency(this.comparaison.chargesPrincipaux);
  }

  public get produitsPrincipaux(): string {
    return formatCurrency(this.comparaison.produitsPrincipaux);
  }

  public get chargesAnnexes(): string {
    return formatCurrency(this.comparaison.chargesAnnexes);
  }

  public get produitsAnnexes(): string {
    return formatCurrency(this.comparaison.produitsAnnexes);
  }

  public get enveloppe1(): string {
    return formatCurrency(this.comparaison.enveloppe1);
  }

  public get enveloppe2(): string {
    return formatCurrency(this.comparaison.enveloppe2);
  }

  public get enveloppe3(): string {
    return formatCurrency(this.comparaison.enveloppe3);
  }

  public get commune(): string {
    return this.comparaison.commune;

  }

  public get departement(): string {
    return this.comparaison.departement;
  }

}
