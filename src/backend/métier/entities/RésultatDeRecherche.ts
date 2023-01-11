export type Résultat = Readonly<{
  commune: string;
  département: string;
  numéroFiness: string;
  raisonSocialeCourte: string;
  type: string;
}>;

export type RésultatDeRecherche = Readonly<{
  nombreDeRésultats: number;
  résultats: Résultat[];
}>;
