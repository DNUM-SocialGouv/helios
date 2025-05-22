import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { ChangeEvent, useEffect, useState } from "react";

import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeMensuelFilters } from "../../commun/Graphique/HistogrammeMensuelFilters";
import { HistogrammeVerticalABandes } from "../../commun/Graphique/HistogrammeVerticalABandes";
import { ActivitésMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";

type NombreDeSejourMCOHistogrammesProps = Readonly<{
  nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
  activitéMensuelleViewModel: ActivitésMensuelViewModel;
  selectedFrequency: string;
  onFrequencyChange: (event: ChangeEvent<HTMLInputElement>) => void;
}>;


export const NombreDeSejourMCOHistogrammes = ({ nombreDeSejourMCOViewModel, activitéMensuelleViewModel, selectedFrequency, onFrequencyChange }: NombreDeSejourMCOHistogrammesProps) => {
  const { wording } = useDependencies();

  const [annéeEnCours, setAnnéeEnCours] = useState<number>(activitéMensuelleViewModel.annees[activitéMensuelleViewModel.annees.length - 1]);
  const [selectedActivity, setSelectedActivity] = useState(wording.MÉDECINE);

  useEffect(() => {
    setAnnéeEnCours(activitéMensuelleViewModel.annees[activitéMensuelleViewModel.annees.length - 1]);
  }, [selectedFrequency])

  const activitesMCO = [wording.MÉDECINE, wording.CHIRURGIE, wording.OBSTÉTRIQUE];

  return (
    <>
      <HistogrammeMensuelFilters
        ListeActivites={activitesMCO}
        ListeAnnees={activitéMensuelleViewModel.annees}
        handleFrequency={onFrequencyChange}
        identifiant="MCO"
        selectedActivity={selectedActivity}
        selectedFrequency={selectedFrequency}
        setAnnéeEnCours={setAnnéeEnCours}
        setSelectedActivity={setSelectedActivity}
        wording={wording}
      />
      {selectedFrequency === wording.ANNUEL ?
        <HistogrammeVerticalABandes
          annéesTotales={nombreDeSejourMCOViewModel.NOMBRE_ANNEES}
          cacheLesValeursBasse={true}
          créeLeLibelléDuTooltip={nombreDeSejourMCOViewModel.tooltipSéjoursMCO}
          data={nombreDeSejourMCOViewModel.getHistogrammeDataSet()}
          grapheMensuel={false}
          id={nombreDeSejourMCOViewModel.identifiantDeLaLégendeDesSéjoursMCO}
          idDeLaLégende={nombreDeSejourMCOViewModel.identifiantDeLaLégendeDesSéjoursMCO}
          identifiants={nombreDeSejourMCOViewModel.getIdentifiantTableIndicateur()}
          libellés={nombreDeSejourMCOViewModel.années}
          valeurs={nombreDeSejourMCOViewModel.getValeurTableIndicateur()}
        />
        :
        <HistogrammeVerticalABandes
          annéesTotales={12}
          cacheLesValeursBasse={true}
          créeLeLibelléDuTooltip={nombreDeSejourMCOViewModel.tooltipSéjoursMCO}
          data={activitéMensuelleViewModel.getHistogrammeDataSet(annéeEnCours, selectedActivity)}
          grapheMensuel={true}
          id={activitéMensuelleViewModel.identifiantDeLaLégendeDesSéjoursMensuelMCO}
          idDeLaLégende={activitéMensuelleViewModel.identifiantDeLaLégendeDesSéjoursMensuelMCO}
          identifiants={activitéMensuelleViewModel.getIdentifiantTableIndicateur()}
          libellés={activitéMensuelleViewModel.listeDesMois}
          valeurs={activitéMensuelleViewModel.getValeurTableIndicateur(annéeEnCours)}
        />
      }
    </>
  );
};
