export type ÉtablissementTerritorialMédicoSocialActivité = Readonly<{
  année: number
  dateMiseAJourSource: string
  duréeMoyenneSéjourAccompagnementPersonnesSorties: Readonly<{
    dateMiseAJourSource: string
    value: number | null
  }>
  fileActivePersonnesAccompagnées: Readonly<{
    dateMiseAJourSource: string
    value: number | null
  }>
  nombreMoyenJournéesAbsencePersonnesAccompagnées: Readonly<{
    dateMiseAJourSource: string
    value: number | null
  }>
  numéroFinessÉtablissementTerritorial: string
  tauxOccupationAccueilDeJour: Readonly<{
    dateMiseAJourSource: string
    value: number | null
  }>
  tauxOccupationHébergementPermanent: Readonly<{
    dateMiseAJourSource: string
    value: number | null
  }>
  tauxOccupationHébergementTemporaire: Readonly<{
    dateMiseAJourSource: string
    value: number | null
  }>
  tauxRéalisationActivité: Readonly<{
    dateMiseAJourSource: string
    value: number | null
  }>
}>
