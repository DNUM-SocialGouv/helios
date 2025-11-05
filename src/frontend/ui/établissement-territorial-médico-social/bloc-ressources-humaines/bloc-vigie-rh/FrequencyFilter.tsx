import styles from "./FrequencyFilter.module.css";

type FrequencyFilterProps = Readonly<{
  identifiant: string;
  selectedFrequency: string;
  handleFrequency: any;
  ListeFrquences: string[];
}>;

export const FrequencyFilter = ({ identifiant, selectedFrequency, handleFrequency, ListeFrquences }: FrequencyFilterProps) => {

  return (
    <div className={styles["filtersgroup"]}>
      <div className={`${styles["filterElement"]} fr-checkbox-group`}>
        <input
          aria-describedby={`checkboxe-year-messages-${identifiant}`}
          checked={selectedFrequency === ListeFrquences[0]}
          id={`checkboxe-year-${identifiant}`}
          name={`checkboxe-year-${identifiant}`}
          onChange={handleFrequency}
          type="checkbox"
          value={ListeFrquences[0]} />
        <label className="fr-label" htmlFor={`checkboxe-year-${identifiant}`} >
          {ListeFrquences[0]}
        </label>
        <div aria-live="assertive" className="fr-messages-group" id={`checkboxe-year-messages-${identifiant}`} >
        </div>
      </div>
      <div className={`${styles["filterElement"]} fr-checkbox-group`}>
        <input
          aria-describedby={`checkboxe-month-messages-${identifiant}`}
          checked={selectedFrequency === ListeFrquences[1]}
          id={`checkboxe-month-${identifiant}`}
          name={`checkboxe-month-${identifiant}`}
          onChange={handleFrequency}
          type="checkbox"
          value={ListeFrquences[1]} />
        <label className="fr-label" htmlFor={`checkboxe-month-${identifiant}`}>
          {ListeFrquences[1]}
        </label>
        <div aria-live="assertive" className="fr-messages-group" id={`checkboxe-month-messages-${identifiant}`}>
        </div>
      </div>
    </div>
  )
}
