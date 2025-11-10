import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { ChangeEvent, useEffect, useState } from "react";

import { NombreDeJourneesPsySSRViewModel } from "./NombreDeJourneesPsySSRViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeMensuelFilters } from "../../commun/Graphique/HistogrammeMensuelFilters";
import { HistogrammeVerticalABandes } from "../../commun/Graphique/HistogrammeVerticalABandes";
import { ActivitesMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";

type NombreDeSejourMCOHistogrammesProps = Readonly<{
  etabTitle: string;
  etabFiness: string;
  nomGraph: string;
  nombreDeJourneePsySsrViewModel: NombreDeJourneesPsySSRViewModel;
  activitéMensuelleViewModel: ActivitesMensuelViewModel;
  selectedFrequency: string;
  onFrequencyChange: (event: ChangeEvent<HTMLInputElement>) => void;
}>;


export const NombreDeJournneesPsySsrHistogrammes = ({ etabTitle, etabFiness, nomGraph, nombreDeJourneePsySsrViewModel, activitéMensuelleViewModel, selectedFrequency, onFrequencyChange }: NombreDeSejourMCOHistogrammesProps) => {
  const { wording } = useDependencies();

  const [annéeEnCours, setAnnéeEnCours] = useState<number>(activitéMensuelleViewModel.annees[activitéMensuelleViewModel.annees.length - 1]);
  const [selectedActivity, setSelectedActivity] = useState(wording.SSR);

  useEffect(() => {
    setAnnéeEnCours(activitéMensuelleViewModel.annees[activitéMensuelleViewModel.annees.length - 1]);
  }, [selectedFrequency])

  const activitesPsySsr = [wording.SSR, wording.PSYCHIATRIE];

  return (
    <>
      <HistogrammeMensuelFilters
        ListeActivites={activitesPsySsr}
        ListeAnnees={activitéMensuelleViewModel.annees}
        handleFrequency={onFrequencyChange}
        identifiant="PsySSR"
        selectedActivity={selectedActivity}
        selectedFrequency={selectedFrequency}
        setAnnéeEnCours={setAnnéeEnCours}
        setSelectedActivity={setSelectedActivity}
        wording={wording}
      />
      {selectedFrequency === wording.ANNUEL ?
        <HistogrammeVerticalABandes
          annéesTotales={nombreDeJourneePsySsrViewModel.NOMBRE_ANNEES}
          cacheLesValeursBasse={true}
          créeLeLibelléDuTooltip={nombreDeJourneePsySsrViewModel.tooltipJournéesPsyEtSsr}
          data={nombreDeJourneePsySsrViewModel.histogrammeDataSet}
          etabFiness={etabFiness}
          etabTitle={etabTitle}
          grapheMensuel={false}
          id={nombreDeJourneePsySsrViewModel.identifiantDeLaLégendeDesJournéesPsyEtSsr}
          idDeLaLégende={nombreDeJourneePsySsrViewModel.identifiantDeLaLégendeDesJournéesPsyEtSsr}
          identifiants={nombreDeJourneePsySsrViewModel.identifiants}
          libellés={nombreDeJourneePsySsrViewModel.années}
          nomGraph={nomGraph}
          valeurs={nombreDeJourneePsySsrViewModel.valeurs}
        />
        :
        <HistogrammeVerticalABandes
          annéesTotales={12}
          cacheLesValeursBasse={true}
          créeLeLibelléDuTooltip={nombreDeJourneePsySsrViewModel.tooltipJournéesPsyEtSsr}
          data={activitéMensuelleViewModel.getHistogrammePsySsrDataSet(annéeEnCours, selectedActivity)}
          etabFiness={etabFiness}
          etabTitle={etabTitle}
          grapheMensuel={true}
          id={activitéMensuelleViewModel.identifiantDeLaLégendeDesSéjoursMensuelPsySsr}
          idDeLaLégende={activitéMensuelleViewModel.identifiantDeLaLégendeDesSéjoursMensuelPsySsr}
          identifiants={activitéMensuelleViewModel.getIdentifiantTablePsyIndicateur()}
          libellés={activitéMensuelleViewModel.listeDesMois}
          nomGraph={nomGraph}
          valeurs={activitéMensuelleViewModel.getValeurTablePsyIndicateur(annéeEnCours)}
        />
      }
    </>
  );
};
