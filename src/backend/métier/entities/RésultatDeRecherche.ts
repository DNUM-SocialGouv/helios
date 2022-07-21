export type Résultat = Readonly<{
  commune: string
  département: string
  numéroFiness: string
  raisonSociale: string
  type: string
}>

export type RésultatDeRecherche = Readonly<{
  nombreDeRésultats: number
  résultats: Résultat[]
}>
