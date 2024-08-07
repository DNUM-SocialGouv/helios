import { useDependencies } from "../contexts/useDependencies";
import styles from "./ToggelMultipleBlocs.module.css";

type ToggelMultipleBlocsProps = Readonly<{
  statusBlocs: boolean[];
  allTrue: (arg0: boolean[]) => boolean;
  allFalse: (arg0: boolean[]) => boolean;
  setAllValue: (arg0: boolean) => void;
}>;

export const ToggelMultipleBlocs = ({ allTrue, allFalse, setAllValue, statusBlocs }: ToggelMultipleBlocsProps) => {

  const { wording } = useDependencies();

  return (
    <div className={styles["toggelMultipleBtnContainer"]}>
      {allTrue(statusBlocs) && (
        <button className="fr-btn fr-btn--secondary" onClick={() => setAllValue(false)}>
         {wording.TOUT_REPLIER}
        </button>
      )}
      {allFalse(statusBlocs) && (
        <button className="fr-btn fr-btn--secondary" onClick={() => setAllValue(true)}>
          {wording.TOUT_DEPLIER}
        </button>
      )}
      {!allTrue(statusBlocs) && !allFalse(statusBlocs) && (
        <button className="fr-btn fr-btn--secondary" onClick={() => setAllValue(true)}>
          {wording.TOUT_DEPLIER}
        </button>
      )}
    </div>
  );
};
