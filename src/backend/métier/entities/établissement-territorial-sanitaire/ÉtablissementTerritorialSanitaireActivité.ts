export type ÉtablissementTerritorialSanitaireActivité = Readonly<{
  année: number
  dateMiseAJourSource: string
  nombreDePassagesAuxUrgences: {
    dateMiseAJourSource: string
    value: number | null
  }
  nombreJournéesCompletePsy: {
    dateMiseAJourSource: string
    value: number | null
  }
  nombreJournéesCompletesSsr: {
    dateMiseAJourSource: string
    value: number | null
  }
  nombreJournéesPartiellesPsy: {
    dateMiseAJourSource: string
    value: number | null
  }
  nombreJournéesPartielsSsr: {
    dateMiseAJourSource: string
    value: number | null
  }
  nombreSéjoursCompletsChirurgie: {
    dateMiseAJourSource: string
    value: number | null
  }
  nombreSéjoursCompletsMédecine: {
    dateMiseAJourSource: string
    value: number | null
  }
  nombreSéjoursCompletsObstétrique: {
    dateMiseAJourSource: string
    value: number | null
  }
  nombreSéjoursPartielsChirurgie: {
    dateMiseAJourSource: string
    value: number | null
  }
  nombreSéjoursPartielsMédecine: {
    dateMiseAJourSource: string
    value: number | null
  }
  nombreSéjoursPartielsObstétrique: {
    dateMiseAJourSource: string
    value: number | null
  }
  numéroFinessÉtablissementTerritorial: string
}>
