import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { DeuxHistogrammesHorizontauxNew } from "../../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { Select } from "../../../commun/Select/Select";
import { ContenuCompteDeRésultatEJ } from "../../info-bulle/ContenuCompteDeRésultatEJ";
import { EntitéJuridiqueBudgetFinanceViewModel } from "../EntitéJuridiqueBudgetFinanceViewModel";

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

export function CompteDeResultat({ entitéJuridiqueBudgetFinanceViewModel }: BlocBudgetFinanceProps) {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(entitéJuridiqueBudgetFinanceViewModel.annéeInitiale);
  const budgetEtFinance = entitéJuridiqueBudgetFinanceViewModel.budgetEtFinanceEnCours(annéeEnCours);

  return (
    <IndicateurGraphique
      années={
        <ListeDéroulanteDesAnnéesDuCompteDeRésultat
          entitéJuridiqueBudgetFinanceViewModel={entitéJuridiqueBudgetFinanceViewModel}
          setAnnéeEnCours={setAnnéeEnCours}
        />
      }
      contenuInfoBulle={<ContenuCompteDeRésultatEJ dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour} source={wording.ANCRE} />}
      dateDeMiseÀJour={entitéJuridiqueBudgetFinanceViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-compte-de-résultat"
      nomDeLIndicateur={<>{wording.COMPTE_DE_RÉSULTAT}</>}
      source={wording.ANCRE}
    >
      <DeuxHistogrammesHorizontauxNew
        annéesManquantes={entitéJuridiqueBudgetFinanceViewModel.lesAnnéesManquantesDuCompteDeRésultat()}
        entêteDroite={wording.PRODUITS}
        entêteGauche={wording.CHARGES}
        nombreDAnnéeTotale={entitéJuridiqueBudgetFinanceViewModel.NOMBRE_ANNEES}
        valeursDeDroite={entitéJuridiqueBudgetFinanceViewModel.dataGraphiqueProduits(budgetEtFinance)}
        valeursDeGauche={entitéJuridiqueBudgetFinanceViewModel.dataGraphiqueCharges(budgetEtFinance)}
      />
    </IndicateurGraphique>
  );
}
