import styles from "./Table.module.css";

interface TableExtensionCalculMoyenneProps {
  dataSource: Record<string, any>[];
}

export function TableExtensionCalculMoyenne({ dataSource }: TableExtensionCalculMoyenneProps) {
  const result = {
    capaciteMoyenne: 0,
    realisationAcitiviteMoyenne: 0,
    hebergementPermanentMoyenne: 0,
    hebergementTemporaireMoyenne: 0,
    acceuilDeJourMoyenne: 0,
    prestationExterneMoyenne: 0,
    rotationPersonnelMoyenne: 0,
    etpVacantMoyenne: 0,
    absenteismeMoyenne: 0,
    tauxCafMoyenne: 0,
    vetusteConstructionMoyenne: 0,
    resultatNetComptableMoyenne: 0,
  };

  return (
    <>
      <tr className={styles["table-tr-avrage"]}>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>{dataSource.length} établissements</td>
        <td>
          <span>Moyenne</span>
          <button className={"fr-fi-information-line " + styles["info-container-bulle"]} onClick={() => {}} />
        </td>
        {Object.keys(result).map((cle) => {
          if (cle === "resultatNetComptableMoyenne") {
            return (
              <td key={cle}>
                {
                  dataSource[0][cle]
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
            return <td key={cle}>{dataSource[0][cle]}</td>;
          } else {
            return <td key={cle}>{dataSource[0][cle]} %</td>;
          }
        })}
      </tr>
    </>
  );
}
