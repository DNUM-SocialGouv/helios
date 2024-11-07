import styles from "./Table.module.css";

interface TableExtensionCalculMoyenneProps {
  dataSource: Record<string, any>[];
}

export function TableExtensionCalculMoyenne({ dataSource }: TableExtensionCalculMoyenneProps) {
  const result = {
    capacite: 0,
    realisationActivite: 0,
    hebergementPermanent: 0,
    hebergementTemporaire: 0,
    acceuilDeJour: 0,
    prestationExterne: 0,
    rotationPersonnel: 0,
    etpVacant: 0,
    absenteisme: 0,
    tauxCaf: 0,
    vetusteConstruction: 0,
    resultatNetComptable: 0,
  };

  const calculMoyenne = (): typeof result => {
    // Sum the values from each line in dataSource
    dataSource.forEach((ligne) => {
      result.capacite += parsDataToNumber(ligne["capacite_totale"]);
      result.realisationActivite += parsDataToNumber(ligne["realisation_activite"]);
      result.hebergementPermanent += parsDataToNumber(ligne["hp"]);
      result.hebergementTemporaire += parsDataToNumber(ligne["ht"]);
      result.acceuilDeJour += parsDataToNumber(ligne["aj"]);
      result.prestationExterne += parsDataToNumber(ligne["prestations_externes_vs_direct"]);
      result.rotationPersonnel += parsDataToNumber(ligne["rotation_personnel"]);
      result.etpVacant += parsDataToNumber(ligne["ETP_vacants"]);
      result.absenteisme += parsDataToNumber(ligne["abesenteisme"]);
      result.tauxCaf += parsDataToNumber(ligne["CAF"]);
      result.vetusteConstruction += parsDataToNumber(ligne["vetuste"]);
      result.resultatNetComptable += parsDataToNumber(ligne["resultat_net_comptable"]);
    });

    // Calculate the average
    const numberOfLines = dataSource.length;
    if (numberOfLines > 0) {
      for (const key in result) {
        result[key as keyof typeof result] /= numberOfLines;
      }
    }

    return result;
  };

  const parsDataToNumber = (value: string): number => {
    const newValue = value.includes("%") ? +value.split(" ")[0] : +value.split("€")[0].replace(/\s/g, "");
    return newValue;
  };

  const averages = calculMoyenne();

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
        {Object.keys(averages).map((cle) => {
          if (cle === "resultat_net_comptable") {
            return <td key={cle}>{averages[cle as keyof typeof averages]} €</td>;
          } else if (cle === "capacite_totale") {
            return <td key={cle}>{averages[cle as keyof typeof averages]}</td>;
          } else {
            return <td key={cle}>{averages[cle as keyof typeof averages]} %</td>;
          }
        })}
      </tr>
    </>
  );
}
