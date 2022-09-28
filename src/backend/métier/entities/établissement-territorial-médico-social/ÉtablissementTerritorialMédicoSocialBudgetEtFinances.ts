export type ÉtablissementTerritorialMédicoSocialBudgetEtFinances = Readonly<{
  année: number
  cadreBudgétaire: string
  chargesEtProduits: Readonly<{
    dateMiseÀJourSource: string
    charges: number
    produits: number
  } | null>
  contributionAuxFraisDeSiège: Readonly<{
    dateMiseÀJourSource: string
    valeur: number
  } | null>
  recettesEtDépenses: Readonly<{
    dateMiseÀJourSource: string
    dépensesGroupe1: number
    dépensesGroupe2: number
    dépensesGroupe3: number
    recettesGroupe1: number
    recettesGroupe2: number
    recettesGroupe3: number
  } | null>
  résultatNetComptable: Readonly<{
    dateMiseÀJourSource: string
    valeur: number
  } | null>
  tauxDeCafNette: Readonly<{
    dateMiseÀJourSource: string
    valeur: number
  } | null>
  tauxDeVétustéConstruction: Readonly<{
    dateMiseÀJourSource: string
    valeur: number
  } | null>
}>
