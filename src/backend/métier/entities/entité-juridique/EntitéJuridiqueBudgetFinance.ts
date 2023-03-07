export type EntitéJuridiqueBudgetFinance = {
  dateMiseÀJourSource: string;
  année: number;

  depensesTitreIGlobal: number | null;
  depensesTitreIIGlobal: number | null;
  depensesTitreIIIGlobal: number | null;
  depensesTitreIVGlobal: number | null;
  totalDepensesGlobal: number;

  recettesTitreIGlobal: number | null;
  recettesTitreIIGlobal: number | null;
  recettesTitreIIIGlobal: number | null;
  recettesTitreIVGlobal: number | null;
  totalRecettesGlobal: number;

  depensesTitreIH: number | null;
  depensesTitreIIH: number | null;
  depensesTitreIIIH: number | null;
  depensesTitreIVH: number | null;
  totalDepensesH: number;

  recettesTitreIH: number | null;
  recettesTitreIIH: number | null;
  recettesTitreIIIH: number | null;
  totalRecettesH: number;

  depensesTitreIPrincipale: number | null;
  depensesTitreIIPrincipale: number | null;
  depensesTitreIIIPrincipale: number | null;
  depensesTitreIVPrincipale: number | null;
  totalDepensesPrincipale: number;

  recettesTitreIPrincipale: number | null;
  recettesTitreIIPrincipale: number | null;
  recettesTitreIIIPrincipale: number | null;
  recettesTitreIVPrincipale: number | null;
  totalRecettesPrincipale: number;
};
