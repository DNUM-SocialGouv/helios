import { useState } from "react";

import { moyenneInitialValues } from "../../comparaison/model/data";
import { MoyenneResultatComparaison } from "../../home/ComparaisonViewModel";
import { InfoBulle } from "../InfoBulle/InfoBulle";
import styles from "./Table.module.css";

interface TableExtensionCalculMoyenneProps {
  dataSource: MoyenneResultatComparaison;
}

export function TableExtensionCalculMoyenne({ dataSource }: TableExtensionCalculMoyenneProps) {
  const result = moyenneInitialValues;

  const [estCeOuvert, setEstCeOuvert] = useState<boolean>(false);

  return (
    <>
      <tr className={styles["table-tr-avrage"]}>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>{dataSource["nombreEtablissement"]} établissements</td>
        <td>
          <span>Moyenne</span>
          <button
            className={"fr-fi-information-line " + styles["info-container-bulle"]}
            onClick={() => {
              setEstCeOuvert(true);
            }}
          >
            <span className={styles["tooltip"]}>This is a tooltip!</span>
          </button>
        </td>
        {Object.keys(result).map((cle: string) => {
          if (cle === "resultatNetComptableMoyenne" || cle === "roulementNetGlobalMoyenne") {
            return (
              <td key={cle}>
                {
                  dataSource[cle]
                    .toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })
                    .split(",")[0]
                }{" "}
                €
              </td>
            );
          } else if (cle === "capaciteMoyenne") {
            return <td key={cle}>{dataSource[cle]}</td>;
          } else {
            return <td key={cle}>{dataSource[cle as keyof MoyenneResultatComparaison]} %</td>;
          }
        })}
      </tr>
      <InfoBulle estCeOuvert={estCeOuvert} identifiant="info-bull-comparaison-table" setEstCeOuvert={setEstCeOuvert} titre="Calcul de la moyenne">
        <>Les données non renseignées sont exclues du calcul de la moyenne.</>
      </InfoBulle>
    </>
  );
}
