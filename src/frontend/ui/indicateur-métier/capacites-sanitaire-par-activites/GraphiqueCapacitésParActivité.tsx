import { useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammesHorizontaux } from "../../commun/Graphique/HistogrammesHorizontaux";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuCapacitéParActivités } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuCapacitéParActivités";
import { GraphiqueCapacitésParActivitéViewModel } from "./GraphiqueCapacitésParActivitéViewModel";

type GraphiqueCapacitésParActivitéProps = Readonly<{
  graphiqueCapacitésParActivitéViewModel: GraphiqueCapacitésParActivitéViewModel;
  estEntitéJuridique?: boolean;
}>;

export const GraphiqueCapacitésParActivité = ({ graphiqueCapacitésParActivitéViewModel, estEntitéJuridique = false }: GraphiqueCapacitésParActivitéProps) => {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(graphiqueCapacitésParActivitéViewModel.annéeInitiale);

  const annees = graphiqueCapacitésParActivitéViewModel.annéesAvecDonnées();

  return (
    <IndicateurGraphique
      années={{ liste: annees, setAnnéeEnCours }}
      contenuInfoBulle={
        <ContenuCapacitéParActivités
          dateDeMiseÀJour={graphiqueCapacitésParActivitéViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
          estEntitéJuridique
          source={wording.SAE}
        />
      }
      dateDeMiseÀJour={graphiqueCapacitésParActivitéViewModel.dateDeMiseÀJourDeLaCapacitéInstalléeParActivités}
      identifiant="capacite-sanitaire"
      nomDeLIndicateur={estEntitéJuridique ? wording.CAPACITÉ_INSTALLÉE_EJ : wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
      source={wording.SAE}
    >
      <HistogrammesHorizontaux
        annéesManquantes={graphiqueCapacitésParActivitéViewModel.annéesManquantes()}
        nom={wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
        nombreDAnnéeTotale={graphiqueCapacitésParActivitéViewModel.NOMBRE_ANNEES}
        valeursDesHistogrammes={[
          graphiqueCapacitésParActivitéViewModel.valeursLits(annéeEnCours),
          graphiqueCapacitésParActivitéViewModel.valeursPlaces(annéeEnCours),
        ]}
      />
    </IndicateurGraphique>
  );
};
