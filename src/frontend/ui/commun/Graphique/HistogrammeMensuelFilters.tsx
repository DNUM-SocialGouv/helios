import { ChangeEvent } from "react";

import { Wording } from "../../../configuration/wording/Wording";
import { SelectionAnneeTags } from "../Tag/SelectionAnneeTags";
import styles from "./HistogrammeMensuelFilters.module.css";


type HistogrammeMensuelFiltersProps = Readonly<{
    identifiant: string;
    selectedFrequency: string;
    handleFrequency: any;
    ListeActivites: string[];
    selectedActivity: string;
    setSelectedActivity: any;
    ListeAnnees: number[];
    setAnnéeEnCours: any;
    wording: Wording;
}>;

export const HistogrammeMensuelFilters = ({ identifiant, selectedFrequency, handleFrequency, ListeActivites, selectedActivity, setSelectedActivity, ListeAnnees, setAnnéeEnCours, wording }: HistogrammeMensuelFiltersProps) => {
    const handleOnChangeMCO = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedActivity(event.target.value)
    }
    return (
        <div className={styles["filtersgroup"]}>
            <div className={`${styles["filterElement"]} fr-checkbox-group`}>
                <input aria-describedby={`checkboxe-year-messages-${identifiant}`} checked={selectedFrequency === wording.ANNUEL} id={`checkboxe-year-${identifiant}`} name={`checkboxe-year-${identifiant}`} onChange={handleFrequency} type="checkbox" value={wording.ANNUEL} />
                <label className="fr-label" htmlFor={`checkboxe-year-${identifiant}`} >
                    {wording.ANNUEL}
                </label>
                <div aria-live="assertive" className="fr-messages-group" id={`checkboxe-year-messages-${identifiant}`} >
                </div>
            </div>
            <div className={`${styles["filterElement"]} fr-checkbox-group`}>
                <input aria-describedby={`checkboxe-month-messages-${identifiant}`} checked={selectedFrequency === wording.MENSUEL} id={`checkboxe-month-${identifiant}`} name={`checkboxe-month-${identifiant}`} onChange={handleFrequency} type="checkbox" value={wording.MENSUEL} />
                <label className="fr-label" htmlFor={`checkboxe-month-${identifiant}`}>
                    {wording.MENSUEL}
                </label>
                <div aria-live="assertive" className="fr-messages-group" id={`checkboxe-month-messages-${identifiant}`}>
                </div>
            </div>
            {selectedFrequency === wording.MENSUEL ?
                <div className={styles["filtersgroupMonthly"]}>
                    <SelectionAnneeTags annees={ListeAnnees} id="activite-mco-mensuel" prefix="" setAnnéeEnCours={setAnnéeEnCours} />
                    {ListeActivites.length > 1 ? <div className={`${styles["filterActiviteElement"]} fr-select-group`}>
                        <label className="fr-label" htmlFor="select-hint"> Sélectionner une activité  </label>
                        <select className="fr-select" id="select-hint" name="select-hint" onChange={handleOnChangeMCO} title='Activités MCO'>
                            {ListeActivites.map((activite) => (
                                <option key={activite} selected={activite === selectedActivity} value={activite} > {activite}  </option>
                            ))}
                        </select>
                    </div> : <></>}
                </div>
                :
                <></>
            }
        </div>
    )
}