import { useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { DeuxHistogrammesHorizontaux } from "../../commun/Graphique/DeuxHistogrammesHorizontaux";
import { SelectionAnnee } from "../../commun/Graphique/SelectionAnnee";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { ContenuCapacitéParActivités } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuCapacitéParActivités";
import { GraphiqueCapacitésParActivitéViewModel } from "./GraphiqueCapacitésParActivitéViewModel";

type GraphiqueCapacitésParActivitéProps = Readonly<{
  graphiqueCapacitésParActivitéViewModel: GraphiqueCapacitésParActivitéViewModel;
}>;

export const GraphiqueCapacitésParActivité = ({ graphiqueCapacitésParActivitéViewModel }: GraphiqueCapacitésParActivitéProps) => {
  const { wording } = useDependencies();
  const [annéeEnCours, setAnnéeEnCours] = useState<number>(graphiqueCapacitésParActivitéViewModel.annéeInitiale);

  const annees = graphiqueCapacitésParActivitéViewModel.filtrerLesAnnéesAvecDesCapacités();

  return (
    <IndicateurGraphique
      années={<SelectionAnnee annees={annees} setAnnéeEnCours={setAnnéeEnCours} />}
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
      <DeuxHistogrammesHorizontaux
        annéesManquantes={graphiqueCapacitésParActivitéViewModel.annéesManquantes()}
        nom={wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS}
        nombreDAnnéeTotale={graphiqueCapacitésParActivitéViewModel.NOMBRE_ANNEES}
        valeursDeDroite={graphiqueCapacitésParActivitéViewModel.valeursPlaces(annéeEnCours)}
        valeursDeGauche={graphiqueCapacitésParActivitéViewModel.valeursLits(annéeEnCours)}
      />
    </IndicateurGraphique>
  );
};
