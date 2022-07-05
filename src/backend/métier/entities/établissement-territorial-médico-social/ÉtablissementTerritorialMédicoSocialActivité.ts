export type ÉtablissementTerritorialMédicoSocialActivité = Readonly<{
  année: number
  dateMiseAJourSource: string
  duréeMoyenneSéjourAccompagnementPersonnesSorties: number | null
  fileActivePersonnesAccompagnées: number | null
  nombreMoyenJournéesAbsencePersonnesAccompagnées: number | null
  numéroFinessÉtablissementTerritorial: string
  tauxOccupationAccueilDeJour: number | null
  tauxOccupationHébergementPermanent: number | null
  tauxOccupationHébergementTemporaire: number | null
  tauxRéalisationActivité: number | null
}>
