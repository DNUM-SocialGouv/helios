import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js";
import { Context } from "chartjs-plugin-datalabels";
import { ChangeEvent, Dispatch, ReactElement, SetStateAction, useState } from "react";
import { Bar } from "react-chartjs-2";

import { Wording } from "../../../configuration/wording/Wording";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { DeuxHistogrammeHorizontaux } from "../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { MiseEnExergue } from "../../commun/MiseEnExergue/MiseEnExergue";
import { Select } from "../../commun/Select/Select";
import { StringFormater } from "../../commun/StringFormater";
import { Transcription } from "../../commun/Transcription/Transcription";
import { ContenuCompteDeRésultat } from "../../établissement-territorial-médico-social/InfoBulle/ContenuCompteDeRésultat";
import { CompteDeResultatViewModel } from "./CompteDeResultatViewModel";

type BlocBudgetEtFinancesMédicoSocialProps = Readonly<{
  compteDeRésultatViewModel: CompteDeResultatViewModel;
}>;

const ListeDéroulanteDesAnnéesDuCompteDeRésultat = ({
  compteDeRésultatViewModel,
  setAnnéeEnCours,
}: BlocBudgetEtFinancesMédicoSocialProps & { setAnnéeEnCours: Dispatch<SetStateAction<number>> }) => {
  const { wording } = useDependencies();
  const annéesRangéesAntéChronologiquement = compteDeRésultatViewModel.annéesRangéesParAntéChronologie();

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

export const GraphiqueCompteDeResultat = ({ compteDeRésultatViewModel }: BlocBudgetEtFinancesMédicoSocialProps) => {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(compteDeRésultatViewModel.annéeInitiale);
  const budgetEtFinance = compteDeRésultatViewModel.budgetEtFinanceEnCours(annéeEnCours);

  return (
    <IndicateurGraphique
      années={<ListeDéroulanteDesAnnéesDuCompteDeRésultat compteDeRésultatViewModel={compteDeRésultatViewModel} setAnnéeEnCours={setAnnéeEnCours} />}
      contenuInfoBulle={<ContenuCompteDeRésultat dateDeMiseÀJour={compteDeRésultatViewModel.dateMiseÀJour} source={wording.CNSA} />}
      dateDeMiseÀJour={compteDeRésultatViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-compte-de-résultat"
      nomDeLIndicateur={<>{compteDeRésultatViewModel.intituléDuCompteDeRésultat(annéeEnCours)}</>}
      source={wording.CNSA}
    >
      <DeuxHistogrammeHorizontaux
        annéesManquantes={compteDeRésultatViewModel.lesAnnéesManquantesDuCompteDeRésultat()}
        entêtePremièreColonne={wording.TITRE_BUDGÉTAIRE}
        entêtesDesAutresColonnes={compteDeRésultatViewModel.entêtesDesAutresColonnes(budgetEtFinance)}
        libellés={compteDeRésultatViewModel.libellés(budgetEtFinance)}
        nombreDAnnéeTotale={3}
        ratioLargeurSurHauteur={compteDeRésultatViewModel.ratioHistogramme(budgetEtFinance)}
        valeursDeDroite={compteDeRésultatViewModel.recettesOuProduits(budgetEtFinance)}
        valeursDeGauche={compteDeRésultatViewModel.dépensesOuCharges(budgetEtFinance)}
      />
    </IndicateurGraphique>
  );
};
