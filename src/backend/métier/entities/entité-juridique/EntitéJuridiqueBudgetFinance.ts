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

  depensesTitreIPrincipales: number | null;
  depensesTitreIIPrincipales: number | null;
  depensesTitreIIIPrincipales: number | null;
  depensesTitreIVPrincipales: number | null;
  totalDepensesPrincipales: number;

  recettesTitreIPrincipales: number | null;
  recettesTitreIIPrincipales: number | null;
  recettesTitreIIIPrincipales: number | null;
  totalRecettesPrincipales: number;

  depensesTitreIAnnexe: number | null;
  depensesTitreIIAnnexe: number | null;
  depensesTitreIIIAnnexe: number | null;
  depensesTitreIVAnnexe: number | null;
  totalDepensesAnnexe: number;

  recettesTitreIAnnexe: number | null;
  recettesTitreIIAnnexe: number | null;
  recettesTitreIIIAnnexe: number | null;
  recettesTitreIVAnnexe: number | null;
  totalRecettesAnnexe: number;
};
