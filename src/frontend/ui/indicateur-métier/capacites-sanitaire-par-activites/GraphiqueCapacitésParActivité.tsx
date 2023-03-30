import { useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuCapacitéParActivités } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuCapacitéParActivités";
import { GraphiqueCapacitésParActivitéViewModel } from "./GraphiqueCapacitésParActivitéViewModel";

type GraphiqueCapacitésParActivitéProps = Readonly<{
  graphiqueCapacitésParActivitéViewModel: GraphiqueCapacitésParActivitéViewModel;
}>;
export const GraphiqueCapacitésParActivité = ({ graphiqueCapacitésParActivitéViewModel }: GraphiqueCapacitésParActivitéProps) => {
  const { wording } = useDependencies();
  const [annéeSelectionnée, setAnnéeSelectionnée] = useState<number>(graphiqueCapacitésParActivitéViewModel.annéeInitiale);

  return (
    <IndicateurGraphique
      années={graphiqueCapacitésParActivitéViewModel.listeDéroulanteDesAnnéesDesCapacités(setAnnéeSelectionnée)}
      contenuInfoBulle={
        <ContenuCapacitéParActivités
          dateDeMiseÀJour={graphiqueCapacitésParActivitéViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
          source={wording.SAE}
        />
      }
      dateDeMiseÀJour={graphiqueCapacitésParActivitéViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
      identifiant="capacite-sanitaire"
      nomDeLIndicateur={wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
      source={wording.SAE}
    >
      {graphiqueCapacitésParActivitéViewModel.capacitéParActivités(annéeSelectionnée)}
    </IndicateurGraphique>
  );
};
