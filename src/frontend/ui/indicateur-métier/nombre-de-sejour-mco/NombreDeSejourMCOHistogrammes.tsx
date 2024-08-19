import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { ChangeEvent, useState } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";
import { HistogrammeVerticalABandes } from "../../commun/Graphique/HistogrammeVerticalABandes";
import { SelectionAnneeTags } from "../../commun/Graphique/SelectionAnneeTags";
import styles from "./GraphiqueNombreDeSejour.module.css";
import { NombreDeSejourMCOViewModel } from "./NombreDeSejourMCOViewModel";

type NombreDeSejourMCOHistogrammesProps = Readonly<{
    nombreDeSejourMCOViewModel: NombreDeSejourMCOViewModel;
}>;

const MontlyFilters = ({ nombreDeSejourMCOViewModel }: NombreDeSejourMCOHistogrammesProps) => {
    const { wording } = useDependencies();
    const [annéeEnCours, setAnnéeEnCours] = useState<number>(nombreDeSejourMCOViewModel.années[0]);
    const [selectedActivity, setSelectedActivity] = useState(wording.MÉDECINE);
    const handleOnChangeMCO = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedActivity(event.target.value)
    }
    const activitesMCO = [wording.MÉDECINE, wording.CHIRURGIE, wording.OBSTÉTRIQUE];
    return (
        <div className={styles["filtersgroup"]}>
            <SelectionAnneeTags annees={nombreDeSejourMCOViewModel.années} id="activite-mco-mensuel" prefix="" setAnnéeEnCours={setAnnéeEnCours} />
            <div className={`${styles["filterActiviteElement"]} fr-select-group`}>
                <label className="fr-label" htmlFor="select-hint"> Sélectinner une activité  </label>
                <select className="fr-select" id="select-hint" name="select-hint" onChange={handleOnChangeMCO} title='Activités MCO'>
                    {activitesMCO.map((activite) => (
                        <option key={activite} value={activite} > {activite}  </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
export const NombreDeSejourMCOHistogrammes = ({ nombreDeSejourMCOViewModel }: NombreDeSejourMCOHistogrammesProps) => {
    const { wording } = useDependencies();
    const [selectedFrequency, setSelectedFrequency] = useState(wording.ANNUEL);


    const handleFrequency = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedFrequency(event.target.value);
    }

    return (
        <>
            <div className={styles["filtersgroup"]}>
                <div className={`${styles["filterElement"]} fr-checkbox-group`}>
                    <input aria-describedby="checkboxe-year-messages" checked={selectedFrequency === wording.ANNUEL} id="checkboxe-year" name="checkboxe-year" onChange={handleFrequency} type="checkbox" value={wording.ANNUEL} />
                    <label className="fr-label" htmlFor="checkboxe-year">
                        {wording.ANNUEL}
                    </label>
                    <div aria-live="assertive" className="fr-messages-group" id="checkboxe-year-messages">
                    </div>
                </div>
                <div className={`${styles["filterElement"]} fr-checkbox-group`}>
                    <input aria-describedby="checkboxe-month-messages" checked={selectedFrequency === wording.MENSUEL} id="checkboxe-month" name="checkboxe-month" onChange={handleFrequency} type="checkbox" value={wording.MENSUEL} />
                    <label className="fr-label" htmlFor="checkboxe-month">
                        {wording.MENSUEL}
                    </label>
                    <div aria-live="assertive" className="fr-messages-group" id="checkboxe-month-messages">
                    </div>
                </div>
                {selectedFrequency === wording.MENSUEL ? <MontlyFilters nombreDeSejourMCOViewModel={nombreDeSejourMCOViewModel} /> : <></>}
            </div>
            {selectedFrequency === wording.ANNUEL ?
                <HistogrammeVerticalABandes
                    annéesTotales={nombreDeSejourMCOViewModel.NOMBRE_ANNEES}
                    créeLeLibelléDuTooltip={nombreDeSejourMCOViewModel.tooltipSéjoursMCO}
                    data={nombreDeSejourMCOViewModel.getHistogrammeDataSet()}
                    id={nombreDeSejourMCOViewModel.identifiantDeLaLégendeDesSéjoursMCO}
                    idDeLaLégende={nombreDeSejourMCOViewModel.identifiantDeLaLégendeDesSéjoursMCO}
                    identifiants={nombreDeSejourMCOViewModel.getIdentifiantTableIndicateur()}
                    libellés={nombreDeSejourMCOViewModel.années}
                    valeurs={nombreDeSejourMCOViewModel.getValeurTableIndicateur()}
                />
                : <div> histogramme mensuel</div>
            }
        </>
    );
};
