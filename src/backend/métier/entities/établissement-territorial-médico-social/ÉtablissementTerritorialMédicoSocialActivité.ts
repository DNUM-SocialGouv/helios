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
  tauxOccupationExternat: Readonly<{
    value: number | null | string;
  }>;
  tauxOccupationSemiInternat: Readonly<{
    value: number | null | string;
  }>;
  tauxOccupationInternat: Readonly<{
    value: number | null | string;
  }>;
  tauxOccupationAutre: Readonly<{
    value: number | null | string;
  }>;
  tauxOccupationSeances: Readonly<{
    value: number | null | string;
  }>;
  tauxOccupationGlobal: Readonly<{
    dateMiseÀJourSource: string;
    value: number | null | string;
  }>;
}>;
