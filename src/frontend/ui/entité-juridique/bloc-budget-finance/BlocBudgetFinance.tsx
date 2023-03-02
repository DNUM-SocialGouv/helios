import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { DeuxHistogrammeHorizontaux } from "../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Select } from "../../commun/Select/Select";
import { ContenuCompteDeRésultat } from "../../établissement-territorial-médico-social/InfoBulle/ContenuCompteDeRésultat";
import { EntitéJuridiqueBudgetFinanceViewModel } from "./EntitéJuridiqueBudgetFinanceViewModel";

type BlocBudgetFinanceProps = Readonly<{
  entitéJuridiqueBudgetFinanceViewModel: EntitéJuridiqueBudgetFinanceViewModel;
}>;

const ListeDéroulanteDesAnnéesDuCompteDeRésultat = ({
  entitéJuridiqueBudgetFinanceViewModel,
  setAnnéeEnCours,
}: BlocBudgetFinanceProps & { setAnnéeEnCours: Dispatch<SetStateAction<number>> }) => {
  const { wording } = useDependencies();
  const annéesRangéesAntéChronologiquement = entitéJuridiqueBudgetFinanceViewModel.annéesRangéesParAntéChronologie();

  if (annéesRangéesAntéChronologiquement.length > 0) {
    return (
      <Select
        label={wording.ANNÉE}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          setAnnéeEnCours(Number(event.target.value));
        }}
        options={annéesRangéesAntéChronologiquement}
      />
    );
  }

  return <></>;
};

export const BlocBudgetFinance = ({ entitéJuridiqueBudgetFinanceViewModel }: BlocBudgetFinanceProps) => {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(entitéJuridiqueBudgetFinanceViewModel.annéeInitiale);
  const budgetEtFinance = entitéJuridiqueBudgetFinanceViewModel.budgetEtFinanceEnCours(annéeEnCours);

  if (entitéJuridiqueBudgetFinanceViewModel.lesDonnéesBudgetEtFinanceNesontPasRenseignées) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_BUDGET_ET_FINANCES} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_BUDGET_ET_FINANCES}>
      <ul className="indicateurs">
        <IndicateurGraphique
          années={
            <ListeDéroulanteDesAnnéesDuCompteDeRésultat
              entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueBudgetFinanceViewModel}
              setAnnéeEnCours={setAnnéeEnCours}
            />
          }
          contenuInfoBulle={<ContenuCompteDeRésultat dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour} source={wording.CNSA} />}
          dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour}
          identifiant="budget-et-finances-compte-de-résultat"
          nomDeLIndicateur={<>{wording.COMPTE_DE_RÉSULTAT}</>}
          source={wording.CNSA}
        >
          <DeuxHistogrammeHorizontaux
            annéesManquantes={entitéJuridiqueBudgetFinanceViewModel.lesAnnéesManquantesDuCompteDeRésultat()}
            entêtePremièreColonne={wording.TITRE_BUDGÉTAIRE}
            entêtesDesAutresColonnes={entitéJuridiqueBudgetFinanceViewModel.entêtesColonnes()}
            libellés={entitéJuridiqueBudgetFinanceViewModel.libellés()}
            nombreDAnnéeTotale={5}
            ratioLargeurSurHauteur={2}
            valeursDeDroite={entitéJuridiqueBudgetFinanceViewModel.produitsPrincipaux(budgetEtFinance)}
            valeursDeGauche={entitéJuridiqueBudgetFinanceViewModel.chargesPrincipales(budgetEtFinance)}
          />
        </IndicateurGraphique>
      </ul>
    </Bloc>
  );
};
