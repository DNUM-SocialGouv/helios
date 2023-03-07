import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { IndicateurTabulaire } from "../../../commun/IndicateurTabulaire/IndicateurTabulaire";
import { ContenuRésultatNetComptable } from "../../../établissement-territorial-médico-social/InfoBulle/ContenuRésultatNetComptable";
import { EntitéJuridiqueBudgetFinanceViewModel } from "../EntitéJuridiqueBudgetFinanceViewModel";

type BlocBudgetFinanceProps = Readonly<{
  entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
}>;

// TODO move this to indicateur-metier
export function ResultatNetComptable({ entitéJuridiqueBudgetFinanceViewModel }: BlocBudgetFinanceProps) {
  const { wording } = useDependencies();
  // const budgetEtFinance = entitéJuridiqueBudgetFinanceViewModel.annéesRangéesParAntéChronologie;
  return (
    <IndicateurGraphique
      contenuInfoBulle={<ContenuRésultatNetComptable dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour} source={wording.CNSA} />}
      dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-résultat-net-comptable"
      nomDeLIndicateur={wording.RÉSULTAT_NET_COMPTABLE}
      source={wording.CNSA}
    >
      <IndicateurTabulaire
        annéesManquantes={entitéJuridiqueBudgetFinanceViewModel.lesAnnéesManquantesDuCompteDeRésultat()}
        valeursParAnnée={entitéJuridiqueBudgetFinanceViewModel.resultatNetComptable()}
      />
    </IndicateurGraphique>
  );
}

export type valeursResultatNetCompatable = {
  année: number;
  valeur: string;
};
