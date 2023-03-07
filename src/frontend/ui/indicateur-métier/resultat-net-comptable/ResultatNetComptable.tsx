import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { IndicateurTabulaire } from "../../commun/IndicateurTabulaire/IndicateurTabulaire";
import { ContenuRésultatNetComptable } from "../../établissement-territorial-médico-social/InfoBulle/ContenuRésultatNetComptable";
import { ResultatNetComptableViewModel } from "./ResultatNetComptableViewModel";

type BlocBudgetFinanceProps = Readonly<{
  resultatNetComptableViewModel: ResultatNetComptableViewModel;
}>;

export function ResultatNetComptable({ resultatNetComptableViewModel }: BlocBudgetFinanceProps) {
  const { wording } = useDependencies();
  // const budgetEtFinance = entitéJuridiqueBudgetFinanceViewModel.annéesRangéesParAntéChronologie;
  return (
    <IndicateurGraphique
      contenuInfoBulle={<ContenuRésultatNetComptable dateDeMiseÀJour={resultatNetComptableViewModel.dateMiseÀJour} source={wording.CNSA} />}
      dateDeMiseÀJour={resultatNetComptableViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-résultat-net-comptable"
      nomDeLIndicateur={wording.RÉSULTAT_NET_COMPTABLE}
      source={wording.CNSA}
    >
      <IndicateurTabulaire
        annéesManquantes={resultatNetComptableViewModel.lesAnnéesManquantesDuCompteDeRésultat()}
        valeursParAnnée={resultatNetComptableViewModel.resultatNetComptable()}
      />
    </IndicateurGraphique>
  );
}

export type valeursResultatNetCompatable = {
  année: number;
  valeur: string;
};
