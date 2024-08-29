import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { ChangeEvent, useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeMensuelFilters } from "../../commun/Graphique/HistogrammeMensuelFilters";
import { HistogrammeVerticalABandes } from "../../commun/Graphique/HistogrammeVerticalABandes";
import { ActivitésMensuelViewModel } from "../../entité-juridique/bloc-activité/EntitéJuridiqueActivitésMensuelsViewModel";
import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";

type NombreDeSejourMCOHistogrammesProps = Readonly<{
    nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
    activitéMensuelleViewModel: ActivitésMensuelViewModel;
}>;


export const NombreDeSejourMCOHistogrammes = ({ nombreDeSejourMCOViewModel, activitéMensuelleViewModel }: NombreDeSejourMCOHistogrammesProps) => {
    const { wording } = useDependencies();
    const [selectedFrequency, setSelectedFrequency] = useState(wording.ANNUEL);

    const [annéeEnCours, setAnnéeEnCours] = useState<number>(activitéMensuelleViewModel.annees[activitéMensuelleViewModel.annees.length - 1]);
    const [selectedActivity, setSelectedActivity] = useState(wording.MÉDECINE);

    const handleFrequency = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedFrequency(event.target.value);
    }

    const activitesMCO = [wording.MÉDECINE, wording.CHIRURGIE, wording.OBSTÉTRIQUE];

    return (
        <>
            <HistogrammeMensuelFilters
                ListeActivites={activitesMCO}
                ListeAnnees={activitéMensuelleViewModel.annees}
                handleFrequency={handleFrequency}
                identifiant="MCO"
                selectedFrequency={selectedFrequency}
                setAnnéeEnCours={setAnnéeEnCours}
                setSelectedActivity={setSelectedActivity}
                wording={wording}
            />
            {selectedFrequency === wording.ANNUEL ?
                <HistogrammeVerticalABandes
                    annéesTotales={nombreDeSejourMCOViewModel.NOMBRE_ANNEES}
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
