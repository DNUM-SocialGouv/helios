import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { ChangeEvent, useEffect, useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeMensuelFilters } from "../../commun/Graphique/HistogrammeMensuelFilters";
import { HistogrammeVerticalABandes } from "../../commun/Graphique/HistogrammeVerticalABandes";
import { ActivitésMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { NombreDeJourneesPsySSRViewModel } from "./NombreDeJourneesPsySSRViewModel";

type NombreDeSejourMCOHistogrammesProps = Readonly<{
    nombreDeJourneePsySsrViewModel: NombreDeJourneesPsySSRViewModel;
    activitéMensuelleViewModel: ActivitésMensuelViewModel;
}>;


export const NombreDeJournneesPsySsrHistogrammes = ({ nombreDeJourneePsySsrViewModel, activitéMensuelleViewModel }: NombreDeSejourMCOHistogrammesProps) => {
    const { wording } = useDependencies();
    const [selectedFrequency, setSelectedFrequency] = useState(wording.ANNUEL);

    const [annéeEnCours, setAnnéeEnCours] = useState<number>(activitéMensuelleViewModel.annees[activitéMensuelleViewModel.annees.length - 1]);
    const [selectedActivity, setSelectedActivity] = useState(wording.SSR);

    useEffect(() => {
        setAnnéeEnCours(activitéMensuelleViewModel.annees[activitéMensuelleViewModel.annees.length - 1]);
    }, [selectedFrequency])

    const handleFrequency = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedFrequency(event.target.value);
    }

    const activitesPsySsr = [wording.SSR];

    return (
        <>
            <HistogrammeMensuelFilters
                ListeActivites={activitesPsySsr}
                ListeAnnees={activitéMensuelleViewModel.annees}
                handleFrequency={handleFrequency}
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
