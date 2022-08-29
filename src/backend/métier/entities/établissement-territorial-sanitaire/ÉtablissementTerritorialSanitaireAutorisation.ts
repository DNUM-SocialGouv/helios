export type AutorisationSanitaireAvecDatesEtNuméroArhgos = Readonly<{
  dateDAutorisation: string | null
  dateDeFin: string | null
  dateDeMiseEnOeuvre: string | null
  numéroArhgos: string | null
}>

export type AutorisationSanitaireAvecDates = Readonly<{
  dateDAutorisation: string | null
  dateDeFin: string | null
  dateDeMiseEnOeuvre: string | null
}>

export type AutorisationSanitaireAvecDatesNuméroArhgosEtCapacité = Readonly<{
  capacitéAutorisée: number | null
  dateDEffetAsr: string | null
  dateDEffetCpom: string | null
  dateDeFinCpom: string | null
  numéroArhgos: string | null
  numéroCpom: string
}>

export type AutorisationSanitaireForme<T> = Readonly<{
  libellé: string
  code: string
  dates: T
}>

export type AutorisationSanitaireModalité<T> = Readonly<{
  libellé: string
  code: string
  formes: AutorisationSanitaireForme<T>[]
}>

export type AutorisationSanitaireActivité<T> = Readonly<{
  libellé: string
  code: string
  modalités: AutorisationSanitaireModalité<T>[]
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

export type AutorisationSanitaire = AutorisationSanitaireActivité<AutorisationSanitaireAvecDatesEtNuméroArhgos>
export type AutreActivitéSanitaire = AutorisationSanitaireActivité<AutorisationSanitaireAvecDates>
export type ReconnaissanceContractuelleSanitaire = AutorisationSanitaireActivité<AutorisationSanitaireAvecDatesNuméroArhgosEtCapacité>

export type ÉtablissementTerritorialSanitaireAutorisationEtCapacité = Readonly<{
  numéroFinessÉtablissementTerritorial: string
  autorisations: {
    activités: AutorisationSanitaire[]
    dateMiseÀJourSource: string
  },
  autresActivités: {
    activités: AutreActivitéSanitaire[]
    dateMiseÀJourSource: string
  },
  équipementsMatérielsLourds: {
    équipements: ÉquipementMatérielLourd[]
    dateMiseÀJourSource: string
  },
  reconnaissancesContractuelles: {
    activités: ReconnaissanceContractuelleSanitaire[]
    dateMiseÀJourSource: string
  }
}>
