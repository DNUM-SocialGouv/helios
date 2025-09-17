export type EntiteJuridiqueRessourcesHumaines = Readonly<{
  annee: number;
  nombreEtpPm: {
    dateMiseAJourSource: string;
    valeur: number | null | "";
  };
  nombreEtpPnm: {
    dateMiseAJourSource: string;
    valeur: number | null | "";
  };
  depensesInterimPm: {
    dateMiseAJourSource: string;
    valeur: number | null | "";
  };
  joursAbsenteismePm: {
    dateMiseAJourSource: string;
    valeur: number | null | "";
  };
}>;
