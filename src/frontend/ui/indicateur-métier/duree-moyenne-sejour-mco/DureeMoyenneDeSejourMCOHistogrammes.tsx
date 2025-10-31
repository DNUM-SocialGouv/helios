import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { ChangeEvent, useEffect, useState } from "react";

import { DureeMoyenneSejourMCOViewModel } from "./DureeMoyenneDeSejourMCOViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeMensuelFilters } from "../../commun/Graphique/HistogrammeMensuelFilters";
import { HistogrammeVerticalABandes } from "../../commun/Graphique/HistogrammeVerticalABandes";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";

type DureeMoyenneDeSejourMCOHistogrammesProps = Readonly<{
  dureeMoyenneDeSejourMCOViewModel: DureeMoyenneSejourMCOViewModel;
  activiteMensuelleViewModel: ActivitesMensuelViewModel;
  selectedFrequency: string;
  onFrequencyChange: (event: ChangeEvent<HTMLInputElement>) => void;
}>;


export const DureeMoyenneDeSejourMCOHistogrammes = ({ dureeMoyenneDeSejourMCOViewModel, activiteMensuelleViewModel, selectedFrequency, onFrequencyChange }: DureeMoyenneDeSejourMCOHistogrammesProps) => {
  const { wording } = useDependencies();

  const [annéeEnCours, setAnnéeEnCours] = useState<number>(activiteMensuelleViewModel.annees[activiteMensuelleViewModel.annees.length - 1]);
  const [selectedActivity, setSelectedActivity] = useState(wording.MÉDECINE);

  useEffect(() => {
    setAnnéeEnCours(activiteMensuelleViewModel.annees[activiteMensuelleViewModel.annees.length - 1]);
  }, [selectedFrequency])

  const activitesMCO = [wording.MÉDECINE, wording.CHIRURGIE, wording.OBSTÉTRIQUE];

  return (
    <>
      <HistogrammeMensuelFilters
        ListeActivites={activitesMCO}
        ListeAnnees={activiteMensuelleViewModel.annees}
        handleFrequency={onFrequencyChange}
        identifiant="duree-MCO"
        selectedActivity={selectedActivity}
        selectedFrequency={selectedFrequency}
        setAnnéeEnCours={setAnnéeEnCours}
        setSelectedActivity={setSelectedActivity}
        wording={wording}
      />
      {selectedFrequency === wording.ANNUEL ?
        <HistogrammeVerticalABandes
          annéesTotales={dureeMoyenneDeSejourMCOViewModel.NOMBRE_ANNEES}
          cacheLesValeursBasse={false}
          data={dureeMoyenneDeSejourMCOViewModel.getHistogrammeDataSet()}
          grapheMensuel={false}
          id={dureeMoyenneDeSejourMCOViewModel.identifiantDeLaLégendeDureeSejoursMCO}
          idDeLaLégende={dureeMoyenneDeSejourMCOViewModel.identifiantDeLaLégendeDureeSejoursMCO}
          identifiants={dureeMoyenneDeSejourMCOViewModel.getIdentifiantTableIndicateur()}
          legendeCentreeUneLigne={true}
          libellés={dureeMoyenneDeSejourMCOViewModel.années}
          valeurs={dureeMoyenneDeSejourMCOViewModel.getValeurTableIndicateur()}
        />
        :
        <HistogrammeVerticalABandes
          annéesTotales={12}
          cacheLesValeursBasse={false}
          data={activiteMensuelleViewModel.getHistogrammeMoyenneSejourDataSet(annéeEnCours, selectedActivity)}
          grapheMensuel={true}
          id={activiteMensuelleViewModel.identifiantDeLaLégendeDesSéjoursMensuelMCO}
          idDeLaLégende={activiteMensuelleViewModel.identifiantDeLaLégendeDesSéjoursMensuelMCO}
          identifiants={activiteMensuelleViewModel.getIdentifiantTableIndicateurDureeMoyenneMCO()}
          legendeCentreeUneLigne={true}
          libellés={activiteMensuelleViewModel.listeDesMois}
          valeurs={activiteMensuelleViewModel.getValeurTableIndicateurDureeMoyenneMCO(annéeEnCours)}
        />
      }
    </>
  );
};
