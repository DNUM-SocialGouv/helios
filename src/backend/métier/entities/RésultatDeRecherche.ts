type Résultat = Readonly<{
  numéroFiness: string
  raisonSociale: string
  type: string
}>

export type RésultatDeRecherche = Readonly<{
  nombreDeRésultats: number
  résultats: Résultat[]
}>
