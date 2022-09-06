export type AutorisationSanitaire = Readonly<{
  dateDAutorisation: string | null
  dateDeFin: string | null
  dateDeMiseEnOeuvre: string | null
  numéroArhgos: string
}>

export type AutorisationSanitaireForme = Readonly<{
  libellé: string
  code: string
  autorisationSanitaire: AutorisationSanitaire
}>

export type AutorisationSanitaireModalité = Readonly<{
  libellé: string
  code: string
  formes: AutorisationSanitaireForme[]
}>

export type AutorisationSanitaireActivité = Readonly<{
  libellé: string
  code: string
  modalités: AutorisationSanitaireModalité[]
}>

export type AutreActivitéSanitaire = Readonly<{
  dateDAutorisation: string | null
  dateDeFin: string | null
  dateDeMiseEnOeuvre: string | null
}>

export type AutreActivitéSanitaireForme = Readonly<{
  libellé: string
  code: string
  autreActivitéSanitaire: AutreActivitéSanitaire
}>

export type AutreActivitéSanitaireModalité = Readonly<{
  libellé: string
  code: string
  formes: AutreActivitéSanitaireForme[]
}>

export type AutreActivitéSanitaireActivité = Readonly<{
  libellé: string
  code: string
  modalités: AutreActivitéSanitaireModalité[]
}>

export type ReconnaissanceContractuelleSanitaire = Readonly<{
  capacitéAutorisée: number | null
  dateDEffetAsr: string | null
  dateDEffetCpom: string | null
  dateDeFinCpom: string | null
  numéroArhgos: string
  numéroCpom: string
}>

export type ReconnaissanceContractuelleSanitaireForme = Readonly<{
  libellé: string
  code: string
  reconnaissanceContractuelleSanitaire: ReconnaissanceContractuelleSanitaire
}>

export type ReconnaissanceContractuelleSanitaireModalité = Readonly<{
  libellé: string
  code: string
  formes: ReconnaissanceContractuelleSanitaireForme[]
}>

export type ReconnaissanceContractuelleSanitaireActivité = Readonly<{
  libellé: string
  code: string
  modalités: ReconnaissanceContractuelleSanitaireModalité[]
}>

export type AutorisationÉquipementMatérielLourd = Readonly<{
  numéroArhgos: string
  dateDAutorisation: string | null
  dateDeFin: string | null
  dateDeMiseEnOeuvre: string | null
}>

export type ÉquipementMatérielLourd = Readonly<{
  libellé: string
  code: string
  autorisations: AutorisationÉquipementMatérielLourd[]
}>

export type CapacitéSanitaire = Readonly<{
  dateMiseÀJourSource: string
  nombreDeLitsEnChirurgie: number | null
  nombreDeLitsEnMédecine: number | null
  nombreDeLitsEnObstétrique: number | null
  nombreDeLitsEnSsr: number | null
  nombreDeLitsOuPlacesEnPsyHospitalisationComplète: number | null
  nombreDeLitsEnUsld: number | null
  nombreDePlacesEnChirurgie: number | null
  nombreDePlacesEnMédecine: number | null
  nombreDePlacesEnObstétrique: number | null
  nombreDePlacesEnSsr: number | null
  nombreDePlacesEnPsyHospitalisationPartielle: number | null
}> | null

export type ÉtablissementTerritorialSanitaireAutorisationEtCapacité = Readonly<{
  numéroFinessÉtablissementTerritorial: string
  autorisations: {
    activités: AutorisationSanitaireActivité[]
    dateMiseÀJourSource: string
  },
  autresActivités: {
    activités: AutreActivitéSanitaireActivité[]
    dateMiseÀJourSource: string
  },
  capacités: CapacitéSanitaire,
  équipementsMatérielsLourds: {
    équipements: ÉquipementMatérielLourd[]
    dateMiseÀJourSource: string
  },
  reconnaissancesContractuelles: {
    activités: ReconnaissanceContractuelleSanitaireActivité[]
    dateMiseÀJourSource: string
  }
}>
