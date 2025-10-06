export type EtablissementTerritorialSanitaireRH = Readonly<{
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
  joursAbsenteismePnm: {
    dateMiseAJourSource: string;
    valeur: number | null | "";
  };
}>;
