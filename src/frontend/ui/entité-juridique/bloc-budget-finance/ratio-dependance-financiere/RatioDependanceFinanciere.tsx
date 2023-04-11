import React, { ReactElement } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { HistogrammeVertical } from "../../../commun/Graphique/HistogrammeVertical";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { RatioDependanceFinanciereViewModel } from "./RatioDependanceFinanciereViewModel";

type RationDependanceFinanciereProps = Readonly<{
  ratioDependanceFinanciereViewModel: RatioDependanceFinanciereViewModel;
}>;

function ContenuRatioDependanceFinancière(props: { dateDeMiseÀJour: any; source: ReactElement }): ReactElement {
  return <>{props.source}</>;
}

export function RatioDependanceFinanciere({ ratioDependanceFinanciereViewModel }: RationDependanceFinanciereProps) {
  const { wording } = useDependencies();
  const infoBulleContenu = <ContenuRatioDependanceFinancière dateDeMiseÀJour={ratioDependanceFinanciereViewModel.dateMiseÀJour} source={wording.CNSA} />;
  const sourceName = wording.CNSA;

  return ratioDependanceFinanciereViewModel.auMoinsUnRatioRenseigné() ? (
    <IndicateurGraphique
      contenuInfoBulle={infoBulleContenu}
      dateDeMiseÀJour={ratioDependanceFinanciereViewModel.dateMiseÀJour}
      identifiant="budget-et-finances-résultat-net-comptable"
      nomDeLIndicateur={wording.RATIO_DEPENDANCE_FINANCIERE}
      source={sourceName}
    >
      <HistogrammeVertical
        annéesTotales={ratioDependanceFinanciereViewModel.NOMBRE_ANNEES}
        couleursDeLHistogramme={ratioDependanceFinanciereViewModel.couleursDeLHistogramme}
        entêteLibellé={wording.ANNÉE}
        identifiant={wording.RATIO_DEPENDANCE_FINANCIERE}
        libellés={ratioDependanceFinanciereViewModel.années}
        libellésDesTicks={ratioDependanceFinanciereViewModel.construisLesLibellésDesTicks()}
        libellésDesValeurs={ratioDependanceFinanciereViewModel.construisLesLibellésDesValeurs()}
        valeurs={ratioDependanceFinanciereViewModel.valeurs}
      />
    </IndicateurGraphique>
  ) : null;
}
