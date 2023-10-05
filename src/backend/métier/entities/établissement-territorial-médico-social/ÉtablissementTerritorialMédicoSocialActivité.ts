export type ÉtablissementTerritorialMédicoSocialActivité = Readonly<{
  année: number;
  duréeMoyenneSéjourAccompagnementPersonnesSorties: Readonly<{
    dateMiseÀJourSource: string;
    value: number | null | string;
  }>;
  fileActivePersonnesAccompagnées: Readonly<{
    dateMiseÀJourSource: string;
    value: number | null | string;
  }>;
  nombreMoyenJournéesAbsencePersonnesAccompagnées: Readonly<{
    dateMiseÀJourSource: string;
    value: number | null;
  }>;
  numéroFinessÉtablissementTerritorial: string;
  tauxOccupationAccueilDeJour: Readonly<{
    dateMiseÀJourSource: string;
    value: number | null | string;
  }>;
  tauxOccupationHébergementPermanent: Readonly<{
    dateMiseÀJourSource: string;
    value: number | null | string;
  }>;
  tauxOccupationHébergementTemporaire: Readonly<{
    dateMiseÀJourSource: string;
    value: number | null | string;
  }>;
  tauxRéalisationActivité: Readonly<{
    dateMiseÀJourSource: string;
    value: number | null | string;
  }>;
}>;
