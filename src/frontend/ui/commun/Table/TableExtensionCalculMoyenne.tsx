import { Dispatch, SetStateAction } from "react";

import styles from "./Table.module.css";
import { moyenneInitialValues } from "../../comparaison/model/data";
import { MoyenneResultatComparaison } from "../../home/ComparaisonViewModel";

interface TableExtensionCalculMoyenneProps {
  dataSource?: MoyenneResultatComparaison;
  total?: number;
  setEstCeOuvert?: Dispatch<SetStateAction<boolean>>;
}

export function TableExtensionCalculMoyenne({ dataSource, total, setEstCeOuvert }: TableExtensionCalculMoyenneProps) {
  const result = moyenneInitialValues;

  return (
    <>
      <tr className={styles["table-tr-avrage"]}>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td className="fr-cell--center fr-cell--fixed">{total + (total && total > 1 ? " établissements" : " établissement")}
        </td>
        <td className="fr-cell--center">
          <span>Moyenne</span>
          <button
            className={"fr-fi-information-line " + styles["info-container-bulle"]}
            onClick={() => {
              if (setEstCeOuvert) {
                setEstCeOuvert(true);
              }
            }}
            title="Détails de la calcul de la moyenne"
          >
            <span className={styles["tooltip"]}>This is a tooltip!</span>
          </button>
        </td>
        {Object.keys(result).map((cle: string) => {
          if (cle === "resultatNetComptableMoyenne" || cle === "roulementNetGlobalMoyenne") {
            return (
              <td className="fr-cell--center" key={cle}>
                {dataSource && dataSource[cle] ? `${dataSource[cle]
                  .toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })
                  .split(",")[0]} €`
                  : `-`}
              </td>
            );
          } else if (cle === "capaciteMoyenne" || cle === "fileActivePersonnesAccompagnesMoyenne") {
            return <td className="fr-cell--center" key={cle}>{dataSource && dataSource[cle] ? dataSource[cle] : `-`}</td>;
          } else {
            return <td className="fr-cell--center" key={cle}></td>;
          }
        })}
      </tr>
    </>
  );
}
