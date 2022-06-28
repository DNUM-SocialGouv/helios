export type ÉtablissementTerritorialMédicoSocialActivité = Readonly<{
  année: number
  numéroFinessÉtablissementTerritorial: string
  tauxOccupationAccueilDeJour: number
  tauxOccupationHébergementTemporaire: number
  tauxOccupationHébergementPermanent: number
  tauxRéalisationActivité: number
  fileActivePersonnesAccompagnées: number
  nombreMoyenJournéesAbsencePersonnesAccompagnées: number
  duréeMoyenneSéjourAccompagnementPersonnesSorties: number
}>
