export type Indicateur = Readonly<{
  dateMiseÀJourSource: string;
  valeur: number | null | '';
}>;
export type ÉtablissementTerritorialMédicoSocialBudgetEtFinances = Readonly<{
  année: number;
  cadreBudgétaire: string;
  chargesEtProduits: Readonly<{
    dateMiseÀJourSource: string;
    charges: number | null;
    produits: number | null;
  }>;
  contributionAuxFraisDeSiège: Indicateur;
  fondsDeRoulement: Indicateur;
  recettesEtDépenses: Readonly<{
    dateMiseÀJourSource: string;
    dépensesGroupe1: number | null;
    dépensesGroupe2: number | null;
    dépensesGroupe3: number | null;
    recettesGroupe1: number | null;
    recettesGroupe2: number | null;
    recettesGroupe3: number | null;
  }>;
  résultatNetComptable: Indicateur;
  tauxDeCafNette: Indicateur;
  tauxDeVétustéConstruction: Indicateur;
}>;
