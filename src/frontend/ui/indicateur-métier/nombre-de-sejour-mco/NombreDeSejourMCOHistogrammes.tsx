import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { ChangeEvent, useEffect, useState } from "react";

import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeMensuelFilters } from "../../commun/Graphique/HistogrammeMensuelFilters";
import { HistogrammeVerticalABandes } from "../../commun/Graphique/HistogrammeVerticalABandes";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";

type NombreDeSejourMCOHistogrammesProps = Readonly<{
  etabTitle: string;
  etabFiness: string;
  nomGraph: string;
  nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
  activitéMensuelleViewModel: ActivitesMensuelViewModel;
  selectedFrequency: string;
  onFrequencyChange: (event: ChangeEvent<HTMLInputElement>) => void;
}>;


export const NombreDeSejourMCOHistogrammes = ({ etabTitle, etabFiness, nomGraph, nombreDeSejourMCOViewModel, activitéMensuelleViewModel, selectedFrequency, onFrequencyChange }: NombreDeSejourMCOHistogrammesProps) => {
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
          etabFiness={etabFiness}
          etabTitle={etabTitle}
          grapheMensuel={false}
          id={nombreDeSejourMCOViewModel.identifiantDeLaLégendeDesSéjoursMCO}
          idDeLaLégende={nombreDeSejourMCOViewModel.identifiantDeLaLégendeDesSéjoursMCO}
          identifiants={nombreDeSejourMCOViewModel.getIdentifiantTableIndicateur()}
          libellés={nombreDeSejourMCOViewModel.années}
          nomGraph={nomGraph}
          valeurs={nombreDeSejourMCOViewModel.getValeurTableIndicateur()}
        />
        :
        <HistogrammeVerticalABandes
          annéesTotales={12}
          cacheLesValeursBasse={true}
          créeLeLibelléDuTooltip={nombreDeSejourMCOViewModel.tooltipSéjoursMCO}
          data={activitéMensuelleViewModel.getHistogrammeDataSet(annéeEnCours, selectedActivity)}
          etabFiness={etabFiness}
          etabTitle={etabTitle}
          grapheMensuel={true}
          id={activitéMensuelleViewModel.identifiantDeLaLégendeDesSéjoursMensuelMCO}
          idDeLaLégende={activitéMensuelleViewModel.identifiantDeLaLégendeDesSéjoursMensuelMCO}
          identifiants={activitéMensuelleViewModel.getIdentifiantTableIndicateur()}
          libellés={activitéMensuelleViewModel.listeDesMois}
          nomGraph={nomGraph}
          valeurs={activitéMensuelleViewModel.getValeurTableIndicateur(annéeEnCours)}
        />
      }
    </>
  );
};
