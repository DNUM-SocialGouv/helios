import { ChangeEvent } from "react";

import styles from "./HistogrammeMensuelFilters.module.css";
import { Wording } from "../../../configuration/wording/Wording";
import { SelectionAnneeTags } from "../Tag/SelectionAnneeTags";


type HistogrammeMensuelFiltersProps = Readonly<{
  identifiant: string;
  selectedFrequency: string;
  handleFrequency: any;
  ListeActivites: string[];
  selectedActivity: string;
  setSelectedActivity: any;
  ListeAnnees?: number[];
  setAnnéeEnCours?: any;
  wording: Wording;
  showFrequencySwitch?: boolean;
  showYearSelection?: boolean;
  activiteLabel?: string;
}>;

export const HistogrammeMensuelFilters = ({
  identifiant,
  selectedFrequency,
  handleFrequency,
  ListeActivites,
  selectedActivity,
  setSelectedActivity,
  ListeAnnees = [],
  setAnnéeEnCours,
  wording,
  showFrequencySwitch = true,
  showYearSelection = true,
  activiteLabel = wording.SELECTIONNER_UNE_ACTIVITE,
}: HistogrammeMensuelFiltersProps) => {
  const handleOnChangeMCO = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedActivity(event.target.value);
  };

  const shouldDisplayMonthlyControls = showFrequencySwitch ? selectedFrequency === wording.MENSUEL : true;

  return (
    <div className={styles["filtersgroup"]}>
      {showFrequencySwitch ? (
        <>
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
        </>
      ) : null}
      {shouldDisplayMonthlyControls ? (
        <div className={styles["filtersgroupMonthly"]}>
          {showYearSelection && ListeAnnees.length > 0 && setAnnéeEnCours ? (
            <SelectionAnneeTags annees={ListeAnnees} id="activite-mco-mensuel" prefix="" setAnnéeEnCours={setAnnéeEnCours} />
          ) : null}
          {ListeActivites.length > 1 ? (
            <div className={`${styles["filterActiviteElement"]} fr-select-group`}>
              <label className="fr-label" htmlFor="select-hint"> {activiteLabel}  </label>
              <select className="fr-select" id="select-hint" name="select-hint" onChange={handleOnChangeMCO} title={activiteLabel} value={selectedActivity}>
                {ListeActivites.map((activite) => (
                  <option key={activite} value={activite} > {activite}  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
