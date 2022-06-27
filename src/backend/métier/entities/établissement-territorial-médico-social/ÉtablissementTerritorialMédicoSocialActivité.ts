export type ÉtablissementTerritorialMédicoSocialActivité = Readonly<{
  année: number
  numéroFinessÉtablissementTerritorial: string
  tauxDOccupationDesLitsAutorisésEnAccueil: number
  tauxDOccupationDesLitsAutorisésEnHébergementTemporaire: number
  tauxDOccupationDesPlacesAutoriséesEnHébergementPermanent: number
  tauxDeRéalisationDeLActivité: number
  fileActiveDesPersonnesAccompagnésSurPériode: number
  nombreMoyenJournéeAbsenceDesPersonnesAccompagnésSurPériode: number
  duréeMoyenneSéjourDesPersonnesSortiesDéfinitivement: number
}>
