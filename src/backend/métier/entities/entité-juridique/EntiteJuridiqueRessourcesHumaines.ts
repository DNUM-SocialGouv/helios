export type EntiteJuridiqueRessourcesHumaines = Readonly<{
  annee: number;
  nombreEtpPm: Readonly<{
    dateMiseAJourSource: string;
    valeur: number | null | "";
  }>;
  nombreEtpPnm: Readonly<{
    dateMiseAJourSource: string;
    valeur: number | null | "";
  }>;
  depensesInterimPm: Readonly<{
    dateMiseAJourSource: string;
    valeur: number | null | "";
  }>;
  joursAbsenteismePm: Readonly<{
    dateMiseAJourSource: string;
    valeur: number | null | "";
  }>;
}>;
