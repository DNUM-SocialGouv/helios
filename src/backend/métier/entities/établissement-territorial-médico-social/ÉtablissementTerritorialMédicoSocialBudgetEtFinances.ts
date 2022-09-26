export type ÉtablissementTerritorialMédicoSocialBudgetEtFinances = Readonly<{
  année: number
  cadreBudgétaire: string
  charges: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  contributionAuxFraisDeSiège: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  dépensesGroupe1: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  dépensesGroupe2: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  dépensesGroupe3: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  produits: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  recettesGroupe1: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  recettesGroupe2: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  recettesGroupe3: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  résultatNetComptable: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  tauxDeCafNette: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
  tauxDeVétustéConstruction: Readonly<{
    dateMiseÀJourSource: string
    value: number | null
  }>
}>
