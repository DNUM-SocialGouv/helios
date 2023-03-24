import { CadreBudgétaire } from "../../src/backend/métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import { BudgetEtFinancesMédicoSocialModel } from "../models/BudgetEtFinancesMédicoSocialModel";

export class ÉtablissementTerritorialBudgetEtFinancesModelTestBuilder {
  public static créeMédicoSocial(
    cadreBudgétaire: CadreBudgétaire,
    champsSurchargés?: Partial<BudgetEtFinancesMédicoSocialModel>
  ): BudgetEtFinancesMédicoSocialModel {
    const budgetEtFinancesMédicoSocialModel = new BudgetEtFinancesMédicoSocialModel();

    if (cadreBudgétaire === CadreBudgétaire.ERRD) {
      budgetEtFinancesMédicoSocialModel.année = champsSurchargés?.année || 2021;
      budgetEtFinancesMédicoSocialModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || "010000040";
      budgetEtFinancesMédicoSocialModel.contributionFraisDeSiègeGroupement = champsSurchargés?.contributionFraisDeSiègeGroupement || -20000;
      budgetEtFinancesMédicoSocialModel.dépensesGroupe1 = champsSurchargés?.dépensesGroupe1 || -129491.19;
      budgetEtFinancesMédicoSocialModel.dépensesGroupe2 = champsSurchargés?.dépensesGroupe2 || -2718457.1600000001;
      budgetEtFinancesMédicoSocialModel.dépensesGroupe3 = champsSurchargés?.dépensesGroupe3 || -406469.14999999997;
      budgetEtFinancesMédicoSocialModel.recettesGroupe1 = champsSurchargés?.recettesGroupe1 || 3388394.2000000002;
      budgetEtFinancesMédicoSocialModel.recettesGroupe2 = champsSurchargés?.recettesGroupe2 || 22231.200000000001;
      budgetEtFinancesMédicoSocialModel.recettesGroupe3 = champsSurchargés?.recettesGroupe3 || 129491.19;
      budgetEtFinancesMédicoSocialModel.résultatNetComptable = champsSurchargés?.résultatNetComptable || -38330.669999999503;
      budgetEtFinancesMédicoSocialModel.charges = champsSurchargés?.charges || null;
      budgetEtFinancesMédicoSocialModel.produits = champsSurchargés?.produits || null;
      budgetEtFinancesMédicoSocialModel.tauxDeCaf = champsSurchargés?.tauxDeCaf || 0.13548734436644624;
      budgetEtFinancesMédicoSocialModel.tauxDeVétustéConstruction = champsSurchargés?.tauxDeVétustéConstruction || 0.38845089702004892;
      budgetEtFinancesMédicoSocialModel.fondsDeRoulement = champsSurchargés?.fondsDeRoulement || 2206969.2599999998;
      budgetEtFinancesMédicoSocialModel.cadreBudgétaire = CadreBudgétaire.ERRD;
    } else if (cadreBudgétaire === CadreBudgétaire.CA_PH) {
      budgetEtFinancesMédicoSocialModel.année = champsSurchargés?.année || 2020;
      budgetEtFinancesMédicoSocialModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || "010000040";
      budgetEtFinancesMédicoSocialModel.contributionFraisDeSiègeGroupement = champsSurchargés?.contributionFraisDeSiègeGroupement || null;
      budgetEtFinancesMédicoSocialModel.dépensesGroupe1 = champsSurchargés?.dépensesGroupe1 || -16901.360000000001;
      budgetEtFinancesMédicoSocialModel.dépensesGroupe2 = champsSurchargés?.dépensesGroupe2 || -464929.67000000004;
      budgetEtFinancesMédicoSocialModel.dépensesGroupe3 = champsSurchargés?.dépensesGroupe3 || -51421.190000000002;
      budgetEtFinancesMédicoSocialModel.recettesGroupe1 = champsSurchargés?.recettesGroupe1 || 595042.94999999995;
      budgetEtFinancesMédicoSocialModel.recettesGroupe2 = champsSurchargés?.recettesGroupe2 || 17724.380000000001;
      budgetEtFinancesMédicoSocialModel.recettesGroupe3 = champsSurchargés?.recettesGroupe3 || 16484.099999999999;
      budgetEtFinancesMédicoSocialModel.résultatNetComptable = champsSurchargés?.résultatNetComptable || 95999.209999999963;
      budgetEtFinancesMédicoSocialModel.charges = champsSurchargés?.charges || null;
      budgetEtFinancesMédicoSocialModel.produits = champsSurchargés?.produits || null;
      budgetEtFinancesMédicoSocialModel.tauxDeCaf = champsSurchargés?.tauxDeCaf || 0.16460754444264256;
      budgetEtFinancesMédicoSocialModel.tauxDeVétustéConstruction = champsSurchargés?.tauxDeVétustéConstruction || 0.5319629026790017;
      budgetEtFinancesMédicoSocialModel.fondsDeRoulement = champsSurchargés?.fondsDeRoulement || null;
      budgetEtFinancesMédicoSocialModel.cadreBudgétaire = CadreBudgétaire.CA_PH;
    } else {
      budgetEtFinancesMédicoSocialModel.année = champsSurchargés?.année || 2020;
      budgetEtFinancesMédicoSocialModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || "010000040";
      budgetEtFinancesMédicoSocialModel.contributionFraisDeSiègeGroupement = champsSurchargés?.contributionFraisDeSiègeGroupement || null;
      budgetEtFinancesMédicoSocialModel.dépensesGroupe1 = champsSurchargés?.dépensesGroupe1 || null;
      budgetEtFinancesMédicoSocialModel.dépensesGroupe2 = champsSurchargés?.dépensesGroupe2 || null;
      budgetEtFinancesMédicoSocialModel.dépensesGroupe3 = champsSurchargés?.dépensesGroupe3 || null;
      budgetEtFinancesMédicoSocialModel.recettesGroupe1 = champsSurchargés?.recettesGroupe1 || null;
      budgetEtFinancesMédicoSocialModel.recettesGroupe2 = champsSurchargés?.recettesGroupe2 || null;
      budgetEtFinancesMédicoSocialModel.recettesGroupe3 = champsSurchargés?.recettesGroupe3 || null;
      budgetEtFinancesMédicoSocialModel.résultatNetComptable = champsSurchargés?.résultatNetComptable || 18887.12999999999;
      budgetEtFinancesMédicoSocialModel.charges = champsSurchargés?.charges || -177631.38999999998;
      budgetEtFinancesMédicoSocialModel.produits = champsSurchargés?.produits || 196518.51999999999;
      budgetEtFinancesMédicoSocialModel.tauxDeCaf = champsSurchargés?.tauxDeCaf || null;
      budgetEtFinancesMédicoSocialModel.tauxDeVétustéConstruction = champsSurchargés?.tauxDeVétustéConstruction || 0.31154835988672847;
      budgetEtFinancesMédicoSocialModel.fondsDeRoulement = champsSurchargés?.fondsDeRoulement || null;
      budgetEtFinancesMédicoSocialModel.cadreBudgétaire = CadreBudgétaire.CA_PA;
    }
    return budgetEtFinancesMédicoSocialModel;
  }
}
