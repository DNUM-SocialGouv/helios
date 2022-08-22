export type AutorisationMédicoSocialDatesEtCapacités = Readonly<{
  capacitéAutoriséeTotale: number
  capacitéInstalléeTotale: number
  dateDAutorisation: string
  dateDeDernièreInstallation: string
  dateDeMiseÀJourDAutorisation: string
  estInstallée: boolean
}>

export type AutorisationMédicoSocialClientèle = Readonly<{
  libellé: string
  code: string
  datesEtCapacités: AutorisationMédicoSocialDatesEtCapacités
}>

export type AutorisationMédicoSocialActivité = Readonly<{
  libellé: string
  code: string
  clientèles: AutorisationMédicoSocialClientèle[]
}>

export type AutorisationMédicoSocialDiscipline = Readonly<{
  libellé: string
  code: string
  activités: AutorisationMédicoSocialActivité[]
}>

export type ÉtablissementTerritorialMédicoSocialAutorisation = Readonly<{
  numéroFinessÉtablissementTerritorial: string
  disciplines: AutorisationMédicoSocialDiscipline[]
  dateMiseÀJourSource: string
}>
