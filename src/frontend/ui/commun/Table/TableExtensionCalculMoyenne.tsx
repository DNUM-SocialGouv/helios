import styles from "./Table.module.css";

interface TableExtensionCalculMoyenneProps {
  dataSource: Record<string, any>[];
}

export function TableExtensionCalculMoyenne({ dataSource }: TableExtensionCalculMoyenneProps) {
  const result = {
    capacite_totale: 0,
    realisation_activite: 0,
    hp: 0,
    ht: 0,
    aj: 0,
    prestations_externes_vs_direct: 0,
    rotation_personnel: 0,
    ETP_vacants: 0,
    abesenteisme: 0,
    CAF: 0,
    vetuste: 0,
    resultat_net_comptable: 0,
  };

  const calculMoyenne = (): typeof result => {
    // Sum the values from each line in dataSource
    dataSource.forEach((ligne) => {
      result.capacite_totale += parsDataToNumber(ligne["capacite_totale"]);
      result.realisation_activite += parsDataToNumber(ligne["realisation_activite"]);
      result.hp += parsDataToNumber(ligne["hp"]);
      result.ht += parsDataToNumber(ligne["ht"]);
      result.aj += parsDataToNumber(ligne["aj"]);
      result.prestations_externes_vs_direct += parsDataToNumber(ligne["prestations_externes_vs_direct"]);
      result.rotation_personnel += parsDataToNumber(ligne["rotation_personnel"]);
      result.ETP_vacants += parsDataToNumber(ligne["ETP_vacants"]);
      result.abesenteisme += parsDataToNumber(ligne["abesenteisme"]);
      result.CAF += parsDataToNumber(ligne["CAF"]);
      result.vetuste += parsDataToNumber(ligne["vetuste"]);
      result.resultat_net_comptable += parsDataToNumber(ligne["resultat_net_comptable"]);
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
