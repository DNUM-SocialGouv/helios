export type AutorisationMédicoSocialDatesEtCapacités = Readonly<{
  capacitéAutoriséeTotale: number | null;
  capacitéInstalléeTotale: number | null;
  dateDAutorisation: string | null;
  dateDeDernièreInstallation: string | null;
  dateDeMiseÀJourDAutorisation: string | null;
  estInstallée: boolean | null;
}>;

export type AutorisationMédicoSocialClientèle = Readonly<{
  libellé: string;
  code: string;
  datesEtCapacités: AutorisationMédicoSocialDatesEtCapacités;
}>;

export type AutorisationMédicoSocialActivité = Readonly<{
  libellé: string;
  code: string;
  clientèles: AutorisationMédicoSocialClientèle[];
}>;

export type AutorisationMédicoSocialDiscipline = Readonly<{
  libellé: string;
  code: string;
  activités: AutorisationMédicoSocialActivité[];
}>;

export type CapacitéParActivité = Readonly<{
  libellé: string;
  capacité: number;
}>;

export type ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité = Readonly<{
  numéroFinessÉtablissementTerritorial: string;
  autorisations: {
    disciplines: AutorisationMédicoSocialDiscipline[];
    dateMiseÀJourSource: string;
  };
  capacités: {
    capacitéParActivité: CapacitéParActivité[];
    dateMiseÀJourSource: string;
  };
}>;
