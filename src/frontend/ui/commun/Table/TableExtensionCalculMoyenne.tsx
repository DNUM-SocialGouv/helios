import { moyenneInitialValues } from "../../comparaison/model/data";
import { MoyenneResultatComparaison } from "../../home/ComparaisonViewModel";
import styles from "./Table.module.css";

interface TableExtensionCalculMoyenneProps {
  dataSource: MoyenneResultatComparaison;
}

export function TableExtensionCalculMoyenne({ dataSource }: TableExtensionCalculMoyenneProps) {
  const result = moyenneInitialValues;

  return (
    <tr className={styles["table-tr-avrage"]}>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>{dataSource["nombreEtablissement"]} établissements</td>
      <td>
        <span>Moyenne</span>
        <button className={"fr-fi-information-line " + styles["info-container-bulle"]} onClick={() => {}} />
      </td>
      {Object.keys(result).map((cle: string) => {
        if (cle === "resultatNetComptableMoyenne") {
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
  );
}
