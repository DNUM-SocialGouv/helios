export type ÉtablissementTerritorialMédicoSocialActivité = Readonly<{
  année: number
  duréeMoyenneSéjourAccompagnementPersonnesSorties: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  fileActivePersonnesAccompagnées: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  nombreMoyenJournéesAbsencePersonnesAccompagnées: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  numéroFinessÉtablissementTerritorial: string
  tauxOccupationAccueilDeJour: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  tauxOccupationHébergementPermanent: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  tauxOccupationHébergementTemporaire: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  tauxRéalisationActivité: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
}>
