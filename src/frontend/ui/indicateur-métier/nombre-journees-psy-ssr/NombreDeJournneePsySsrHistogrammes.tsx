import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { ChangeEvent, useEffect, useState } from "react";

import { NombreDeJourneesPsySSRViewModel } from "./NombreDeJourneesPsySSRViewModel";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeMensuelFilters } from "../../commun/Graphique/HistogrammeMensuelFilters";
import { HistogrammeVerticalABandes } from "../../commun/Graphique/HistogrammeVerticalABandes";
import { ActivitésMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";

type NombreDeSejourMCOHistogrammesProps = Readonly<{
  nombreDeJourneePsySsrViewModel: NombreDeJourneesPsySSRViewModel;
  activitéMensuelleViewModel: ActivitésMensuelViewModel;
  selectedFrequency: string;
  onFrequencyChange: (event: ChangeEvent<HTMLInputElement>) => void;
}>;


export const NombreDeJournneesPsySsrHistogrammes = ({ nombreDeJourneePsySsrViewModel, activitéMensuelleViewModel, selectedFrequency, onFrequencyChange }: NombreDeSejourMCOHistogrammesProps) => {
  const { wording } = useDependencies();

  const [annéeEnCours, setAnnéeEnCours] = useState<number>(activitéMensuelleViewModel.annees[activitéMensuelleViewModel.annees.length - 1]);
  const [selectedActivity, setSelectedActivity] = useState(wording.SSR);

  useEffect(() => {
    setAnnéeEnCours(activitéMensuelleViewModel.annees[activitéMensuelleViewModel.annees.length - 1]);
  }, [selectedFrequency])

  const activitesPsySsr = [wording.SSR];

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
          grapheMensuel={false}
          id={nombreDeJourneePsySsrViewModel.identifiantDeLaLégendeDesJournéesPsyEtSsr}
          idDeLaLégende={nombreDeJourneePsySsrViewModel.identifiantDeLaLégendeDesJournéesPsyEtSsr}
          identifiants={nombreDeJourneePsySsrViewModel.identifiants}
          libellés={nombreDeJourneePsySsrViewModel.années}
          valeurs={nombreDeJourneePsySsrViewModel.valeurs}
        />
        :
        <HistogrammeVerticalABandes
          annéesTotales={12}
          cacheLesValeursBasse={true}
          créeLeLibelléDuTooltip={nombreDeJourneePsySsrViewModel.tooltipJournéesPsyEtSsr}
          data={activitéMensuelleViewModel.getHistogrammePsySsrDataSet(annéeEnCours, selectedActivity)}
          grapheMensuel={true}
          id={activitéMensuelleViewModel.identifiantDeLaLégendeDesSéjoursMensuelPsySsr}
          idDeLaLégende={activitéMensuelleViewModel.identifiantDeLaLégendeDesSéjoursMensuelPsySsr}
          identifiants={activitéMensuelleViewModel.getIdentifiantTablePsyIndicateur()}
          libellés={activitéMensuelleViewModel.listeDesMois}
          valeurs={activitéMensuelleViewModel.getValeurTablePsyIndicateur(annéeEnCours)}
        />
      }
    </>
  );
};
